"use client";

import {
  ArrowLeft, ArrowUpLeft, BookMarked, BookOpen, Bot, Check,
  CheckCircle2, ChevronDown, ChevronLeft, CircleUserRound, Clock3, Database,
  ExternalLink, FileCheck2, FileText, Filter, Globe2, Landmark, Library,
  ListFilter, Map, MapPin, Menu, Network, Quote, Search, ShieldCheck,
  Sparkles, Tags, TimerReset, UserRoundSearch, UsersRound, X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  featuredPoets,
  librarySources,
  literaryCenters,
  literaryMovements,
  openReferences,
  poetDirectory,
  workCatalog,
} from "./data";

type View = "home" | "explore" | "corpus" | "library" | "atlas" | "about";

const examples = [
  "تحول غزل از سبک عراقی تا هندی",
  "شبکهٔ ادبی شاعران خراسان در سدهٔ ششم",
  "تذکره‌هایی که از شاعران زن یاد کرده‌اند",
];


const faNumber = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
const centuryLabel = (century: number) => new Intl.NumberFormat("fa-IR").format(century);

function Brand() {
  return <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="تاریخ ادبیات فارسی دیجیتال">
    <span className="brand-mark" aria-hidden="true"><span>تا</span></span>
    <span className="brand-copy"><strong>تاریخ ادبیات فارسی دیجیتال</strong><small>دانشگاه بجنورد · طرح پژوهشی INSF</small></span>
  </button>;
}

