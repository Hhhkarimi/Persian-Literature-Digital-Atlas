/* global self, fetch, TextDecoder */

"use strict";

const REQUIRED_COLUMNS = ["poet", "century", "book_title", "poem_title", "poem"];
let records = [];

const normalizePersian = (value) => String(value ?? "")
  .normalize("NFKC")
  .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
  .replace(/[يى]/g, "ی")
  .replace(/ك/g, "ک")
  .replace(/[ۀة]/g, "ه")
  .replace(/ؤ/g, "و")
  .replace(/إ|أ/g, "ا")
  .replace(/‌/g, " ")
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim()
  .toLowerCase();

function createTSVParser(onRow) {
  let row = [];
  let field = "";
  let quoted = false;
  let afterQuote = false;
  let atFieldStart = true;
  let skipLineFeed = false;

  const finishField = () => {
    row.push(field);
    field = "";
    atFieldStart = true;
  };

  const finishRow = () => {
    finishField();
    if (row.length > 1 || row[0] !== "") onRow(row);
    row = [];
  };

  const write = (chunk) => {
    for (let index = 0; index < chunk.length; index += 1) {
      let character = chunk[index];
      if (skipLineFeed) {
        skipLineFeed = false;
        if (character === "\n") continue;
      }

      let reprocess = true;
      while (reprocess) {
        reprocess = false;
        if (afterQuote) {
          if (character === "\"") {
            field += "\"";
            afterQuote = false;
            quoted = true;
            atFieldStart = false;
            continue;
          }
          afterQuote = false;
          quoted = false;
          reprocess = true;
          continue;
        }

        if (quoted) {
          if (character === "\"") afterQuote = true;
          else field += character;
          continue;
        }

        if (character === "\"" && atFieldStart) {
          quoted = true;
          atFieldStart = false;
        } else if (character === "\t") {
          finishField();
        } else if (character === "\n") {
          finishRow();
        } else if (character === "\r") {
          finishRow();
          skipLineFeed = true;
        } else {
          field += character;
          atFieldStart = false;
        }
      }
    }
  };

  const end = () => {
    if (afterQuote) {
      afterQuote = false;
      quoted = false;
    }
    if (field.length || row.length) finishRow();
  };

  return { write, end };
}

function fail(code, message) {
  self.postMessage({ type: "error", code, message });
}

