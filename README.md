# اطلس دیجیتال ادبیات فارسی

وب‌سایت پژوهشی فارسی، راست‌به‌چپ و واکنش‌گرا برای کاوش شاعران، آثار، منابع، کانون‌های ادبی و مجموعه‌دادهٔ زمان‌مند شعر فارسی. پروژه با **Next.js App Router** ساخته شده و برای استقرار مستقیم روی Vercel آماده است.

## امکانات

- نمایهٔ سده‌ای سخنوران، پروفایل‌های مستند و کاتالوگ آثار کلاسیک
- کتابخانهٔ منابع باز و اطلس تعاملی کانون‌ها و جریان‌های ادبی
- خواندن مستقیم فایل بزرگ TSV در مرورگر با Web Worker
- پردازش جریانی فایل برای جلوگیری از قفل‌شدن رابط کاربری
- جست‌وجوی فارسی‌نرمال‌شده در شاعر، کتاب، عنوان و متن شعر
- فیلتر شاعر و سده، آمار زنده، شاعران پرتکرار و صفحه‌بندی نتایج
- تشخیص خودکار فایل مفقود، صفحهٔ HTML اشتباه، Git LFS pointer و ستون‌های نامعتبر
- بدون دیتابیس، کلید API یا متغیر محیطی

## افزودن مجموعه‌داده

این پکیج عمداً فایل ۸۰ مگابایتی مجموعه‌داده را شامل نمی‌شود. فایل زیر را دریافت کنید:

https://github.com/aghasemi/ChronologicalPersianPoetryDataset/blob/master/poems_with_more_info.tsv

نام فایل را تغییر ندهید و آن را دقیقاً در این مسیر قرار دهید:

```text
public/data/poems_with_more_info.tsv
```

ساختار صحیح مخزن:

```text
Persian-Literature-Digital-Atlas/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── data.ts
├── public/
│   ├── data/
│   │   ├── README.md
│   │   └── poems_with_more_info.tsv   ← فایل را اینجا بگذارید
│   └── workers/
│       └── poetry-dataset-worker.js
├── scripts/
├── package.json
├── package-lock.json
├── next.config.ts
└── vercel.json
```

فایل حدود ۸۰ مگابایت است و از سقف ۲۵ مگابایتی آپلود در رابط وب GitHub بزرگ‌تر است. آن را با **GitHub Desktop** یا Git CLI اضافه کنید:

```bash
git add public/data/poems_with_more_info.tsv
git commit -m "Add Persian poetry dataset"
git push origin main
```

اگر از Git LFS استفاده می‌کنید، مطمئن شوید Vercel هنگام Clone فایل واقعی را دریافت می‌کند. خود سایت اشاره‌گر LFS را تشخیص می‌دهد و پیام خطای روشن نشان می‌دهد.

## اجرای محلی

نیازمندی: Node.js نسخهٔ 22.

```bash
npm ci
npm run dev
```

سپس `http://localhost:3000` را باز کنید، وارد بخش «پیکرهٔ شعر» شوید و «بارگذاری پیکره» را بزنید.

## کنترل کیفیت و ساخت

```bash
npm run test:dataset
npm run lint
npm run typecheck
npm run build
```

## استقرار در Vercel

1. محتویات استخراج‌شدهٔ این ZIP را در **ریشهٔ مخزن GitHub** قرار دهید؛ خود ZIP یا پوشهٔ والد را Upload نکنید.
2. فایل داده را در `public/data/poems_with_more_info.tsv` بگذارید و Push کنید.
3. مخزن را در Vercel Import کنید.
4. Framework Preset را روی **Next.js** بگذارید.
5. Root Directory باید خالی یا `.` باشد.
6. Build Command همان `npm run build` است و Output Directory را Override نکنید.
7. Deploy را اجرا کنید.

### دربارهٔ فایل index

در پروژهٔ Next.js App Router نباید `index.html` را دستی در ریشه ساخت. فایل [app/page.tsx](./app/page.tsx) صفحهٔ اصلی مسیر `/` است و Next.js/Vercel آن را به‌عنوان index می‌سازند. خطای قبلی Vercel با متن `Couldn't find any pages or app directory` به‌خاطر قرارگرفتن سورس در پوشهٔ اشتباه بود؛ در این پکیج پوشهٔ `app` و `package.json` هر دو مستقیماً در ریشه‌اند.

جزئیات منشأ داده و مجوزها در [DATA_SOURCES.md](./DATA_SOURCES.md) آمده است.