function Header({ view, navigate, onLogin }: { view: View; navigate: (view: View) => void; onLogin: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items: { key: View; label: string }[] = [
    { key: "explore", label: "کاوش" }, { key: "corpus", label: "پیکرهٔ شعر" }, { key: "library", label: "کتابخانه" },
    { key: "atlas", label: "نقشهٔ ادبی" }, { key: "about", label: "درباره" },
  ];
  return <header className="site-header">
    <div onClick={() => navigate("home")}><Brand /></div>
    <nav className={mobileOpen ? "main-nav open" : "main-nav"} aria-label="ناوبری اصلی">
      {items.map(item => <button key={item.key} className={view === item.key ? "active" : ""} type="button" onClick={() => { navigate(item.key); setMobileOpen(false); }}>{item.label}</button>)}
    </nav>
    <div className="header-actions">
      <span className="demo-badge"><i /> داده‌های باز پژوهشی</span>
      <button className="researcher-login" type="button" onClick={onLogin}><CircleUserRound size={18} /> <span>ورود پژوهشگر</span></button>
      <button className="mobile-toggle" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="نمایش فهرست"><Menu /></button>
    </div>
  </header>;
}

function NetworkAtlas({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState("غزل");
  const nodes = [
    { key: "حافظ", cls: "hafez", kind: "شاعر" }, { key: "غزل", cls: "ghazal", kind: "گونه" },
    { key: "شیراز", cls: "shiraz gold", kind: "مکان" }, { key: "سدهٔ هشتم", cls: "century gold", kind: "دوره" },
    { key: "سعدی", cls: "saadi small", kind: "شاعر" }, { key: "خواجو", cls: "khajoo small", kind: "شاعر" },
  ];
  return <div className={compact ? "atlas compact" : "atlas"}>
    <div className="atlas-caption"><Network size={15} /><span>نمای شبکه‌ای داده‌ها</span><i>زنده</i></div>
    <a className="source-tag source-a" href="https://ganjoor.net/hafez" target="_blank" rel="noreferrer"><FileCheck2 size={13} /> فرادادهٔ حافظ در گنجور</a>
    <a className="source-tag source-b" href="https://www.iranicaonline.org/articles/iran-viii2-classical-persian-literature/" target="_blank" rel="noreferrer"><FileCheck2 size={13} /> مرور ادبیات کلاسیک در ایرانیکا</a>
    {[1,2,3,4,5,6].map(n => <span className={`edge edge-${n}`} key={n} />)}
    {nodes.map(node => <button key={node.key} type="button" onClick={() => setActive(node.key)} className={`node ${node.cls} ${active === node.key ? "selected" : ""}`}><small>{node.kind}</small><strong>{node.key}</strong></button>)}
    <div className="timeline"><span>سدهٔ پنجم</span><span>سدهٔ ششم</span><span>سدهٔ هفتم</span><strong>سدهٔ هشتم</strong><span>سدهٔ نهم</span></div>
    <div className="node-detail"><span>گرهٔ انتخاب‌شده</span><strong>{active}</strong><small>برای دیدن پیوندها روی گره‌ها بزنید</small></div>
  </div>;
}

function SearchBox({ query, setQuery, submit, dense = false }: { query: string; setQuery: (q: string) => void; submit: (e: FormEvent<HTMLFormElement>) => void; dense?: boolean }) {
  return <form className={dense ? "semantic-search dense" : "semantic-search"} onSubmit={submit} role="search">
    <label htmlFor={dense ? "explore-search" : "hero-search"}>جست‌وجوی معنایی در تاریخ ادبیات</label>
    <div className="search-field"><Search size={23} /><input id={dense ? "explore-search" : "hero-search"} value={query} onChange={e => setQuery(e.target.value)} placeholder="پرسش پژوهشی خود را به زبان طبیعی بنویسید…" /><button type="submit" aria-label="جست‌وجو"><ArrowLeft /></button></div>
  </form>;
}

function HomeView({ query, setQuery, search, navigate }: { query: string; setQuery: (q: string) => void; search: (e: FormEvent<HTMLFormElement>) => void; navigate: (v: View) => void }) {
  return <>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={16} /> زیرساخت ملی علوم انسانی دیجیتال</p>
        <h1>تاریخ ادبیات فارسی،<br /><em>زنده و قابل کاوش</em></h1>
        <p className="hero-lead">میان شاعران، آثار، گونه‌های ادبی، مکان‌ها و دوره‌های تاریخی جست‌وجو کنید؛ پیوندهای پنهان را ببینید و هر نتیجه را تا سند اصلی دنبال کنید.</p>
        <SearchBox query={query} setQuery={setQuery} submit={search} />
        <div className="search-row"><button className="primary-button" onClick={() => navigate("explore")} type="button">کاوش در تاریخ ادبیات <ArrowLeft size={20} /></button><span><ShieldCheck size={15} /> پاسخ مستند به منابع</span></div>
        <div className="query-examples"><span>نمونه پرسش:</span>{examples.map(x => <button key={x} type="button" onClick={() => setQuery(x)}>{x}</button>)}</div>
      </div>
      <NetworkAtlas />
    </section>

    <section className="evidence-strip" aria-label="آمار داده‌های گردآوری‌شده">
      <article className="trust-card"><span className="wax"><CheckCircle2 /></span><div><strong>داده‌های مستند و قابل پیگیری</strong><small>هر پروفایل به صفحهٔ منبع عمومی پیوند دارد</small></div></article>
      <article><BookOpen /><div><strong>{faNumber(workCatalog.length)}</strong><small>اثر شاخص در کاتالوگ</small></div></article>
      <article><Landmark /><div><strong>{faNumber(poetDirectory.length)}</strong><small>نام در فهرست سده‌ای</small></div></article>
      <article><Network /><div><strong>{faNumber(featuredPoets.length)}</strong><small>پروفایل تفصیلی مستند</small></div></article>
      <article><Map /><div><strong>{faNumber(Object.keys(literaryCenters).length)}</strong><small>کانون ادبی روی نقشه</small></div></article>
    </section>

    <section className="content-section">
      <div className="section-heading"><div><span className="section-kicker">مسیرهای اصلی پژوهش</span><h2>از یک پرسش تا سند، در چند دقیقه</h2></div><button className="text-link" type="button" onClick={() => navigate("explore")}>شروع یک کاوش <ArrowUpLeft /></button></div>
      <div className="journey-grid">
        <article><span>۰۱</span><Search /><h3>پرسش کنید</h3><p>سؤال پیچیدهٔ پژوهشی را با زبان طبیعی و بدون نیاز به یادگیری دستور جست‌وجو بنویسید.</p></article>
        <article><span>۰۲</span><Bot /><h3>تحلیل شبکه‌ای بگیرید</h3><p>هوش مصنوعی موجودیت‌ها، روابط، روندها و الگوهای پنهان میان منابع را بازیابی می‌کند.</p></article>
        <article><span>۰۳</span><FileCheck2 /><h3>تا سند بازگردید</h3><p>هر گزاره را با منبع، چاپ، صفحه و قطعهٔ متن پشتیبان بررسی و استناد کنید.</p></article>
      </div>
    </section>

    <section className="content-section collections-preview">
      <div className="section-heading"><div><span className="section-kicker">کتابخانهٔ پیوسته</span><h2>منابع پراکنده، در یک پایگاه دانش</h2></div><button className="text-link" type="button" onClick={() => navigate("library")}>همهٔ منابع <ArrowUpLeft /></button></div>
      <div className="collection-grid">
        <article className="collection-card featured"><BookMarked /><small>فهرست مستند</small><h3>سخنوران فارسی</h3><p>نام‌های گردآوری‌شده از فهرست سده‌ای گنجور، از نخستین نمونه‌های شعر دری تا دورهٔ معاصر.</p><strong>{faNumber(poetDirectory.length)} نام <ChevronLeft /></strong></article>
        <article className="collection-card"><Database /><small>کتاب‌شناسی پیوندخورده</small><h3>کاتالوگ آثار کلاسیک</h3><p>عنوان، پدیدآورنده، سده، قالب و گونهٔ آثار شاخص با پیوند مستقیم به متن یا صفحهٔ منبع.</p><strong>{faNumber(workCatalog.length)} اثر <ChevronLeft /></strong></article>
        <article className="collection-card"><Globe2 /><small>کانون‌های فرهنگی</small><h3>جغرافیای ادبی</h3><p>شبکه‌ای از مراکز مهم ادبی، چهره‌های شاخص و سنت غالب هر کانون.</p><strong>{faNumber(Object.keys(literaryCenters).length)} کانون <ChevronLeft /></strong></article>
      </div>
    </section>

    <section className="quote-section"><Quote /><div><span className="section-kicker">فلسفهٔ محصول</span><h2>زیرساختی برای پژوهش، نه جایگزینی برای خواندن</h2><p>هدف پروژه، تقویت خوانش عمیق متون با ابزارهای علوم انسانی دیجیتال است؛ داده‌ها با ذکر منشأ به شبکهٔ دانش تبدیل می‌شوند تا پژوهشگر سریع‌تر ببیند، مقایسه کند و دوباره به منبع بازگردد.</p></div><aside><small>ماهیت طرح</small><strong>پژوهش و توسعه</strong><span>دانشگاه بجنورد</span></aside></section>
  </>;
}

function ExploreView({ query, setQuery, submit }: { query: string; setQuery: (q: string) => void; submit: (e: FormEvent<HTMLFormElement>) => void }) {
  const [tab, setTab] = useState<"list" | "network">("list");
  const allCenturies = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 3), []);
  const [centuries, setCenturies] = useState(allCenturies);
  const [genre, setGenre] = useState("همه");
  const [place, setPlace] = useState("همه");
  const [showAll, setShowAll] = useState(false);
  const [directoryTerm, setDirectoryTerm] = useState("");
  const toggleCentury = (n: number) => setCenturies(s => s.includes(n) ? s.filter(x => x !== n) : [...s, n]);
  const searchTokens = useMemo(() => {
    const stopWords = new Set(["شاعران", "شاعر", "نشان", "بده", "درباره", "سده", "سده‌های", "فارسی", "ادبیات", "کدام", "چه", "است", "را", "در", "از", "تا"]);
    return query.replace(/[،؟,.]/g, " ").replace(/ي/g, "ی").replace(/ك/g, "ک").split(/\s+/).filter(token => token.length > 2 && !stopWords.has(token));
  }, [query]);
  const matchingProfiles = useMemo(() => {
    const directMatches = featuredPoets.filter(poet => {
      const haystack = `${poet.name} ${poet.place} ${poet.genre} ${poet.works} ${poet.summary}`.replace(/ي/g, "ی").replace(/ك/g, "ک");
      return searchTokens.some(token => haystack.includes(token));
    });
    const searchBase = searchTokens.length > 0 && directMatches.length > 0 ? directMatches : featuredPoets;
    return searchBase.filter(poet => centuries.includes(poet.century) && (genre === "همه" || poet.genre.includes(genre)) && (place === "همه" || poet.place.includes(place)));
  }, [centuries, genre, place, searchTokens]);
  const visible = showAll ? matchingProfiles : matchingProfiles.slice(0, 8);
  const filteredDirectory = useMemo(() => poetDirectory.filter(poet => poet.name.includes(directoryTerm.trim())), [directoryTerm]);
  const directoryGroups = useMemo(() => allCenturies.map(century => ({ century, names: filteredDirectory.filter(poet => poet.century === century).map(poet => poet.name) })).filter(group => group.names.length), [allCenturies, filteredDirectory]);
  const topNames = matchingProfiles.slice(0, 3).map(poet => poet.name).join("، ");
  return <section className="workspace-page">
    <div className="page-intro"><div><span className="section-kicker"><Sparkles /> کاوش داده‌محور</span><h1>پرسش پژوهشی را به داده تبدیل کنید</h1><p>پروفایل‌ها را با جست‌وجوی متن، سده، گونه و کانون ادبی پالایش کنید و از هر نتیجه به منبع بازگردید.</p></div><span className="sample-notice"><Database /> گردآوری‌شده از منابع عمومی</span></div>
    <SearchBox query={query} setQuery={setQuery} submit={submit} dense />
    <div className="workspace-grid">
      <aside className="filter-panel">
        <div className="filter-title"><Filter /><strong>پالایش نتیجه</strong><button type="button" onClick={() => { setCenturies(allCenturies); setGenre("همه"); setPlace("همه"); }}>بازنشانی</button></div>
        <div className="filter-group century-filter"><label>دورهٔ تاریخی</label>{allCenturies.map(n => <button className={centuries.includes(n) ? "filter-chip selected" : "filter-chip"} key={n} onClick={() => toggleCentury(n)} type="button"><span>{centuries.includes(n) && <Check />}</span> سدهٔ {centuryLabel(n)}</button>)}</div>
        <div className="filter-group"><label>گونهٔ ادبی</label>{["همه", "غزل", "قصیده", "مثنوی", "رباعی"].map(item => <button className={genre === item ? "filter-chip selected" : "filter-chip"} onClick={() => setGenre(item)} type="button" key={item}><span>{genre === item && <Check />}</span> {item}</button>)}</div>
        <div className="filter-group"><label htmlFor="place-filter">کانون ادبی</label><div className="select-like"><MapPin /><select id="place-filter" className="native-select" value={place} onChange={event => setPlace(event.target.value)}>{["همه", "شیراز", "خراسان", "تبریز", "نیشابور", "هرات", "دهلی"].map(item => <option key={item}>{item}</option>)}</select><ChevronDown /></div></div>
        <div className="filter-group"><label>شفافیت داده</label><div className="progress"><i style={{ width: "100%" }} /></div><small>تمام پروفایل‌ها دارای پیوند مستقیم منبع‌اند</small></div>
      </aside>

      <div className="results-column">
        <article className="ai-answer">
          <div className="ai-head"><span><Bot /> جمع‌بندی مجموعه</span><i><CheckCircle2 /> قابل پیگیری تا منبع</i></div>
          <blockquote>«{query}»</blockquote>
          <p>{matchingProfiles.length ? <>با پالایش فعلی <strong>{faNumber(matchingProfiles.length)} پروفایل تفصیلی</strong> بازیابی شد{topNames ? <>؛ چهره‌های نخست عبارت‌اند از {topNames}</> : null}. هر کارت دوره، مکان، گونه، آثار شاخص و پیوند مستقیم به صفحهٔ منبع را در خود دارد.</> : <>برای این ترکیبِ فیلتر نتیجه‌ای در پروفایل‌های تفصیلی پیدا نشد؛ یک یا چند فیلتر را بردارید یا نام شاعر را دقیق‌تر بنویسید.</>}</p>
          <div className="evidence-pills"><span><FileCheck2 /> {faNumber(featuredPoets.length)} پروفایل مستند</span><span><BookOpen /> {faNumber(librarySources.length)} منبع منتخب</span><span><Network /> {faNumber(poetDirectory.length)} نام سده‌بندی‌شده</span></div>
          <details><summary>این نتیجه چگونه ساخته شده است؟ <ChevronDown /></summary><p>عبارت جست‌وجو در نام، مکان، گونه، آثار و شرح کوتاه پروفایل‌ها تطبیق داده می‌شود و سپس فیلترهای سده، قالب و مکان اعمال می‌شوند. این جمع‌بندی ادعای استنادی مستقل ندارد و باید همراه با پیوند منبع هر کارت خوانده شود.</p></details>
        </article>

        <div className="result-toolbar"><div><button className={tab === "list" ? "active" : ""} onClick={() => setTab("list")} type="button"><ListFilter /> فهرست نتایج</button><button className={tab === "network" ? "active" : ""} onClick={() => setTab("network")} type="button"><Network /> شبکهٔ نمونه</button></div><span>{faNumber(matchingProfiles.length)} نتیجه</span></div>
        {tab === "list" ? <><div className="people-list">{visible.map((person, index) => <article key={person.id} className="person-card"><span className="rank">{faNumber(index + 1).padStart(2,"۰")}</span><div className="person-avatar">{person.name.slice(0,1)}</div><div className="person-main"><div><h3>{person.name}</h3><span>{person.years}</span></div><p><MapPin /> {person.place} <i /> <Tags /> {person.genre}</p><small>{person.summary}</small><em><BookMarked /> {person.works}</em></div><div className="person-meta"><span>سدهٔ {centuryLabel(person.century)}</span>{person.verseCount ? <strong>{faNumber(person.verseCount)} بیت در منبع</strong> : <strong>پروفایل مستند</strong>}<a href={person.sourceUrl} target="_blank" rel="noreferrer" aria-label={`منبع ${person.name}`}><ExternalLink /></a></div></article>)}</div>{matchingProfiles.length > 8 && <button className="outline-button load-more" type="button" onClick={() => setShowAll(value => !value)}>{showAll ? "نمایش فشرده" : `نمایش همهٔ ${faNumber(matchingProfiles.length)} نتیجه`} <ChevronDown /></button>}</> : <div className="network-result"><NetworkAtlas compact /><div className="network-legend"><span><i className="cyan" /> پدیدآورنده</span><span><i className="gold" /> زمان / مکان</span><span><i className="wine" /> منبع</span></div></div>}
      </div>

      <aside className="evidence-panel"><div className="panel-title"><FileCheck2 /><strong>منابع باز</strong><span>{faNumber(openReferences.length)} مرجع</span></div>{openReferences.slice(0, 4).map(source => <article key={source.title}><span className="doc-icon"><FileText /></span><div><strong>{source.title}</strong><p>{source.detail}</p><small>پیوند بیرونی</small></div><a href={source.url} target="_blank" rel="noreferrer" aria-label={`بازکردن ${source.title}`}><ExternalLink /></a></article>)}<a className="outline-button" href="https://ganjoor.net/" target="_blank" rel="noreferrer">مشاهدهٔ فهرست کامل گنجور <ChevronLeft /></a></aside>
    </div>
    <section className="directory-section">
      <div className="section-heading"><div><span className="section-kicker"><UsersRound /> نمایهٔ سده‌ای</span><h2>فهرست {faNumber(poetDirectory.length)} سخنور و نویسنده</h2><p>این نمایه از دسته‌بندی عمومی گنجور گردآوری شده و برای مرور تاریخی طراحی شده است.</p></div><div className="directory-search"><Search /><input value={directoryTerm} onChange={event => setDirectoryTerm(event.target.value)} placeholder="جست‌وجوی نام در فهرست…" /></div></div>
      <div className="directory-grid">{directoryGroups.map(group => <article key={group.century}><header><span>سدهٔ</span><strong>{centuryLabel(group.century)}</strong><small>{faNumber(group.names.length)} نام</small></header><div>{group.names.map(name => <span key={name}>{name}</span>)}</div></article>)}</div>
      <div className="source-disclaimer"><ShieldCheck /><p>نام‌ها برای پیمایش اولیه گردآوری شده‌اند. برای تاریخ زندگی، انتساب آثار و اختلاف نسخه‌ها باید صفحهٔ منبع و پژوهش‌های تخصصی بررسی شود.</p><a href="https://ganjoor.net/" target="_blank" rel="noreferrer">مشاهدهٔ منبع <ExternalLink /></a></div>
    </section>
  </section>;
}

