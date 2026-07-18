import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const workerSource = await readFile(new URL("../public/workers/poetry-dataset-worker.js", import.meta.url), "utf8");

function createWorker(body, status = 200) {
  const messages = [];
  const waiters = [];
  const self = {
    postMessage(message) {
      messages.push(message);
      for (const waiter of [...waiters]) {
        if (waiter.predicate(message)) {
          waiter.resolve(message);
          waiters.splice(waiters.indexOf(waiter), 1);
        }
      }
    },
  };
  const context = vm.createContext({
    self,
    fetch: async () => new Response(body, {
      status,
      headers: { "content-type": "text/tab-separated-values; charset=utf-8" },
    }),
    Response,
    ReadableStream,
    TextDecoder,
    TextEncoder,
    Date,
    Map,
    Number,
    Object,
    String,
    RegExp,
    Error,
    console,
  });
  vm.runInContext(workerSource, context, { filename: "poetry-dataset-worker.js" });
  const waitFor = (predicate) => new Promise((resolve, reject) => {
    const existing = messages.find(predicate);
    if (existing) return resolve(existing);
    const timer = setTimeout(() => reject(new Error("worker message timeout")), 2000);
    waiters.push({ predicate, resolve: (message) => { clearTimeout(timer); resolve(message); } });
  });
  return { self, waitFor };
}

test("TSV را می‌خواند و جست‌وجوی فارسی را نرمال می‌کند", async () => {
  const tsv = [
    "poet\tcentury\tbook_title\tpoem_title\tpoem",
    "حافظ\t8\tدیوان حافظ\tغزل ۱\tالا یا ایها الساقی",
    "سعدی\t7\tگلستان\tباب اول\tبنی آدم اعضای یکدیگرند",
    "مولوی\t7\tمثنوی\tدفتر اول\tبشنو از نی چون حکایت می‌کند",
  ].join("\n");
  const worker = createWorker(tsv);
  worker.self.onmessage({ data: { type: "load", url: "/data/test.tsv" } });
  const ready = await worker.waitFor((message) => message.type === "ready");
  assert.equal(ready.metadata.rows, 3);
  assert.equal(ready.metadata.poets.length, 3);
  worker.self.onmessage({ data: { type: "search", query: "ساقي", poet: "", century: "", page: 1, pageSize: 20 } });
  const results = await worker.waitFor((message) => message.type === "results");
  assert.equal(results.total, 1);
  assert.equal(results.results[0].poet, "حافظ");
});

test("اشاره‌گر Git LFS را به‌جای داده نمی‌پذیرد", async () => {
  const pointer = "version https://git-lfs.github.com/spec/v1\noid sha256:abc\nsize 80000000\n";
  const worker = createWorker(pointer);
  worker.self.onmessage({ data: { type: "load", url: "/data/test.tsv" } });
  const error = await worker.waitFor((message) => message.type === "error");
  assert.equal(error.code, "LFS_POINTER");
});

test("ستون‌های الزامی فایل را اعتبارسنجی می‌کند", async () => {
  const worker = createWorker("name\ttext\nحافظ\tغزل");
  worker.self.onmessage({ data: { type: "load", url: "/data/test.tsv" } });
  const error = await worker.waitFor((message) => message.type === "error");
  assert.equal(error.code, "HEADER");
});
