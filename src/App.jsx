import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowDownLeft, ArrowLeft, ArrowUpLeft, AtSign, Award, BriefcaseBusiness, CalendarDays, Check, Clock3, Code2, ExternalLink, Github, GraduationCap, HeartHandshake, Instagram, Linkedin, MapPin, Menu, MessageCircle, Phone, Send, Wrench, X } from 'lucide-react';
import portfolio from './data/portfolio.config.js';

const reveal = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: .65, ease: [0.22, 1, 0.36, 1] } } };
function useReveal() { const reduced = useReducedMotion(); return reduced ? { hidden: {}, show: {} } : reveal; }
function CinematicIntro() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    try { return !sessionStorage.getItem('msa-intro-seen'); } catch { return true; }
  });
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => {
      setVisible(false);
      try { sessionStorage.setItem('msa-intro-seen', '1'); } catch {}
    }, reduced ? 250 : 1850);
    return () => window.clearTimeout(timer);
  }, [visible, reduced]);
  if (!visible) return null;
  return <motion.div className="cinematic-intro" initial={{opacity:1}} animate={{opacity:1}} exit={{opacity:0}} aria-label="تحميل الموقع">
    <div className="intro-grid" aria-hidden="true"/><motion.div className="intro-core" initial={reduced?false:{opacity:0,y:18,scale:.94}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.65,ease:[.22,1,.36,1]}}>
      <div className="intro-monogram"><span>م</span><i/></div>
      <p className="intro-overline">INDEPENDENT DIGITAL PORTFOLIO <span>·</span> 2026</p>
      <h2>محمد صادق <b>عوض</b></h2>
      <p className="intro-subtitle">أفكار تتحوّل إلى تجارب رقمية</p>
      <div className="intro-progress"><motion.i initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:reduced?.2:1.45,ease:[.65,0,.35,1]}}/></div>
      <div className="intro-footer"><span>DESIGNING WITH PURPOSE</span><span>MSA / 001</span></div>
    </motion.div>
    <motion.div className="intro-curtain" initial={{scaleY:1}} animate={{scaleY:0}} transition={{delay:reduced?0:1.25,duration:.65,ease:[.76,0,.24,1]}}/>
  </motion.div>;
}
function CursorFX() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const springX = useSpring(x,{stiffness:420,damping:32,mass:.35});
  const springY = useSpring(y,{stiffness:420,damping:32,mass:.35});
  const [enabled,setEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    setEnabled(media.matches && !reduced);
    const move = e => { x.set(e.clientX); y.set(e.clientY); document.documentElement.style.setProperty('--pointer-x',`${e.clientX}px`); document.documentElement.style.setProperty('--pointer-y',`${e.clientY}px`); };
    const hoverOn = e => { if (e.target.closest('a,button,[role="button"],.project-card,.skill-group')) document.body.classList.add('cursor-hover'); };
    const hoverOff = e => { if (e.target.closest('a,button,[role="button"],.project-card,.skill-group') && !e.relatedTarget?.closest('a,button,[role="button"],.project-card,.skill-group')) document.body.classList.remove('cursor-hover'); };
    window.addEventListener('pointermove',move,{passive:true}); document.addEventListener('pointerover',hoverOn); document.addEventListener('pointerout',hoverOff);
    return () => { window.removeEventListener('pointermove',move); document.removeEventListener('pointerover',hoverOn); document.removeEventListener('pointerout',hoverOff); document.body.classList.remove('cursor-hover'); };
  },[reduced,x,y]);
  if (!enabled) return null;
  return <div className="cursor-fx" aria-hidden="true"><motion.span className="cursor-ring" style={{x:springX,y:springY}}/><motion.span className="cursor-core" style={{x,y}}/></div>;
}
function Topbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc]);
  const links = [{href:'/#about',label:'عني'},{href:'/#skills',label:'المهارات'},{href:'/#projects',label:'المشاريع'},{href:'/#volunteering',label:'التطوع'},{href:'/#workshops',label:'الورشات'},{href:'/#contact',label:'تواصل'}];
  return <header className="topbar"><Link to="/" className="brand" aria-label="الرئيسية"><span className="brand-mark">م</span><span>ملف <b>شخصي</b><small>PORTFOLIO / 2026</small></span></Link>
    <button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'إغلاق القائمة':'فتح القائمة'}>{open?<X/>:<Menu/>}</button>
    <nav className={open?'nav open':'nav'}>{links.map(l=><a key={l.href} href={l.href}>{l.label}</a>)}<a className="nav-cta" href="/#contact">لنتحدث <ArrowUpLeft size={15}/></a></nav>
  </header>;
}
function SectionHead({eyebrow,title,desc}) { const v=useReveal(); return <motion.div className="section-head" variants={v} initial="hidden" whileInView="show" viewport={{once:true,amount:.35}}><span className="eyebrow"><i/> {eyebrow}</span><h2>{title}</h2>{desc&&<p>{desc}</p>}</motion.div>; }
function ScrollEffects() { const {scrollYProgress,scrollY}=useScroll(); const scaleX=useSpring(scrollYProgress,{stiffness:120,damping:28,restDelta:.001}); const [showTop,setShowTop]=useState(false); useEffect(()=>scrollY.on('change',v=>setShowTop(v>650)),[scrollY]); return <><motion.div className="scroll-progress" style={{scaleX, transformOrigin:'right'}} aria-hidden="true"/><motion.button className="back-to-top" aria-label="العودة إلى الأعلى" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} initial={false} animate={{opacity:showTop?1:0,y:showTop?0:14,scale:showTop?1:.85,pointerEvents:showTop?'auto':'none'}} transition={{duration:.25}}><ArrowUpLeft size={19}/></motion.button></>; }
function ImagePlaceholder({path,alt='',className=''}) {
  const [failed,setFailed] = useState(false);
  return <div className={`image-frame ${className}`}>
    {!failed && path ? <img src={path} alt={alt} loading="lazy" onError={()=>setFailed(true)}/> : <div className="image-placeholder"><span className="placeholder-orbit"/><Code2 size={30}/><span>أضف الصورة من مجلد الصور</span><small>{path}</small></div>}
  </div>;
}
function ProjectCard({project,index}) {
  const v = useReveal();
  return <motion.article className={`project-card project-card-${index+1}`} variants={v} initial="hidden" whileInView="show" whileHover={{y:-8, transition:{duration:.25}}} whileTap={{scale:.99}} viewport={{once:true,amount:.15}} transition={{delay:index*.08}}>
    <Link className="project-visual" to={`/projects/${project.id}`} aria-label={`تفاصيل ${project.title}`}><ImagePlaceholder path={project.cover} alt={project.title}/><span className="visual-index">0{index+1}</span><span className="visual-arrow"><ArrowUpLeft size={20}/></span></Link>
    <div className="project-meta"><span>{project.category}</span><span>{String(project.order).padStart(2,'0')} / PROJECT</span></div>
    <h3><Link to={`/projects/${project.id}`}>{project.title}</Link></h3><p>{project.description}</p>
    <div className="tag-row">{project.technologies.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>
    <Link className="text-link" to={`/projects/${project.id}`}>استكشف المشروع <ArrowLeft size={16}/></Link>
  </motion.article>;
}
function VolunteeringSection({items, variants}) {
  return <section id="volunteering" className="section page-wrap volunteering-section">
    <SectionHead eyebrow="04 — الأثر المجتمعي" title="عمل تطوعي ترك أثراً ملموساً." desc="تجربة عملية في تنظيم السجلات وتحسين إجراءات الأرشفة، مع التركيز على الدقة وسرعة الإنجاز."/>
    <div className="volunteer-list">{items.map((item,index)=><motion.article className="volunteer-card" key={item.id} variants={variants} initial="hidden" whileInView="show" whileHover={{y:-5, transition:{duration:.25}}} viewport={{once:true,amount:.15}} transition={{delay:index*.08}}>
      <div className="volunteer-icon"><HeartHandshake size={25}/></div>
      <div className="volunteer-content"><div className="volunteer-kicker"><span>{item.organization}</span><span className="volunteer-date"><CalendarDays size={14}/>{item.date}</span></div>
        <h3>{item.title}</h3><p className="volunteer-location"><MapPin size={14}/>{item.location}</p><p className="volunteer-summary">{item.summary}</p>
        <div className="volunteer-stats"><span><Clock3 size={16}/><b>{item.duration}</b></span><span><Award size={16}/><b>{item.certificate}</b></span></div>
        <ul className="volunteer-achievements">{item.achievements.map((achievement,i)=><li key={i}><Check size={16}/>{achievement}</li>)}</ul>
      </div><div className="volunteer-index">VOL / 0{index+1}</div>
    </motion.article>)}</div>
  </section>;
}
function WorkshopsSection({items, variants}) {
  return <section id="workshops" className="section workshops-section"><div className="page-wrap">
    <SectionHead eyebrow="05 — التعلّم المستمر" title="ورشات أوسّع بها خبرتي العملية." desc="تدريبات تطبيقية تساعدني على فهم الأنظمة من مكوّناتها الأساسية حتى تشغيلها المتكامل."/>
    <div className="workshop-list">{items.map((item,index)=><motion.article className="workshop-card" key={item.id} variants={variants} initial="hidden" whileInView="show" whileHover={{y:-5, transition:{duration:.25}}} viewport={{once:true,amount:.15}} transition={{delay:index*.08}}>
      <div className="workshop-topline"><span className="workshop-number">0{index+1}</span><span className="workshop-label"><Wrench size={14}/> تدريب تقني عملي</span></div>
      <div className="workshop-main"><div className="workshop-info"><h3>{item.title}</h3><p>{item.summary}</p><div className="workshop-meta"><span><CalendarDays size={15}/>{item.date}</span><span><Clock3 size={15}/>{item.duration}</span></div><div className="workshop-topics">{item.topics.map(topic=><span key={topic}>{topic}</span>)}</div></div>
        <div className="workshop-gallery">{item.images.map((img,i)=><ImagePlaceholder key={img} path={img} alt={`${item.title} — صورة التدريب ${i+1}`} className={i===0?'workshop-image workshop-image-large':'workshop-image'}/>)}</div></div>
      <div className="workshop-foot"><span>صور حقيقية من التدريب</span><span>WORKSHOP / {item.id.toUpperCase()}</span></div>
    </motion.article>)}</div>
  </div></section>;
}

function Home() {
  const [all,setAll] = useState(false);
  const v=useReveal();
  const featured = [...portfolio.projects].sort((a,b)=>a.order-b.order).filter(p=>p.featured);
  const projects = [...portfolio.projects].sort((a,b)=>a.order-b.order);
  const contacts = [
    {label:'البريد الإلكتروني',value:portfolio.personal.email,href:`mailto:${portfolio.personal.email}`,icon:AtSign},
    {label:'Telegram',value:'راسلني على تلغرام',href:portfolio.personal.telegram,icon:Send},
    {label:'GitHub',value:'المستودعات والمشاريع',href:portfolio.personal.github,icon:Github},
    {label:'Instagram',value:'تابعني على إنستغرام',href:portfolio.personal.instagram,icon:Instagram},
    {label:'Facebook',value:'تواصل عبر فيسبوك',href:portfolio.personal.facebook,icon:MessageCircle},
    {label:'LinkedIn',value:'أضف رابط حسابك من الإعدادات',href:portfolio.personal.linkedin,icon:Linkedin}
  ].filter(c=>c.href);
  return <>
    <section className="hero page-wrap">
      <div className="hero-grid-art" aria-hidden="true"><div className="grid-lines"/><div className="glow glow-one"/><div className="glow glow-two"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/></div>
      <motion.div className="hero-copy" initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:.13}}}}>
        <motion.div variants={v} className="availability"><span className="status-dot"/> مهندس برمجيات · متاح للتعاون على مشاريع مناسبة</motion.div>
        <motion.p variants={v} className="hero-kicker">أبني حلولاً رقمية من الفكرة إلى التنفيذ <span>✳</span></motion.p>
        <motion.h1 variants={v}>محمد صادق<br/><span>جمعة عوض</span><small>Mohammad Sadiq Awad</small></motion.h1>
        <motion.div variants={v} className="hero-role"><span>Software Engineer</span><b>/</b><span>Flutter Developer</span><b>/</b><span>Backend Developer</span></motion.div>
        <motion.p variants={v} className="hero-intro">{portfolio.personal.intro}</motion.p>
        <motion.div variants={v} className="hero-actions"><a className="button button-primary" href="#projects">استكشف أعمالي <ArrowUpLeft size={18}/></a><a className="button button-ghost" href="#contact">تواصل معي <ArrowLeft size={17}/></a></motion.div>
        <motion.div variants={v} className="hero-footnote"><span><MapPin size={14}/>{portfolio.personal.location}</span><span><GraduationCap size={15}/>خريج هندسة معلوماتية · 2026</span></motion.div>
      </motion.div>
      <motion.div className="hero-portrait-wrap" initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} transition={{duration:1,ease:'easeOut',delay:.25}}>
        <div className="portrait-coordinate coordinate-top">PROFILE / 001</div><div className="portrait-halo"/><div className="portrait-ring"><ImagePlaceholder path={portfolio.personal.portrait} alt="الصورة الشخصية لمحمد صادق" className="portrait-image"/></div>
        <div className="portrait-chip chip-top"><span className="chip-icon"><Code2 size={17}/></span><span><b>Clean Code</b><small>Built to scale</small></span></div>
        <div className="portrait-chip chip-bottom"><span className="chip-icon purple"><BriefcaseBusiness size={17}/></span><span><b>Problem Solver</b><small>Ideas into products</small></span></div>
        <div className="portrait-caption"><span>DS / SY</span><span>34° 48' N — 40° 07' E</span></div>
      </motion.div>
      <a className="scroll-cue" href="#about"><span>مرّر للاستكشاف</span><ArrowDownLeft size={16}/></a>
      <div className="hero-side-label">DIGITAL CRAFT · ENGINEERING · IMPACT</div>
    </section>
    <div className="ticker" aria-label="التخصصات"><div className="ticker-track">{Array.from({length:2},(_,i)=><span key={i}>FLUTTER <i>✳</i> BACKEND <i>✳</i> PROBLEM SOLVING <i>✳</i> SOFTWARE ENGINEERING <i>✳</i> AI INTEGRATION <i>✳</i></span>)}</div></div>
    <section id="about" className="section page-wrap about-section"><SectionHead eyebrow="01 — نبذة عني" title={portfolio.about.heading} desc="أجمع بين التفكير المنهجي والتنفيذ العملي لبناء تجارب رقمية مفيدة."/><div className="about-layout"><motion.div className="about-copy" variants={v} initial="hidden" whileInView="show" viewport={{once:true}}>{portfolio.about.paragraphs.map(p=><p key={p}>{p}</p>)}<div className="about-facts"><div><span className="fact-num">96%</span><span>تقييم مشروع التخرج</span></div><div><span className="fact-num">2026</span><span>سنة التخرج</span></div><div><span className="fact-num">4+</span><span>مشاريع موثقة هنا</span></div></div></motion.div><div className="education-list"><span className="mini-label">المسار الأكاديمي</span>{portfolio.about.education.map((e,i)=><motion.div className="education-item" key={e.label} variants={v} initial="hidden" whileInView="show" viewport={{once:true}} transition={{delay:i*.12}}><div className="education-icon"><GraduationCap size={19}/></div><div><h3>{e.label}</h3><p>{e.detail}</p></div><b>{e.score}</b></motion.div>)}</div></div></section>
    <section id="skills" className="section skills-section"><div className="page-wrap"><SectionHead eyebrow="02 — المهارات" title="أدوات أستخدمها لصناعة الحل." desc="مجموعة تقنية تتطور باستمرار بحسب متطلبات كل مشروع."/><div className="skills-grid">{portfolio.skills.map((group,i)=><motion.div className="skill-group" key={group.category} variants={v} initial="hidden" whileInView="show" whileHover={{y:-6, transition:{duration:.2}}} viewport={{once:true,amount:.2}} transition={{delay:i*.07}}><div className="skill-group-top"><span>0{i+1}</span><Code2 size={19}/></div><h3>{group.category}</h3><div className="skill-tags">{group.items.map(item=><span key={item}>{item}</span>)}</div></motion.div>)}</div></div></section>
    <section id="projects" className="section page-wrap projects-section"><SectionHead eyebrow="03 — مشاريع مختارة" title="مشاريع تحل مشكلات حقيقية." desc="من تطبيقات الهاتف إلى الأنظمة المتكاملة، هذه نماذج من عملي ودوري التقني فيها."/><div className="projects-grid">{(all?projects:featured).map((p,i)=><ProjectCard key={p.id} project={p} index={i}/>)}</div><div className="projects-more"><span>{all?'كل المشاريع المتاحة في الملف':'ثلاثة مشاريع مختارة من ملف الأعمال'}</span><button className="button button-outline" onClick={()=>setAll(!all)}>{all?'عرض المختارة فقط':'عرض جميع المشاريع'} <ArrowUpLeft size={17}/></button></div></section>
    <VolunteeringSection items={portfolio.volunteering || []} variants={v}/>
    <WorkshopsSection items={portfolio.workshops || []} variants={v}/>
    <section className="statement-band"><div className="page-wrap statement-inner"><span className="eyebrow"><i/> طريقة عملي</span><p>الكود الجيد ليس ما يعمل فقط،<br/><em>بل ما يمكن فهمه وتطويره بثقة.</em></p><span className="statement-mark">“</span></div></section>
    <section id="contact" className="section page-wrap contact-section"><SectionHead eyebrow="06 — تواصل" title="لنبنِ شيئاً له قيمة." desc="لديك فكرة، فرصة عمل، أو مشروع يحتاج إلى تنفيذ تقني؟ يسعدني أن أسمع منك."/><div className="contact-layout"><div className="contact-main"><span className="contact-pretitle">ابدأ محادثة جديدة</span><a className="email-big" href={`mailto:${portfolio.personal.email}`}>{portfolio.personal.email}<ArrowUpLeft size={23}/></a><div className="contact-note"><Phone size={15}/><span dir="ltr">{portfolio.personal.phone}</span><span className="note-separator">·</span><MapPin size={15}/>{portfolio.personal.location}</div></div><div className="contact-links">{contacts.map((c,i)=>{const Icon=c.icon;return <motion.a key={c.label} href={c.href} target={c.href.startsWith('http')?'_blank':undefined} rel={c.href.startsWith('http')?'noreferrer noopener':undefined} className="contact-link" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06,duration:.4}} whileHover={{x:-4,transition:{duration:.18}}}><span className="contact-icon"><Icon size={18}/></span><span><b>{c.label}</b><small>{c.value}</small></span><ExternalLink size={15}/></motion.a>})}</div></div></section>
    <footer className="footer page-wrap"><Link to="/" className="brand"><span className="brand-mark">م</span><span>محمد صادق عوض<small>SOFTWARE ENGINEER</small></span></Link><span>© 2026 · {portfolio.settings.footer}</span><a href="#top" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}}>العودة للأعلى ↑</a></footer>
  </>;
}
function ProjectDetail() {
  const {id}=useParams(); const p=portfolio.projects.find(x=>x.id===id); const v=useReveal();
  if(!p) return <main className="page-wrap not-found"><span className="eyebrow">404 — غير موجود</span><h1>لم نعثر على هذا المشروع.</h1><Link className="button button-primary" to="/">العودة للرئيسية <ArrowLeft size={17}/></Link></main>;
  const ordered=[...portfolio.projects].sort((a,b)=>a.order-b.order); const idx=ordered.findIndex(x=>x.id===id); const prev=ordered[(idx-1+ordered.length)%ordered.length], next=ordered[(idx+1)%ordered.length];
  return <main className="project-detail page-wrap"><Link to="/#projects" className="back-link"><ArrowLeft size={16}/> العودة إلى المشاريع</Link><motion.header className="detail-hero" initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:.1}}}}><motion.span className="eyebrow" variants={v}><i/>{p.category} <b>·</b> PROJECT {String(p.order).padStart(2,'0')}</motion.span><motion.h1 variants={v}>{p.title}</motion.h1><motion.p variants={v}>{p.subtitle}</motion.p><motion.div variants={v} className="detail-tags">{p.technologies.map(t=><span key={t}>{t}</span>)}</motion.div></motion.header>
    <div className="detail-cover"><ImagePlaceholder path={p.cover} alt={p.title}/></div>
    <div className="detail-content"><article className="detail-main"><section><span className="mini-label">نظرة عامة</span><h2>الفكرة وراء المشروع</h2><p>{p.longDescription}</p></section><section><span className="mini-label">التحدي</span><h2>المشكلة التي يعالجها</h2><p>{p.problem}</p></section><section><span className="mini-label">الحل</span><h2>الميزات الرئيسية</h2><ul className="feature-list">{p.features.map(f=><li key={f}><Check size={17}/>{f}</li>)}</ul></section>{p.role&&<section><span className="mini-label">دوري في المشروع</span><h2>المساهمة والتنفيذ</h2><p>{p.role}</p></section>}{p.result&&<div className="result-callout"><GraduationCap size={21}/><span>{p.result}</span></div>}</article><aside className="detail-aside"><div className="aside-card"><span className="mini-label">التقنيات المستخدمة</span><div className="aside-techs">{p.technologies.map(t=><span key={t}>{t}</span>)}</div></div><div className="aside-card"><span className="mini-label">روابط المشروع</span>{p.github?<a href={p.github} target="_blank" rel="noreferrer noopener" className="aside-link"><Github size={17}/> الكود المصدري <ExternalLink size={14}/></a>:<p className="muted-small">رابط المستودع غير مضاف حالياً.</p>}{p.demo&&<a href={p.demo} target="_blank" rel="noreferrer noopener" className="aside-link"><ExternalLink size={17}/> رابط التطبيق / العرض</a>}</div></aside></div>
    <section className="detail-gallery"><SectionHead eyebrow="معرض الصور" title="لقطات من المشروع" desc="تظهر الصور هنا بعد إضافة لقطات الشاشة الحقيقية إلى مجلد المشروع."/><div className="gallery-grid">{p.gallery.map((img,i)=><ImagePlaceholder key={img} path={img} alt={`${p.title} — لقطة ${i+1}`} className={i===0?'gallery-large':''}/>)}</div></section>
    <nav className="project-pagination"><Link to={`/projects/${prev.id}`}><span>المشروع السابق</span><b><ArrowRightFallback/> {prev.title}</b></Link><Link to={`/projects/${next.id}`} className="next-project"><span>المشروع التالي</span><b>{next.title} <ArrowLeft size={16}/></b></Link></nav>
  </main>;
}
function ArrowRightFallback(){return <ArrowUpLeft size={16}/>;}
function App() { const location=useLocation(); useEffect(()=>{if(location.hash){setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth'}),80)}else window.scrollTo(0,0)},[location.pathname,location.hash]); return <><div id="top"/><CinematicIntro/><CursorFX/><ScrollEffects/><Topbar/><Routes><Route path="/" element={<Home/>}/><Route path="/projects/:id" element={<ProjectDetail/>}/><Route path="*" element={<main className="page-wrap not-found"><h1>الصفحة غير موجودة</h1><Link className="button button-primary" to="/">العودة للرئيسية</Link></main>}/></Routes></>; }
export default App;