function LibraryView() {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("همه");
  const [selected, setSelected] = useState<number | null>(null);
  const [workTerm, setWorkTerm] = useState("");
  const [workKind, setWorkKind] = useState("همه");
  const [showAllWorks, setShowAllWorks] = useState(false);
  const categories = ["همه", "پیکرهٔ متن", "دانش‌نامه", "دادهٔ پژوهشی", "زیرساخت داده", "مجموعهٔ شاعر"];
  const workKinds = ["همه", "دیوان", "مثنوی", "نثر", "تذکره", "رباعیات", "مجموعه"];
  const shown = useMemo(() => librarySources.filter(source => (category === "همه" || source.type === category) && (`${source.title} ${source.author} ${source.coverage} ${source.description}`).includes(term.trim())), [term, category]);
  const filteredWorks = useMemo(() => workCatalog.filter(work => {
    const matchesKind = workKind === "همه" || work.kind === workKind;
    const needle = workTerm.trim().replace(/ي/g, "ی").replace(/ك/g, "ک");
    const haystack = `${work.title} ${work.author} ${work.form} ${work.kind}`.replace(/ي/g, "ی").replace(/ك/g, "ک");
    return matchesKind && haystack.includes(needle);
  }), [workKind, workTerm]);
  const visibleWorks = showAllWorks ? filteredWorks : filteredWorks.slice(0, 12);
  const current = librarySources.find(source => source.id === selected);
  const datasetCount = librarySources.filter(source => source.type === "دادهٔ پژوهشی" || source.type === "زیرساخت داده").length;
  const textCount = librarySources.filter(source => source.type === "پیکرهٔ متن" || source.type === "مجموعهٔ شاعر").length;
  const referenceCount = librarySources.filter(source => source.type === "دانش‌نامه").length;
  return <section className="workspace-page library-page">
    <div className="page-intro"><div><span className="section-kicker"><Library /> کتابخانهٔ منابع باز</span><h1>منابع تاریخ ادبیات، قابل پیگیری و جست‌وجو</h1><p>هر کارت مستقیماً به منبع اصلی، پیکرهٔ متن، دانش‌نامه یا مجموعه‌دادهٔ پژوهشی متصل است.</p></div><div className="library-total"><strong>{faNumber(librarySources.length)}</strong><span>منبع منتخب و بررسی‌شده</span></div></div>
    <div className="library-controls"><div className="library-search"><Search /><input value={term} onChange={e => setTerm(e.target.value)} placeholder="جست‌وجو در عنوان، پدیدآورنده یا کلیدواژه…" /></div><div className="category-tabs">{categories.map(c => <button type="button" className={category === c ? "active" : ""} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div><button className="filter-button" type="button"><ListFilter /> {faNumber(shown.length)} نتیجه</button></div>
    <div className="library-layout"><aside className="library-stats"><h3>ترکیب مجموعه</h3><div className="donut complete"><strong>۱۰۰٪</strong><span>دارای پیوند منبع</span></div><ul><li><i className="cyan" /> پیکره و مجموعهٔ متن <b>{faNumber(textCount)}</b></li><li><i className="gold" /> داده و زیرساخت <b>{faNumber(datasetCount)}</b></li><li><i className="wine" /> دانش‌نامه و مرجع <b>{faNumber(referenceCount)}</b></li></ul><hr /><p><ShieldCheck /> سیاست انتخاب منابع</p><strong className="ocr-score">باز و قابل ارجاع</strong><small className="stats-note">محتوای بیرونی تابع مجوز و شرایط همان وب‌سایت است.</small></aside>
      <div className="book-grid">{shown.map(source => <article className="book-card" key={source.id}><div className={`book-cover ${source.color}`}><span>{source.type}<br />فارسی</span><small>{source.author}</small><i /></div><div className="book-info"><span className="book-type">{source.type}</span><h3>{source.title}</h3><p>{source.author} · {source.period}</p><div><span><FileText /> {source.format}</span><span><CheckCircle2 /> {source.access}</span></div><button type="button" onClick={() => setSelected(source.id)}>جزئیات و پیوند منبع <ChevronLeft /></button></div></article>)}</div></div>
    <section className="works-section">
      <div className="section-heading"><div><span className="section-kicker"><BookMarked /> کاتالوگ آثار کلاسیک</span><h2>از عنوان اثر تا متن و منبع</h2><p>این نمایه، فرادادهٔ آثار شاخص را برای پیمایش اولیه یکجا می‌کند؛ انتساب و نسخه‌شناسی باید در منبع مقصد بررسی شود.</p></div><span className="method-badge"><Database /> {faNumber(workCatalog.length)} رکورد</span></div>
      <div className="works-controls"><div className="works-search"><Search /><input value={workTerm} onChange={e => { setWorkTerm(e.target.value); setShowAllWorks(false); }} placeholder="جست‌وجوی عنوان، شاعر یا قالب…" /></div><div className="work-kind-tabs">{workKinds.map(kind => <button type="button" className={workKind === kind ? "active" : ""} onClick={() => { setWorkKind(kind); setShowAllWorks(false); }} key={kind}>{kind}</button>)}</div><span>{faNumber(filteredWorks.length)} نتیجه</span></div>
      <div className="works-grid">{visibleWorks.map(work => <article className="work-card" key={work.id}><div className="work-card-top"><span>{work.kind}</span><small>سدهٔ {centuryLabel(work.century)}</small></div><h3>{work.title}</h3><p>{work.author}</p><div className="work-card-footer"><span><Tags /> {work.form}</span><a href={work.url} target="_blank" rel="noreferrer" aria-label={`مشاهدهٔ منبع ${work.title}`}>منبع <ExternalLink /></a></div></article>)}</div>
      {filteredWorks.length > 12 && <button className="outline-button works-more" type="button" onClick={() => setShowAllWorks(value => !value)}>{showAllWorks ? "نمایش خلاصه" : `نمایش همهٔ ${faNumber(filteredWorks.length)} اثر`} <ChevronDown /></button>}
      <div className="source-disclaimer"><ShieldCheck /><p>آثار کلاسیک عموماً در مالکیت عمومی‌اند؛ اما تصحیح‌های معاصر، ترجمه‌ها، تصاویر نسخه‌ها و متن‌های دیجیتال ممکن است شرایط استفادهٔ جداگانه داشته باشند.</p><a href="https://ganjoor.net/" target="_blank" rel="noreferrer">نمایهٔ گنجور <ExternalLink /></a></div>
    </section>
    {current && <div className="drawer-backdrop" onMouseDown={() => setSelected(null)}><aside className="book-drawer" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={current.title}><button className="drawer-close" type="button" onClick={() => setSelected(null)}><X /></button><div className={`book-cover large ${current.color}`}><span>{current.type}<br />فارسی</span><small>{current.author}</small><i /></div><span className="book-type">{current.type}</span><h2>{current.title}</h2><p className="drawer-author">{current.author} · {current.period}</p><p className="drawer-description">{current.description}</p><div className="drawer-facts"><div><span>پوشش</span><strong>{current.coverage}</strong></div><div><span>قالب</span><strong>{current.format}</strong></div><div><span>دسترسی</span><strong>{current.access}</strong></div></div><div className="drawer-actions single"><a className="primary-button" href={current.url} target="_blank" rel="noreferrer"><ExternalLink /> بازکردن منبع اصلی</a></div><small className="prototype-note">پیوند در زبانهٔ تازه باز می‌شود. برای استناد دانشگاهی، اطلاعات کتاب‌شناختی و شرایط استفادهٔ منبع مقصد را بررسی کنید.</small></aside></div>}
  </section>;
}

type CorpusPoem = {
  id: number;
  poet: string;
  century: string;
  bookTitle: string;
  poemTitle: string;
  poem: string;
};

type CorpusMetadata = {
  rows: number;
  fileBytes: number;
  poets: [string, number][];
  centuries: [string, number][];
  topPoets: [string, number][];
};

type CorpusWorkerMessage =
  | { type: "progress"; loaded: number; total: number; rows: number }
  | { type: "ready"; metadata: CorpusMetadata }
  | { type: "search-start" }
  | { type: "results"; total: number; page: number; pageSize: number; results: CorpusPoem[] }
  | { type: "error"; code: string; message: string };

function CorpusView() {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ loaded: 0, total: 0, rows: 0 });
  const [metadata, setMetadata] = useState<CorpusMetadata | null>(null);
  const [query, setQuery] = useState("");
  const [poet, setPoet] = useState("");
  const [century, setCentury] = useState("");
  const [page, setPage] = useState(1);
  const [resultCount, setResultCount] = useState(0);
  const [results, setResults] = useState<CorpusPoem[]>([]);
  const [searching, setSearching] = useState(false);
  const pageSize = 20;

  useEffect(() => () => workerRef.current?.terminate(), []);

  const requestSearch = (requestedPage = page) => {
    if (!workerRef.current || status !== "ready") return;
    setSearching(true);
    workerRef.current.postMessage({ type: "search", query, poet, century, page: requestedPage, pageSize });
  };

  const loadDataset = () => {
    workerRef.current?.terminate();
    setStatus("loading");
    setError("");
    setMetadata(null);
    setResults([]);
    setResultCount(0);
    setProgress({ loaded: 0, total: 0, rows: 0 });
    const worker = new Worker("/workers/poetry-dataset-worker.js");
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<CorpusWorkerMessage>) => {
      const message = event.data;
      if (message.type === "progress") setProgress({ loaded: message.loaded, total: message.total, rows: message.rows });
      if (message.type === "search-start") setSearching(true);
      if (message.type === "ready") {
        setMetadata(message.metadata);
        setStatus("ready");
        setPage(1);
        setSearching(true);
        worker.postMessage({ type: "search", query: "", poet: "", century: "", page: 1, pageSize });
      }
      if (message.type === "results") {
        setResults(message.results);
        setResultCount(message.total);
        setPage(message.page);
        setSearching(false);
      }
      if (message.type === "error") {
        setStatus("error");
        setSearching(false);
        setError(message.message);
      }
    };
    worker.onerror = () => {
      setStatus("error");
      setSearching(false);
      setError("خواندن مجموعه‌داده در مرورگر با خطای پیش‌بینی‌نشده متوقف شد.");
    };
    worker.postMessage({ type: "load", url: "/data/poems_with_more_info.tsv" });
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    requestSearch(1);
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    requestSearch(nextPage);
    window.scrollTo({ top: 410, behavior: "smooth" });
  };

  const progressPercent = progress.total ? Math.min(100, Math.round(progress.loaded / progress.total * 100)) : 0;
  const totalPages = Math.max(1, Math.ceil(resultCount / pageSize));
  const fileSize = metadata ? `${(metadata.fileBytes / 1024 / 1024).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} مگابایت` : "";

  return <section className="workspace-page corpus-page">
    <div className="page-intro corpus-intro"><div><span className="section-kicker"><Database /> پیکرهٔ زمان‌مند شعر فارسی</span><h1>جست‌وجو در مجموعه‌دادهٔ اشعار کلاسیک</h1><p>فایل TSV مستقیماً در مرورگر و داخل یک Web Worker خوانده می‌شود؛ جست‌وجو، فیلتر و صفحه‌بندی بدون ارسال متن اشعار به سرور انجام می‌شود.</p></div><a className="sample-notice corpus-source" href="https://github.com/aghasemi/ChronologicalPersianPoetryDataset" target="_blank" rel="noreferrer"><ExternalLink /> منبع مجموعه‌داده</a></div>

    {status === "idle" && <section className="corpus-loader">
      <div className="corpus-loader-icon"><Database /></div>
      <div><span className="section-kicker">ورودی سایت آماده است</span><h2>مجموعه‌داده را از پوشهٔ public/data بخوانید</h2><p>برای جلوگیری از کندشدن صفحهٔ نخست، فایل بزرگ فقط پس از انتخاب شما بارگذاری می‌شود. نام و مسیر فایل باید دقیقاً مطابق راهنما باشد.</p><code>public/data/poems_with_more_info.tsv</code></div>
      <button className="primary-button" type="button" onClick={loadDataset}>بارگذاری پیکره <ArrowLeft /></button>
    </section>}

    {status === "loading" && <section className="corpus-loading" aria-live="polite">
      <div className="loading-orbit"><Database /></div><div><h2>در حال خواندن و نمایه‌سازی پیکره…</h2><p>{progress.total ? `${progressPercent.toLocaleString("fa-IR")}٪ از فایل دریافت شده` : "در حال برقراری ارتباط با فایل داده"} · {faNumber(progress.rows)} رکورد خوانده شده</p><div className="corpus-progress"><i style={{ width: progress.total ? `${progressPercent}%` : "12%" }} /></div><small>این پردازش در رشتهٔ جداگانه انجام می‌شود و ممکن است برای فایل کامل کمی زمان ببرد.</small></div>
    </section>}

    {status === "error" && <section className="corpus-error" role="alert">
      <span><X /></span><div><h2>مجموعه‌داده قابل خواندن نیست</h2><p>{error}</p><ol><li>فایل اصلی را با نام دقیق <code>poems_with_more_info.tsv</code> دریافت کنید.</li><li>آن را در مسیر <code>public/data/</code> در ریشهٔ مخزن GitHub بگذارید.</li><li>مطمئن شوید فایل واقعی است، نه صفحهٔ HTML یا اشاره‌گر Git LFS.</li><li>تغییرات را Push و پروژه را در Vercel دوباره Deploy کنید.</li></ol></div><button className="outline-button" type="button" onClick={loadDataset}>تلاش دوباره</button>
    </section>}

    {status === "ready" && metadata && <>
      <div className="corpus-stats">
        <article><Database /><div><strong>{faNumber(metadata.rows)}</strong><span>رکورد شعر</span></div></article>
        <article><UsersRound /><div><strong>{faNumber(metadata.poets.length)}</strong><span>شاعر متمایز</span></div></article>
        <article><Clock3 /><div><strong>{faNumber(metadata.centuries.length)}</strong><span>برچسب زمانی</span></div></article>
        <article><FileCheck2 /><div><strong>{fileSize}</strong><span>حجم فایل خوانده‌شده</span></div></article>
      </div>

      <form className="corpus-controls" onSubmit={submitSearch}>
        <label className="corpus-query"><span>جست‌وجو در شاعر، کتاب، عنوان و متن شعر</span><div><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="برای نمونه: ساقی، بهار، عشق یا نام یک شاعر…" /><button type="submit">جست‌وجو</button></div></label>
        <label><span>شاعر</span><select value={poet} onChange={event => { setPoet(event.target.value); setPage(1); }}><option value="">همهٔ شاعران</option>{metadata.poets.map(([name, count]) => <option key={name} value={name}>{name} ({faNumber(count)})</option>)}</select></label>
        <label><span>سده</span><select value={century} onChange={event => { setCentury(event.target.value); setPage(1); }}><option value="">همهٔ سده‌ها</option>{metadata.centuries.map(([name, count]) => <option key={name} value={name}>{name} ({faNumber(count)})</option>)}</select></label>
        <button className="filter-apply" type="button" onClick={() => requestSearch(1)}><Filter /> اعمال فیلترها</button>
      </form>

      <div className="corpus-layout">
        <aside className="corpus-facets"><span className="section-kicker"><UsersRound /> پرتکرارترین شاعران</span>{metadata.topPoets.map(([name, count], index) => <button type="button" className={poet === name ? "active" : ""} onClick={() => { setPoet(name); setPage(1); }} key={name}><i>{faNumber(index + 1)}</i><span>{name}</span><strong>{faNumber(count)}</strong></button>)}<small>فراوانی بر اساس تعداد رکوردهای فایل ورودی محاسبه شده است.</small></aside>
        <div className="corpus-results">
          <header><div><span className="section-kicker"><BookOpen /> نتایج پیکره</span><h2>{searching ? "در حال جست‌وجو…" : `${faNumber(resultCount)} نتیجه`}</h2></div>{resultCount > 0 && <span>صفحهٔ {faNumber(page)} از {faNumber(totalPages)}</span>}</header>
          {searching && <div className="corpus-searching"><i /> در حال پیمایش رکوردها…</div>}
          {!searching && results.length === 0 && <div className="corpus-empty"><Search /><h3>نتیجه‌ای پیدا نشد</h3><p>عبارت کوتاه‌تر یا فیلترهای گسترده‌تر را امتحان کنید.</p></div>}
          {!searching && <div className="poem-results">{results.map(item => <article key={item.id}><header><div><span>{item.poet || "شاعر نامشخص"}</span><small>{item.century || "بدون برچسب سده"}</small></div><i>ردیف {faNumber(item.id)}</i></header><h3>{item.poemTitle || "بدون عنوان"}</h3><p className="poem-book"><BookMarked /> {item.bookTitle || "کتاب نامشخص"}</p><blockquote>{item.poem || "متن شعر در این رکورد خالی است."}</blockquote></article>)}</div>}
          {!searching && resultCount > pageSize && <nav className="corpus-pagination" aria-label="صفحه‌بندی نتایج"><button type="button" disabled={page <= 1} onClick={() => changePage(page - 1)}>صفحهٔ قبل</button><span>{faNumber((page - 1) * pageSize + 1)} تا {faNumber(Math.min(page * pageSize, resultCount))} از {faNumber(resultCount)}</span><button type="button" disabled={page >= totalPages} onClick={() => changePage(page + 1)}>صفحهٔ بعد</button></nav>}
        </div>
      </div>
      <div className="source-disclaimer corpus-license"><ShieldCheck /><p>مجموعه‌داده از پروژهٔ Chronological Persian Poetry Dataset استفاده می‌کند. هنگام بازنشر یا استفادهٔ پژوهشی، مخزن منبع، گنجور و مجوز CC BY-SA 4.0 را ذکر کنید.</p><a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">مجوز داده <ExternalLink /></a></div>
    </>}
  </section>;
}

