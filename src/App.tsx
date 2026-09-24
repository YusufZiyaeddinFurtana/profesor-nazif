import { useEffect, useMemo, useRef, useState } from 'react';
import { courseGroups, frcTopics, lessons, socialLinks, teachers, type Lesson, type Program } from './content';

const contactUrl = 'https://www.cymurghs7466.com/html/turkish/contact-tr.html';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d={diagonal ? 'M5 19 19 5M8 5h11v11' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ChalkNazif({ animated = false }: { animated?: boolean }) {
  return <svg className={`chalk-nazif${animated ? ' chalk-nazif--animated' : ''}`} viewBox="0 0 300 325" fill="none" role="img" aria-label="Profesör Nazif'in tebeşir çizimi">
    <path pathLength="1" d="M70 70C53 52 60 33 75 29c14-4 24 7 31 19M198 49c11-20 32-25 45-14 13 11 9 28-3 39" />
    <path pathLength="1" d="M72 64C108 20 188 18 225 62c32 37 34 84 9 117-20 27-51 40-84 40-45 0-79-19-96-55-17-37-7-74 18-100Z" />
    <path pathLength="1" d="M103 139c12-24 37-31 58-29 26 1 49 12 58 34 11 29-2 55-31 64-23 8-51 5-70-6-23-13-28-38-15-63Z" />
    <path pathLength="1" d="M110 142c1-24 32-27 41-6 8 19-15 31-32 21-6-4-9-10-9-15Zm48-2c5-24 35-26 43-5 7 21-19 31-35 20-6-4-9-9-8-15Z" />
    <path pathLength="1" d="M111 126c11-10 25-13 37-7m25 0c12-6 25-3 36 8M147 165c10-8 26-8 35 0-2 9-11 14-18 14-9 0-15-5-17-14Z" />
    <path pathLength="1" d="M111 180c17 6 27 6 43 1 12 7 21 7 31 0 13 4 27 4 39-2-8 10-12 12-18 13-3 8-8 10-14 8-6 8-13 8-19 3-8 7-14 6-20 1-7 4-12 3-18-2-8 1-13-2-15-8-8-1-13-7-9-14Z" />
    <path pathLength="1" d="M111 222c-24 15-37 43-37 75 25 23 133 23 156 0-1-34-13-64-38-76M226 236c28-16 43-41 47-73 3-17-2-28-11-31-9-2-15 8-13 20" />
    <path pathLength="1" d="M139 221c-6 9-9 22-5 31l21-10 9 13 9-13 20 10c6-10 1-24-5-31l-23 9-26-9Z" />
  </svg>;
}

function ChalkNazifArtwork() {
  return <svg className="chalk-artwork" viewBox="0 0 1140 932" role="img" aria-label="El sallayan Profesör Nazif'in özgün tebeşir çizimi">
    <defs><filter id="chalk-isolate" colorInterpolationFilters="sRGB"><feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="luminance" /><feComponentTransfer in="luminance" result="mask"><feFuncA type="linear" slope="2.8" intercept="-.62" /></feComponentTransfer><feFlood floodColor="#f7f3e6" result="chalk" /><feComposite in="chalk" in2="mask" operator="in" /></filter></defs>
    <image href="/nazif-chalk.png" width="1140" height="932" filter="url(#chalk-isolate)" />
  </svg>;
}

function LessonCover({ lesson }: { lesson: Lesson }) {
  if (lesson.image) return <div className="lesson-cover lesson-cover--image"><img src={lesson.image} alt={`${lesson.title} için eski eğitim kapağı`} /></div>;
  return <div className={`lesson-cover lesson-cover--${lesson.program.toLowerCase()}`}>
    <span className="cover-top">PROFESÖR NAZİF <span>✳</span> {lesson.program}</span>
    <img src="/nazif-portrait.png" alt="" />
    <strong>{lesson.coverLabel}</strong>
    <span className="cover-bottom">Cymurghs #7466 · Ders taslağı</span>
  </div>;
}

function App() {
  const [program, setProgram] = useState<'Tümü' | Program>('Tümü');
  const [group, setGroup] = useState('Tümü');
  const [topic, setTopic] = useState('Tümü');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [introCycle, setIntroCycle] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const detailRef = useRef<HTMLElement>(null);
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedId);

  const visibleLessons = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('tr');
    return lessons.filter((lesson) =>
      (program === 'Tümü' || lesson.program === program) &&
      (group === 'Tümü' || lesson.group === group) &&
      (topic === 'Tümü' || lesson.topic === topic) &&
      (!needle || `${lesson.title} ${lesson.summary} ${lesson.group} ${lesson.topic}`.toLocaleLowerCase('tr').includes(needle)),
    );
  }, [program, group, topic, query]);

  useEffect(() => { if (selectedLesson) detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [selectedId]);

  function chooseProgram(next: Program) { setProgram(next); setGroup('Tümü'); setTopic('Tümü'); setMenuOpen(false); }
  function chooseTopic(next: string) { setProgram('FRC'); setGroup('Tümü'); setTopic(next); setMenuOpen(false); }
  function resetFilters() { setProgram('Tümü'); setGroup('Tümü'); setTopic('Tümü'); setQuery(''); }

  return <>
    <a className="skip-link" href="#main">İçeriğe geç</a>
    <header className="site-header" id="top">
      <a className="brand" href="#top" aria-label="Profesör Nazif ana sayfa"><span className="brand-mark"><img src="/nazif-portrait.png" alt="" /></span><span className="brand-wordmark">Profesör <strong>Nazif</strong><small>Cymurghs #7466</small></span></a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Kapat' : 'Menü'}<span aria-hidden="true">{menuOpen ? '×' : '☰'}</span></button>
      <nav id="main-nav" className={menuOpen ? 'nav-open' : ''} aria-label="Ana menü">
        <a href="#top" onClick={() => setMenuOpen(false)}>Anasayfa</a>
        <a href="#hakkimizda" onClick={() => setMenuOpen(false)}>Hakkımızda</a>
        <details className="nav-dropdown"><summary>FRC <span aria-hidden="true">⌄</span></summary><div className="dropdown-panel"><p>FRC konu başlıkları</p>{frcTopics.map((item) => <a href="#dersler" key={item.title} onClick={() => chooseTopic(item.title)}>{item.title}</a>)}</div></details>
        <a href="#kategoriler" onClick={() => chooseProgram('FLL')}>FLL</a>
      </nav>
      <a className="header-cta" href="#ozel-ders">Özel ders talep et! <Arrow diagonal /></a>
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="hero-title"><div className="board-frame"><div className="board-inner">
        <div className="hero-content"><p className="hero-hand-note">Tahta hazır. Merakını getir!</p><h1 id="hero-title">Robotik <span>tahtada</span><br />başlar.</h1><p className="hero-description">FRC ve FLL konularını Profesör Nazif’le adım adım keşfet. Tahtada öğrendiğini robotunda dene.</p><div className="hero-actions"><a className="primary-button" href="#dersler">Eğitimleri keşfet <Arrow /></a><a className="quiet-link" href="#nasil-calisir">Nasıl işler? <Arrow diagonal /></a></div><p className="hero-caption">Cymurghs #7466’nın eğitim köşesi</p></div>
        <div className="hero-visual"><span className="hero-visual-label">Profesör bugün tahtada</span><ChalkNazifArtwork /><p>“Bugün ne<br />öğreniyoruz?”</p><span className="hero-star" aria-hidden="true">✳</span></div>
      </div><div className="board-tray" aria-hidden="true"><span className="chalk-piece chalk-piece--white" /><span className="chalk-piece chalk-piece--yellow" /><span className="board-eraser" /></div></div></section>

      <section className="intro-band" aria-label="Kısa tanıtım"><span className="eyebrow">KÜÇÜK BİR TAHTA, BÜYÜK FİKİRLER</span><p>Profesör Nazif, Cymurghs #7466’nın ayı maskotu. Bu eğitim köşesinde robotik, kodlama ve takım çalışmasını merak edenler için konuları çizerek, anlatarak ve deneyerek açıyoruz.</p><a href="#hakkimizda">Hikâyemiz <Arrow diagonal /></a></section>

      <section id="kategoriler" className="section-wrap categories-section" aria-labelledby="categories-title"><div className="section-heading"><div><span className="eyebrow">DERS DEFTERİ / 01</span><h2 id="categories-title">İki program, <em>sekiz öğrenme yolu.</em></h2><p>FRC ve FLL için konu gruplarını keşfet. Her grubun altında örnek dersler yer alıyor.</p></div><span className="hand-annotation">Önce bir kapı seç! ↘</span></div><div className="program-grid">{(['FRC', 'FLL'] as Program[]).map((item) => <article className={`program-panel program-panel--${item.toLowerCase()}`} key={item}><div className="program-heading"><span className="program-index">{item === 'FRC' ? '01' : '02'} / PROGRAM</span><h3>{item}</h3><p>{item === 'FRC' ? 'Robotun sahadaki yolculuğundan takımın sürdürülebilirliğine.' : 'Bir fikrin robota, projeye ve ekip çalışmasına dönüşmesine.'}</p></div><div className="program-groups">{courseGroups.filter((entry) => entry.program === item).map((entry) => <button type="button" key={entry.id} onClick={() => { setProgram(item); setGroup(entry.title); setTopic('Tümü'); document.getElementById('dersler')?.scrollIntoView({ behavior: 'smooth' }); }}><strong>{entry.title} <Arrow diagonal /></strong><span>{entry.description}</span></button>)}</div></article>)}</div></section>

      <section id="frc-konular" className="topics-section" aria-labelledby="topics-title"><div className="section-wrap"><div className="section-heading section-heading--light"><div><span className="eyebrow">FRC / KONU HARİTASI</span><h2 id="topics-title">FRC tahtasında neler var?</h2><p>Eski sitenin konu başlıklarını, ilgili derslerle birlikte yeniden düzenledik.</p></div><span className="hand-annotation">Her çizgi bir soru.</span></div><div className="topic-grid">{frcTopics.map((item, index) => <a href="#dersler" key={item.title} onClick={() => chooseTopic(item.title)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><small>{item.description}</small><i aria-hidden="true">↗</i></a>)}</div><p className="topic-note">Bu başlıklar gezinme için hazır. Dersi henüz eklenmeyen konularda katalog boş durumunu gösterir.</p></div></section>

      <section id="dersler" className="section-wrap lessons-section" aria-labelledby="lessons-title"><div className="section-heading"><div><span className="eyebrow">DERS DEFTERİ / 02</span><h2 id="lessons-title">Tahtadan <em>derse geç.</em></h2><p>Paylaştığınız eski kapaklara dayanarak hazırlanmış örnek kurs taslakları.</p></div><span className="hand-annotation">Bir kapağı aç →</span></div><div className="lesson-toolbar"><div className="program-tabs" role="group" aria-label="Program filtresi">{(['Tümü', 'FRC', 'FLL'] as const).map((item) => <button type="button" key={item} className={program === item ? 'active' : ''} aria-pressed={program === item} onClick={() => { setProgram(item); setGroup('Tümü'); setTopic('Tümü'); }}>{item}</button>)}</div><label className="search-box"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><circle cx="10.8" cy="10.8" r="6.4" stroke="currentColor" strokeWidth="1.7" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.7" /></svg><span className="sr-only">Ders ara</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ders ara..." /></label></div>{(group !== 'Tümü' || topic !== 'Tümü') && <div className="active-filter"><span>Seçili: {topic !== 'Tümü' ? topic : group}</span><button type="button" onClick={resetFilters}>Filtreyi temizle ×</button></div>}<div className="lesson-grid" aria-live="polite">{visibleLessons.map((lesson) => <button type="button" className="lesson-card" key={lesson.id} onClick={() => { setSelectedId(lesson.id); setIntroCycle((cycle) => cycle + 1); }}><LessonCover lesson={lesson} /><span className="lesson-info"><span className="lesson-meta">{lesson.program} / {lesson.group} · TASLAK</span><strong>{lesson.title}</strong><span className="lesson-desc">{lesson.summary}</span><span className="lesson-link">Dersi incele <Arrow diagonal /></span></span></button>)}</div>{visibleLessons.length === 0 && <div className="empty-state"><strong>Bu başlık için ders henüz eklenmedi.</strong><p>Kategori yapısı hazır. Başka bir başlığı inceleyebilirsiniz.</p><button type="button" onClick={resetFilters}>Tüm dersleri göster <Arrow /></button></div>}<p className="demo-note">Ders başlıkları ve açıklamaları geçici içerik taslaklarıdır. Video, kesin müfredat ve materyaller ekip tarafından eklenecek.</p></section>

      {selectedLesson && <section ref={detailRef} className="detail-section" aria-labelledby="detail-title"><div className="section-wrap detail-layout"><div className="detail-head"><span className="eyebrow">{selectedLesson.program} / {selectedLesson.group} / {selectedLesson.topic}</span><button type="button" onClick={() => setSelectedId(null)}>Ders defterini kapat <span aria-hidden="true">×</span></button></div><div className="detail-copy"><span className="draft-stamp">DERS TASLAĞI</span><h2 id="detail-title">{selectedLesson.title}</h2><p className="detail-summary">{selectedLesson.summary}</p><h3>Bu derste neler var?</h3><p>{selectedLesson.longDescription}</p><p className="detail-caveat">Eğitim videosu ve öğretmen eşleştirmesi henüz eklenmedi.</p></div><div className="detail-media"><div className="intro-preview" key={introCycle}><ChalkNazif animated /><span>{selectedLesson.title}</span></div><button type="button" onClick={() => setIntroCycle((cycle) => cycle + 1)}>Tebeşir açılışını yeniden izle <Arrow /></button><div className="video-placeholder"><LessonCover lesson={selectedLesson} /><span>Video eklendiğinde burada oynatılacak</span></div></div></div></section>}

      <section id="nasil-calisir" className="journey-section"><div className="section-wrap journey-layout"><div><span className="eyebrow">PROFESÖRÜN YÖNTEMİ</span><h2>Önce anla.<br /><em>Sonra dene.</em></h2><p>Her eğitim tebeşirle çizilen kısa bir Nazif açılışıyla başlayacak. Ardından konu örneklerle açıklanacak; öğrendiklerini kendi robotunda sınayabileceksin.</p></div><ol><li><span>01</span><strong>Tahtada gör</strong><p>Kavramın çizilmiş, anlaşılır başlangıcı.</p></li><li><span>02</span><strong>Videoyla öğren</strong><p>Konuyu adım adım takip et.</p></li><li><span>03</span><strong>Robotunda dene</strong><p>Bilgiyi gerçek bir göreve taşı.</p></li></ol></div></section>

      <section id="egitmenler" className="section-wrap teachers-section"><div className="section-heading"><div><span className="eyebrow">SINIFTA KİMLER VAR?</span><h2>Öğretmen <em>kadrosu.</em></h2><p>Eski içerik dokümanında yer alan isimler. Fotoğraf ve profil açıklamaları hazır olduğunda bu alan tamamlanacak.</p></div></div><div className="teacher-list">{teachers.map((name, index) => <div key={name}><span>{String(index + 1).padStart(2, '0')}</span><strong>{name}</strong><small>Profil hazırlanıyor</small></div>)}</div></section>

      <section id="hakkimizda" className="about-section"><div className="section-wrap about-layout"><div className="about-logo"><img src="/cymurghs-logo.png" alt="Cymurghs #7466 takım logosu" /><span>Cymurghs #7466</span></div><div><span className="eyebrow">HAKKIMIZDA</span><h2>Merakın yanına<br /><em>bir tahta koyduk.</em></h2><p>Profesör Nazif, Cymurghs #7466 takımının ayı maskotundan doğan bir eğitim fikri. FRC ve FLL yolculuğunda karşımıza çıkan kavramları, bir öğretmenin tahtada anlattığı gibi açık ve izlenebilir kılmak istiyoruz.</p><p>Bu sayfa, derslerin ve videoların toplanacağı yerin ilk tasarımıdır. Mekanikten yazılıma, proje üretiminden takım kültürüne uzanan başlıklar zamanla gerçek içeriklerle dolacak. Nazif de her videonun başında tebeşir çizgileriyle sizi karşılayacak.</p><a href="https://www.cymurghs7466.com/" target="_blank" rel="noreferrer">Cymurghs takımını tanı <Arrow diagonal /></a></div></div></section>

      <section id="ozel-ders" className="contact-section"><div className="section-wrap contact-layout"><div><span className="eyebrow">BİRLİKTE ÖĞRENELİM</span><h2>Aklında özel bir soru mu var?</h2><p>Özel ders veya eğitim talebi için takımın iletişim sayfasına ulaşabilirsin.</p></div><a href={contactUrl} target="_blank" rel="noreferrer">Özel ders talep et <Arrow diagonal /></a></div></section>
    </main>

    <footer className="site-footer"><div className="section-wrap footer-layout"><div className="footer-identity"><img src="/cymurghs-logo.png" alt="" /><span><strong>Profesör Nazif</strong><small>Cymurghs #7466’nın eğitim köşesi</small></span></div><div className="footer-social"><span>Bizi takip et</span><div>{socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div></div><a className="back-to-top" href="#top">Başa dön ↑</a></div></footer>
  </>;
}

export default App;