async function loadDataset(url) {
  records = [];
  let response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    fail("NETWORK", "مرورگر نتوانست به فایل داده دسترسی پیدا کند. مسیر و استقرار Vercel را بررسی کنید.");
    return;
  }

  if (!response.ok) {
    fail("HTTP", response.status === 404
      ? "فایل poems_with_more_info.tsv در مسیر public/data پیدا نشد. فایل را در همین مسیر قرار دهید و دوباره Deploy کنید."
      : `دریافت فایل با خطای HTTP ${response.status} متوقف شد.`);
    return;
  }

  const total = Number(response.headers.get("content-length")) || 0;
  const decoder = new TextDecoder("utf-8");
  let loaded = 0;
  let header = null;
  let columnIndex = null;
  let rowNumber = 0;
  let firstText = "";
  let lastProgressAt = 0;
  const poetCounts = new Map();
  const centuryCounts = new Map();

  const parser = createTSVParser((values) => {
    if (!header) {
      header = values.map((value, index) => value.replace(index === 0 ? /^\uFEFF/ : /$^/, "").trim().toLowerCase());
      const missing = REQUIRED_COLUMNS.filter((name) => !header.includes(name));
      if (missing.length) throw new Error(`HEADER:${missing.join(",")}`);
      columnIndex = Object.fromEntries(REQUIRED_COLUMNS.map((name) => [name, header.indexOf(name)]));
      return;
    }

    rowNumber += 1;
    const record = {
      id: rowNumber,
      poet: values[columnIndex.poet]?.trim() || "",
      century: values[columnIndex.century]?.trim() || "",
      bookTitle: values[columnIndex.book_title]?.trim() || "",
      poemTitle: values[columnIndex.poem_title]?.trim() || "",
      poem: (values[columnIndex.poem] || "").replace(/\\n/g, "\n").trim(),
    };
    records.push(record);
    if (record.poet) poetCounts.set(record.poet, (poetCounts.get(record.poet) || 0) + 1);
    if (record.century) centuryCounts.set(record.century, (centuryCounts.get(record.century) || 0) + 1);
  });

  try {
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        loaded += value.byteLength;
        const text = decoder.decode(value, { stream: true });
        if (firstText.length < 512) firstText += text.slice(0, 512 - firstText.length);
        if (firstText.startsWith("version https://git-lfs.github.com/spec/v1")) {
          fail("LFS_POINTER", "فایل موجود فقط اشاره‌گر Git LFS است، نه مجموعه‌دادهٔ واقعی. فایل ۸۰ مگابایتی اصلی را با GitHub Desktop یا Git CLI بارگذاری کنید.");
          return;
        }
        if (/^\s*<(?:!doctype|html)/i.test(firstText)) {
          fail("HTML", "به‌جای TSV یک صفحهٔ HTML دریافت شد. لینک GitHub را Save نکرده و فایل Raw اصلی را قرار دهید.");
          return;
        }
        parser.write(text);
        const now = Date.now();
        if (now - lastProgressAt > 150) {
          lastProgressAt = now;
          self.postMessage({ type: "progress", loaded, total, rows: rowNumber });
        }
      }
      parser.write(decoder.decode());
    } else {
      const text = await response.text();
      loaded = new TextEncoder().encode(text).byteLength;
      firstText = text.slice(0, 512);
      if (firstText.startsWith("version https://git-lfs.github.com/spec/v1")) {
        fail("LFS_POINTER", "فایل موجود فقط اشاره‌گر Git LFS است، نه مجموعه‌دادهٔ واقعی.");
        return;
      }
      if (/^\s*<(?:!doctype|html)/i.test(firstText)) {
        fail("HTML", "به‌جای TSV یک صفحهٔ HTML دریافت شد.");
        return;
      }
      parser.write(text);
    }
    parser.end();
  } catch (error) {
    if (String(error.message || error).startsWith("HEADER:")) {
      const missing = String(error.message).slice(7);
      fail("HEADER", `ستون‌های الزامی فایل پیدا نشدند: ${missing}. فایل باید ستون‌های poet، century، book_title، poem_title و poem را داشته باشد.`);
    } else {
      fail("PARSE", "ساختار TSV هنگام خواندن نامعتبر بود یا پردازش فایل متوقف شد.");
    }
    return;
  }

  if (!header || records.length === 0) {
    fail("EMPTY", "فایل داده خالی است یا هیچ رکورد قابل استفاده‌ای ندارد.");
    return;
  }

  const byCountThenName = (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fa");
  const poets = [...poetCounts.entries()].sort(byCountThenName);
  const centuries = [...centuryCounts.entries()].sort((a, b) => {
    const aNumber = Number(String(a[0]).match(/\d+(?:\.\d+)?/)?.[0]);
    const bNumber = Number(String(b[0]).match(/\d+(?:\.\d+)?/)?.[0]);
    if (Number.isFinite(aNumber) && Number.isFinite(bNumber) && aNumber !== bNumber) return aNumber - bNumber;
    return a[0].localeCompare(b[0], "fa");
  });
  self.postMessage({
    type: "ready",
    metadata: { rows: records.length, fileBytes: loaded || total, poets, centuries, topPoets: poets.slice(0, 12) },
  });
}

function searchDataset({ query = "", poet = "", century = "", page = 1, pageSize = 20 }) {
  self.postMessage({ type: "search-start" });
  const tokens = normalizePersian(query).split(" ").filter(Boolean);
  const wantedPoet = String(poet);
  const wantedCentury = String(century);
  const safePageSize = Math.min(100, Math.max(1, Number(pageSize) || 20));
  const safePage = Math.max(1, Number(page) || 1);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  let total = 0;
  const results = [];

  for (const record of records) {
    if (wantedPoet && record.poet !== wantedPoet) continue;
    if (wantedCentury && record.century !== wantedCentury) continue;
    if (tokens.length) {
      const searchable = normalizePersian(`${record.poet} ${record.century} ${record.bookTitle} ${record.poemTitle} ${record.poem}`);
      if (!tokens.every((token) => searchable.includes(token))) continue;
    }
    if (total >= start && total < end) {
      const poem = record.poem.length > 900 ? `${record.poem.slice(0, 900)}…` : record.poem;
      results.push({ ...record, poem });
    }
    total += 1;
  }

  self.postMessage({ type: "results", total, page: safePage, pageSize: safePageSize, results });
}

self.onmessage = (event) => {
  const message = event.data || {};
  if (message.type === "load") loadDataset(message.url);
  if (message.type === "search") searchDataset(message);
};