function AtlasView() {
  const [century, setCentury] = useState(8);
  const [city, setCity] = useState<keyof typeof literaryCenters>("شیراز");
  const [mode, setMode] = useState<"map" | "list">("map");
  const data = literaryCenters[city];
  const centers = Object.entries(literaryCenters) as [keyof typeof literaryCenters, (typeof literaryCenters)[keyof typeof literaryCenters]][];
  const centuryCount = poetDirectory.filter(poet => poet.century === century).length;
  return <section className="workspace-page atlas-page">
    <div className="page-intro"><div><span className="section-kicker"><Map /> اطلس ادبی</span><h1>ادبیات فارسی را در زمان و مکان ببینید</h1><p>کانون‌های مهم، دورهٔ فعالیت، سنت غالب و چهره‌های شاخص هر مرکز را مقایسه کنید.</p></div><div className="view-switch"><button className={mode === "map" ? "active" : ""} onClick={() => setMode("map")} type="button"><Map /> نقشه</button><button className={mode === "list" ? "active" : ""} onClick={() => setMode("list")} type="button"><ListFilter /> فهرست</button></div></div>
    <div className="atlas-dashboard">
      {mode === "map" ? <div className="map-panel">
        <div className="map-top"><div><span>لایهٔ فعال</span><strong>کانون‌های ادبی و چهره‌های شاخص</strong></div><span className="map-count"><MapPin /> {faNumber(centers.length)} کانون</span></div>
        <div className="persian-map">
          <span className="map-outline" />
          {centers.map(([name, center]) => <button type="button" onClick={() => setCity(name)} className={city === name ? "map-point active" : "map-point"} style={{ left: center.left, top: center.top }} key={name}><i /><strong>{name}</strong><small>{faNumber(center.names.length)} چهرهٔ شاخص</small></button>)}
        </div>
        <div className="map-legend"><span><i className="gold" /> کانون منتخب</span><span><i className="cyan" /> کانون ادبی</span><span>موقعیت‌ها تقریبی و برای پیمایش بصری‌اند</span></div>
      </div> : <div className="center-list-panel">{centers.map(([name, center]) => <button className={city === name ? "active" : ""} type="button" key={name} onClick={() => setCity(name)}><MapPin /><div><strong>{name}</strong><span>{center.tradition}</span><small>{center.period} · {faNumber(center.names.length)} چهرهٔ شاخص</small></div><ChevronLeft /></button>)}</div>}
      <aside className="city-panel"><span className="section-kicker"><MapPin /> کانون منتخب</span><h2>{city}</h2><p>{data.note}</p><div className="city-number"><strong>{faNumber(data.names.length)}</strong><span>چهرهٔ کلیدی در این نمای اولیه</span></div><h3>چهره‌های شاخص</h3><div className="city-people">{data.names.map((name,index) => <span key={name}><i>{faNumber(index + 1)}</i>{name}</span>)}</div><hr /><div className="city-facts"><span><Clock3 /> {data.period}</span><span><Tags /> {data.tradition}</span><span><FileCheck2 /> دارای پیوند منبع</span></div><a className="outline-button" href={data.sourceUrl} target="_blank" rel="noreferrer">بررسی منبع {city} <ExternalLink /></a></aside>
    </div>
    <div className="century-control"><div><span className="section-kicker"><Clock3 /> خط‌زمان نمایه</span><h3>سدهٔ {centuryLabel(century)} هجری · {faNumber(centuryCount)} نام</h3></div><input type="range" min="3" max="14" step="1" value={century} onChange={e => setCentury(Number(e.target.value))} aria-label="انتخاب سده" /><div className="century-labels">{[3,4,5,6,7,8,9,10,11,12,13,14].map(n => <span className={n === century ? "active" : ""} key={n}>{centuryLabel(n)}</span>)}</div></div>
    <section className="movements-section">
      <div className="section-heading"><div><span className="section-kicker"><Network /> جریان‌ها و سبک‌های ادبی</span><h2>یک نمای مقایسه‌ای از تحول شعر فارسی</h2><p>مرزبندی سبک‌ها قطعی و یگانه نیست؛ این کارت‌ها یک مسیر پژوهشی فشرده با پیوند بازگشت به منبع ارائه می‌کنند.</p></div><span className="method-badge"><FileCheck2 /> {faNumber(literaryMovements.length)} مسیر</span></div>
      <div className="movement-grid">{literaryMovements.map(movement => <article key={movement.title}><header><span>{movement.centuries}</span><a href={movement.sourceUrl} target="_blank" rel="noreferrer" aria-label={`منبع ${movement.title}`}><ExternalLink /></a></header><h3>{movement.title}</h3><p>{movement.description}</p><div className="movement-features">{movement.features.map(feature => <span key={feature}>{feature}</span>)}</div><footer><UsersRound /> {movement.figures.join("، ")}</footer></article>)}</div>
    </section>
  </section>;
}

function AboutView() {
  const phases = [
    ["گردآوری و حقوق نشر", "شناسایی منابع، اخذ مجوز و تعریف استانداردهای کتاب‌شناختی", "ماه ۱ تا ۳"],
    ["دیجیتال‌سازی و OCR", "اسکن استاندارد، تشخیص متن فارسی و اصلاح انسانی", "ماه ۳ تا ۵"],
    ["مدل‌سازی دانش", "استخراج موجودیت‌ها، رابطه‌ها و طراحی پایگاه دادهٔ شبکه‌ای", "ماه ۴ تا ۷"],
    ["توسعه و ارزیابی", "رابط وب، جست‌وجوی معنایی، آزمون با پژوهشگران و استقرار", "ماه ۶ تا ۹"],
  ];
  return <section className="workspace-page about-page">
    <div className="about-hero"><span className="section-kicker"><Sparkles /> دربارهٔ پروژه</span><h1>تاریخ ادبیات، به‌مثابه یک شبکهٔ زنده</h1><p>این طرح، منابع مکتوب و پراکندهٔ تاریخ ادبیات فارسی را به پایگاه دانشی یکپارچه، پویا و قابل پرس‌وجو تبدیل می‌کند؛ جایی که پژوهشگر می‌تواند روایت خطی را با تحلیل زمانی، مکانی و شبکه‌ای تکمیل کند.</p><div className="project-meta"><div><span>محل اجرا</span><strong>دانشگاه بجنورد</strong></div><div><span>حوزه</span><strong>علوم انسانی دیجیتال</strong></div><div><span>رویکرد</span><strong>پژوهش و توسعه</strong></div><div><span>نوع داده</span><strong>فرادادهٔ مستند و باز</strong></div></div></div>
    <div className="about-grid"><article><UserRoundSearch /><h2>مسئله</h2><p>تاریخ‌های ادبیات سنتی عمدتاً خطی‌اند و یافتن رابطه‌ها یا مقایسهٔ چند دوره در آن‌ها زمان‌بر است. پروژه یک مدل داده‌ای رابطه‌ای برای کشف این پیوندها می‌سازد.</p></article><article><Bot /><h2>نوآوری</h2><p>ترکیب پردازش زبان طبیعی، استخراج موجودیت و رابطه با تاریخ‌نگاری ادبی؛ با حفظ اتصال هر دادهٔ ساختاریافته به متن و سند اصلی.</p></article><article><UsersRound /><h2>مخاطبان</h2><p>دانشجویان، استادان، پژوهشگران مستقل، کتابخانه‌ها، ناشران و نهادهای سیاست‌گذار فرهنگی.</p></article></div>
    <section className="method-section"><div className="section-heading"><div><span className="section-kicker">روش‌شناسی اجرا</span><h2>از کتاب چاپی تا پایگاه دانش</h2></div><span className="method-badge"><TimerReset /> برنامهٔ ۹ ماهه</span></div><div className="phase-list">{phases.map((p,i) => <article key={p[0]}><span>{String(i+1).padStart(2,"۰")}</span><div><h3>{p[0]}</h3><p>{p[1]}</p></div><strong>{p[2]}</strong></article>)}</div></section>
    <section className="output-section"><div><span className="section-kicker">برون‌دادهای تعهدشده</span><h2>زیرساختی قابل توسعه برای یک پروژهٔ ملی</h2><p>خروجی فقط یک وب‌سایت نیست؛ مجموعه‌ای از داده، استاندارد، ابزار و تجربهٔ پژوهشی است که می‌تواند پایهٔ طرح‌های آینده باشد.</p></div><div className="output-grid">{[
      ["پایگاه دادهٔ ساختاریافته", "فراداده، PDF، متن OCR و کلیدواژه‌ها", Database],
      ["رابط پژوهش تحت وب", "جست‌وجوی پیشرفته و تجسم روابط", Globe2],
      ["مقاله و گزارش سیاستی", "روش دیجیتال‌سازی و پیشنهاد توسعهٔ ملی", FileText],
      ["کارگاه آموزشی", "استانداردهای دیجیتال‌سازی و استفاده از سامانه", UsersRound],
    ].map(([t,d,I]) => { const Icon = I as typeof Database; return <article key={t as string}><Icon /><div><strong>{t as string}</strong><span>{d as string}</span></div></article>; })}</div></section>
    <section className="sources-section"><div className="section-heading"><div><span className="section-kicker"><FileCheck2 /> منشأ داده‌ها</span><h2>منابع باز و قابل بازبینی</h2><p>محتوای فعلی با تمرکز بر فراداده و بدون بازنشر انبوه متن دارای حق نشر گردآوری شده است.</p></div><span className="method-badge"><ShieldCheck /> پیوند مستقیم به منبع</span></div><div className="source-cards">{openReferences.map(source => <a href={source.url} target="_blank" rel="noreferrer" key={source.title}><ExternalLink /><div><strong>{source.title}</strong><span>{source.detail}</span></div><ChevronLeft /></a>)}</div></section>
    <div className="ethics-note"><ShieldCheck /><div><strong>اصول اخلاقی و حقوق نشر</strong><p>اولویت با منابع خارج از محدودیت حق تألیف است؛ استفاده از منابع تحت حمایت تنها با مجوز رسمی انجام می‌شود. خروجی هوش مصنوعی نیز پیش از انتشار علمی با نمونه‌های معتبر و بازبینی انسانی کنترل خواهد شد.</p></div></div>
  </section>;
}

function LoginModal({ close }: { close: () => void }) {
  return <div className="modal-backdrop" onMouseDown={close}><section className="login-modal" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="login-title"><button className="modal-close" type="button" onClick={close} aria-label="بستن"><X /></button><span className="modal-symbol"><CircleUserRound /></span><span className="section-kicker">فضای پژوهشگر</span><h2 id="login-title">پروژه‌های پژوهشی خود را نگه دارید</h2><p>در نسخهٔ کامل می‌توانید پرسش‌ها، مجموعه‌های شخصی، یادداشت‌ها و خروجی‌های استنادی را ذخیره کنید.</p><label>رایانامهٔ دانشگاهی<input type="email" placeholder="name@university.ac.ir" /></label><button className="primary-button" type="button">درخواست دسترسی آزمایشی <ArrowLeft /></button><small>این نمونه حساب واقعی ایجاد نمی‌کند.</small></section></div>;
}

function Footer({ navigate }: { navigate: (v: View) => void }) {
  return <footer className="site-footer"><Brand /><p>پروتوتایپ پژوهشی «تاریخ ادبیات فارسی دیجیتال»؛ پلی میان میراث مکتوب و روش‌های نوین علوم انسانی.</p><nav><button type="button" onClick={() => navigate("corpus")}>پیکرهٔ شعر</button><button type="button" onClick={() => navigate("library")}>کتابخانه</button><button type="button" onClick={() => navigate("atlas")}>نقشهٔ ادبی</button><button type="button" onClick={() => navigate("about")}>روش‌شناسی</button><a href="mailto:research@ub.ac.ir">ارتباط با طرح</a></nav></footer>;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [query, setQuery] = useState("شاعران غزل‌سرای شیراز در سده‌های هشتم تا دهم را نشان بده");
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLogin(false); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navigate = (next: View) => { setView(next); window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10); };
  const search = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); if (query.trim()) navigate("explore"); };

  return <main className="site-shell">
    <Header view={view} navigate={navigate} onLogin={() => setLogin(true)} />
    {view === "home" && <HomeView query={query} setQuery={setQuery} search={search} navigate={navigate} />}
    {view === "explore" && <ExploreView query={query} setQuery={setQuery} submit={search} />}
    {view === "corpus" && <CorpusView />}
    {view === "library" && <LibraryView />}
    {view === "atlas" && <AtlasView />}
    {view === "about" && <AboutView />}
    <Footer navigate={navigate} />
    {login && <LoginModal close={() => setLogin(false)} />}
  </main>;
}
