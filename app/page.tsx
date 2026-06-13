'use client';
import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Lenis from 'lenis';
import Image from 'next/image';
import './home.css';

const menuItems = [
  { name: 'Jaggery Flat White', tag: 'Signature', price: '₹180', img: '/latte.png' },
  { name: 'Coorg Cold Brew', tag: 'Seasonal', price: '₹260', img: '/beans.png' },
  { name: 'Darjeeling First Flush', tag: 'Tea', price: '₹160', img: '/pourover.png' },
  { name: 'V60 Single Origin', tag: 'Pour Over', price: '₹220', img: '/pourover.png' },
  { name: 'Farm Egg Toast', tag: 'Organic', price: '₹240', img: '/food.png' },
  { name: 'Smoothie Bowl', tag: 'Vegan', price: '₹220', img: '/food.png' },
];
const reviews = [
  { text: '"The V60 here changed how I think about coffee. Clean, clear, honest."', author: 'Riya M. · Google' },
  { text: '"Came for the cold brew, stayed for the space. My favourite place to work."', author: 'Arjun K. · Zomato' },
  { text: '"The jaggery flat white is unlike anything. Sweet without being sweet."', author: 'Priya S. · Google' },
  { text: '"Sourcing from Indian farms, roasting in-house — you taste the difference."', author: 'Dev R. · Google' },
  { text: '"Farm egg toast with chilli oil is the breakfast I didn\'t know I needed."', author: 'Meera T. · Swiggy' },
  { text: '"A genuinely beautiful space you want to keep to yourself."', author: 'Kabir N. · Google' },
];
const galleryLabels = [
  { label: 'Coffee', img: '/latte.png' },
  { label: 'Desserts', img: '/food.png' },
  { label: 'Ambience', img: '/interior.png' },
  { label: 'Workspace', img: '/pourover.png' },
];

const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
};
const wordV = {
  hidden: { y: 80, opacity: 0 },
  visible: (i: number) => ({ y: 0, opacity: 1, transition: { duration: 0.8, delay: 1.8 + i * 0.15, ease: [0.76, 0, 0.24, 1] as const } }),
};

/* ── CUSTOM MONOGRAM COFFEE BEAN (G) ── */
function GBeanIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M24 4C13 4 5 13 5 24C5 35 13 44 24 44C35 44 43 35 43 24C43 13 35 4 24 4Z" 
        stroke="currentColor" 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
      <path 
        d="M24 10C19 16 19 22 23 26C27 30 33 29 33 24C33 19 29 18 24 18H18" 
        stroke="currentColor" 
        strokeWidth="3.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M24 38C23.5 35 23.5 32 24 28" 
        stroke="currentColor" 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
    </svg>
  );
}

/* ── STUNNING 3D SVG COFFEE BEAN COMPONENT ── */
function GiantCoffeeBean() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 25px 60px rgba(0,0,0,0.75))' }}>
      <defs>
        <radialGradient id="leftBeanGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#875239" />
          <stop offset="25%" stopColor="#543020" />
          <stop offset="70%" stopColor="#28140c" />
          <stop offset="100%" stopColor="#0f0502" />
        </radialGradient>
        <radialGradient id="rightBeanGrad" cx="65%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#965f44" />
          <stop offset="25%" stopColor="#5c3524" />
          <stop offset="70%" stopColor="#2e160e" />
          <stop offset="100%" stopColor="#120603" />
        </radialGradient>
        <linearGradient id="beanCreaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#120603" />
          <stop offset="50%" stopColor="#4e2c1d" />
          <stop offset="100%" stopColor="#100502" />
        </linearGradient>
        <linearGradient id="beanSpecHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 3D Soft blur ground shadow */}
      <ellipse cx="100" cy="180" rx="55" ry="12" fill="#000" opacity="0.6" style={{ filter: 'blur(12px)' }} />
      {/* Left lobe */}
      <path d="M100 20 C55 20, 20 55, 20 100 C20 145, 55 180, 100 180 C94 140, 92 100, 100 20 Z" fill="url(#leftBeanGrad)" />
      {/* Right lobe */}
      <path d="M100 20 C108 100, 106 140, 100 180 C145 180, 180 145, 180 100 C180 55, 145 20, 100 20 Z" fill="url(#rightBeanGrad)" />
      {/* S-shaped inner bean seam */}
      <path d="M100 20 C91 50, 94 80, 106 100 C114 120, 109 150, 100 180 C103 150, 110 120, 102 100 C94 80, 90 50, 100 20 Z" fill="url(#beanCreaseGrad)" />
      {/* Left specular highlight for glossy curvature */}
      <path d="M42 55 C33 75, 33 105, 45 125 C39 105, 38 75, 42 55 Z" fill="url(#beanSpecHighlight)" />
      {/* Right specular highlight */}
      <path d="M152 60 C160 80, 160 110, 149 130 C155 110, 156 80, 152 60 Z" fill="url(#beanSpecHighlight)" />
    </svg>
  );
}

function StatCell({ target, suffix, label, decimals = 0 }: { target: number; suffix: string; label: string; decimals?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(decimals > 0 ? '0.' + '0'.repeat(decimals) + suffix : '0' + suffix);
  const counted = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || counted.current) return;
      counted.current = true;
      el.classList.add('counted');
      const dur = 1800, start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
        const raw = ease * target;
        let display: string;
        if (decimals > 0) {
          display = raw.toFixed(decimals);
        } else if (target >= 1000) {
          display = Math.round(raw).toLocaleString('en-IN');
        } else {
          display = String(Math.round(raw));
        }
        setV(display + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    obs.observe(el); return () => obs.disconnect();
  }, [target, suffix, decimals]);
  return <div className="stat-cell" ref={ref}><div className="stat-cell-num">{v}</div><div className="stat-cell-label">{label}</div></div>;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const cafeName = searchParams.get('cafe') || 'GROVE';
  const cafeNameUpper = cafeName.toUpperCase();
  const cafeNameTitle = cafeName.charAt(0).toUpperCase() + cafeName.slice(1);

  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(false);
  const [hovMenu, setHovMenu] = useState<number | null>(null);
  const [navScr, setNavScr] = useState(false);
  const [activeNav, setActiveNav] = useState('');
  const [galleryImg, setGalleryImg] = useState('/interior.png');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  // Dynamic Ahmedabad Local Time & Open Status
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const ist = new Date(utc + (3600000 * 5.5));
      let hours = ist.getHours();
      const minutes = ist.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minStr = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours}:${minStr} ${ampm}`);
      const istHours = ist.getHours();
      setIsOpen(istHours >= 7 && istHours < 23);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const mx = useMotionValue(-100), my = useMotionValue(-100);
  const sx = useSpring(mx, { damping: 20, stiffness: 250 }), sy = useSpring(my, { damping: 20, stiffness: 250 });
  const rx = useSpring(mx, { damping: 30, stiffness: 180 }), ry = useSpring(my, { damping: 30, stiffness: 180 });
  
  // Floating cursor beans
  const bx1 = useSpring(mx, { damping: 15, stiffness: 100 }), by1 = useSpring(my, { damping: 15, stiffness: 100 });
  const bx2 = useSpring(mx, { damping: 12, stiffness: 80 }), by2 = useSpring(my, { damping: 12, stiffness: 80 });
  const bx3 = useSpring(mx, { damping: 10, stiffness: 60 }), by3 = useSpring(my, { damping: 10, stiffness: 60 });

  // Mouse Parallax transforms on the Giant Bean
  const beanX = useTransform(mx, (val) => {
    if (typeof window === 'undefined') return 0;
    return (val - window.innerWidth / 2) * 0.08;
  });
  const beanY = useTransform(my, (val) => {
    if (typeof window === 'undefined') return 0;
    return (val - window.innerHeight / 2) * 0.08;
  });
  const beanRotX = useTransform(my, (val) => {
    if (typeof window === 'undefined') return 0;
    return -(val - window.innerHeight / 2) * 0.05;
  });
  const beanRotY = useTransform(mx, (val) => {
    if (typeof window === 'undefined') return 0;
    return (val - window.innerWidth / 2) * 0.05;
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const magnetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 2200); return () => clearTimeout(t); }, []);

  // Lenis
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!a) return; e.preventDefault();
      const el = document.getElementById(a.getAttribute('href')!.slice(1));
      if (el) {
        setMobileMenuOpen(false);
        lenis.scrollTo(el, { offset: -80 });
      }
    };
    document.addEventListener('click', onClick);
    return () => { lenis.destroy(); document.removeEventListener('click', onClick); };
  }, []);

  // Mouse
  useEffect(() => {
    const h = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h);
  }, [mx, my]);

  // Scroll spy
  useEffect(() => {
    const h = () => {
      setNavScr(window.scrollY > 60);
      const secs = ['story', 'menu', 'gallery', 'reviews', 'location'];
      let c = '';
      secs.forEach(id => { const el = document.getElementById(id); if (el && window.scrollY >= el.offsetTop - 300) c = id; });
      setActiveNav(c);
    };
    window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h);
  }, []);

  // Magnetic button calculations
  const onMagMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget, r = btn.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${dx * 0.22}px,${dy * 0.22}px)`;
  }, []);
  const onMagLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = ''; }, []);

  return (<>
    {/* LOADER v2 */}
    <div 
      className={`loader ${loaded ? 'done' : ''}`} 
      style={{ '--char-count': cafeNameUpper.length } as React.CSSProperties}
    >
      <div className="loader-curtain-top" />
      <div className="loader-curtain-bot" />
      <div className="loader-inner">
        <div className="loader-bean"><GBeanIcon size={32} /></div>
        <div className="loader-word">
          {cafeNameUpper.split('').map((letter, i) => (
            <span key={i} className="loader-letter" style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
              <span style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
                {letter === ' ' ? '\u00a0' : letter}
              </span>
            </span>
          ))}
        </div>
        <div className="loader-line" />
        <div className="loader-tag">Farm to Cup</div>
      </div>
      <div className="loader-progress" />
    </div>

    {/* CURSOR */}
    {mounted && (
      <>
        <motion.div className="cursor-dot" style={{ left: mx, top: my }} />
        <motion.div className="cursor-ring" style={{ left: rx, top: ry }} />
        <motion.div className="mouse-glow" style={{ left: sx, top: sy }} />
        {/* Subtle following bean path particles */}
        <motion.div className="cursor-bean" style={{ left: bx1, top: by1 }}><GBeanIcon size={11} /></motion.div>
        <motion.div className="cursor-bean" style={{ left: bx2, top: by2 }}>·</motion.div>
        <motion.div className="cursor-bean" style={{ left: bx3, top: by3 }}>◦</motion.div>
      </>
    )}

    {/* NAVBAR */}
    <nav className={`navbar ${navScr ? 'scrolled' : ''}`}>
      <a href="#hero" className="nav-logo">{cafeNameUpper}</a>
      <ul className="nav-links">
        {[['story','Story'],['menu','Menu'],['gallery','Gallery'],['reviews','Reviews'],['location','Visit']].map(([id,l]) => (
          <li key={id}><a href={`#${id}`} className={activeNav === id ? 'active' : ''}>{l}</a></li>
        ))}
      </ul>
      <button className="nav-reserve" onClick={() => setModal(true)} onMouseMove={onMagMove} onMouseLeave={onMagLeave}>Reserve a table</button>
      
      {/* Responsive Hamburger Toggle */}
      <button className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>
    </nav>

    {/* Mobile Navigation Drawer */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div className="mobile-drawer" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
          <ul className="mobile-drawer-links">
            {[
              ['story','Story'],
              ['menu','Menu'],
              ['gallery','Gallery'],
              ['reviews','Reviews'],
              ['location','Visit']
            ].map(([id,l]) => (
              <li key={id}>
                <a href={`#${id}`} className={activeNav === id ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>{l}</a>
              </li>
            ))}
          </ul>
          <button className="mobile-drawer-reserve" onClick={() => { setMobileMenuOpen(false); setModal(true); }}>Reserve a Table</button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* HERO */}
    <section className="hero" id="hero">
      <div className="hero-left">
        <motion.div className="hero-eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.5 }}>
          <span className="dot" /> Farm to cup · Ahmedabad
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {['Coffee', 'grown', 'close', 'to earth.'].map((w, i) => (
            <motion.div key={w} className={`hero-word ${w === 'close' ? 'accent' : ''}`} custom={i} initial="hidden" animate="visible" variants={wordV}>{w}</motion.div>
          ))}
        </div>
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5, duration: 0.5 }}>
          Single-origin roasts from Indian farms. Organic bakes made at dawn. A space that breathes at its own pace.
        </motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.7, duration: 0.5 }}>
          <button className="magnetic-btn" ref={magnetRef} onMouseMove={onMagMove} onMouseLeave={onMagLeave} onClick={() => { const el = document.getElementById('menu'); el?.scrollIntoView({ behavior: 'smooth' }); }}>Explore menu</button>
          <button className="btn-ghost" onClick={() => { const el = document.getElementById('story'); el?.scrollIntoView({ behavior: 'smooth' }); }}>Our sourcing →</button>
        </motion.div>
      </div>
      
      {/* 3D Giant Coffee Bean Container */}
      <div className="hero-right">
        <motion.div className="bean-container-3d" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2, duration: 0.9 }}>
          <div className="hero-steam"><span /><span /><span /></div>
          <motion.div className="bean-3d-wrapper" style={mounted ? { x: beanX, y: beanY, rotateX: beanRotX, rotateY: beanRotY } : {}}>
            <motion.div style={{ width: '100%', height: '100%' }} animate={{ y: [-12, 12, -12], rotate: [0, 4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <GiantCoffeeBean />
            </motion.div>
          </motion.div>
          <div className="bean-3d-glow" />
        </motion.div>
      </div>
      
      <motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }} transition={{ opacity: { delay: 3, duration: 0.5 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 3.5 } }}>
        <span>Scroll</span><span>↓</span>
      </motion.div>
    </section>

    {/* SCROLL STORY - Day to Night background transition */}
    <section id="story">
      {[
        { bg: '#0c2a12', text: <>Coffee grown <span>close to earth.</span></>, sub: 'Every bean on our menu has a name, a farm, and an elevation.', img: '/farm.png' },
        { bg: '#0a2210', text: <>From the farms of <span>Coorg.</span></>, sub: 'We spent two years visiting farms in Araku Valley, Coorg, and the Nilgiris.', img: '/beans.png' },
        { bg: '#061508', text: <>Roasted <span>every morning.</span></>, sub: 'Small batches, in-house, three times a week. Nothing older than five days.', img: '/pourover.png' },
        { bg: '#041108', text: <>Served in <span>Ahmedabad.</span></>, sub: 'A space that breathes at its own pace. Walk in any time.', img: '/interior.png' },
      ].map((p, i) => (
        <div key={i} className="story-panel" style={{ background: p.bg }}>
          <div className="story-img"><Image src={p.img} alt="" fill style={{ objectFit: 'cover' }} sizes="100vw" /></div>
          <motion.div className="story-content" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-20%' }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}>
            <div className="story-text">{p.text}</div>
            <div className="story-sub">{p.sub}</div>
          </motion.div>
        </div>
      ))}
    </section>

    {/* GIANT TEXT */}
    <div className="giant-section" style={{ background: '#061a0a' }}>
      <motion.div className="giant-number" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>100%</motion.div>
      <motion.div className="giant-label" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>Organic</motion.div>
      <motion.div className="giant-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>Every ingredient sourced from certified organic farms across India.</motion.div>
    </div>

    {/* MENU */}
    <section className="menu-section" id="menu">
      <div className="menu-header">
        <motion.div className="section-label" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fade}>Our Menu</motion.div>
        <motion.div className="menu-title" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fade}>Every cup tells a story.</motion.div>
      </div>
      <div className="menu-layout">
        <div className="menu-list">
          {menuItems.map((item, i) => (
            <motion.div key={i} className={`menu-item ${hovMenu !== null && hovMenu !== i ? 'dimmed' : ''}`}
              onMouseEnter={() => setHovMenu(i)} onMouseLeave={() => setHovMenu(null)}
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fade}>
              <div className="menu-item-left">
                <div className="menu-item-name">{item.name}</div>
                <div className="menu-item-tag">{item.tag}</div>
              </div>
              <div className="menu-item-price">{item.price}</div>
            </motion.div>
          ))}
        </div>
        <div className="menu-img-box">
          <AnimatePresence mode="wait">
            {hovMenu !== null ? (
              <motion.div key={hovMenu} style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <Image src={menuItems[hovMenu].img} alt={menuItems[hovMenu].name} fill style={{ objectFit: 'cover' }} sizes="50vw" />
              </motion.div>
            ) : (
              <motion.div key="ph" className="menu-img-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>☕<span>Hover a drink</span></motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>

    {/* DRINK JOURNEY — Storytelling Timeline */}
    <section className="drink-journey">
      <motion.div className="section-label" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fade}>The Process</motion.div>
      <motion.div className="menu-title" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fade}>From bean to cup.</motion.div>
      <div className="drink-steps">
        {[
          { img: '/sourced_process.png', num: '01', label: 'Step One', title: 'Sourced', desc: 'Hand-picked from organic farms in Coorg and Araku Valley. We visit every farm, meet every grower, and trace every harvest back to its elevation.' },
          { img: '/selected_process.png', num: '02', label: 'Step Two', title: 'Selected', desc: 'Only the top 5% of beans make it through our quality check. Each batch is cupped, scored, and profiled before we commit.' },
          { img: '/roasted_process.png', num: '03', label: 'Step Three', title: 'Roasted', desc: 'Small-batch roasted in-house, three times every week. Nothing on our shelf is older than five days. Ever.' },
          { img: '/served_process.png', num: '04', label: 'Step Four', title: 'Served', desc: 'Brewed to order and served within 90 seconds. Each cup is pulled at the exact temperature and grind for its origin.' },
        ].map((s, i, arr) => (
          <React.Fragment key={i}>
            <motion.div className={`drink-step ${i % 2 === 1 ? 'step-even' : ''}`} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10%' }} custom={0} variants={fade}>
              <div className="drink-step-img-box">
                <Image src={s.img} alt={s.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 100vw, 45vw" />
                <div className="drink-step-overlay" />
              </div>
              <div className="drink-step-node">
                <div className="drink-step-number">{s.num}</div>
              </div>
              <div className="drink-step-content">
                <div className="drink-step-label">{s.label}</div>
                <div className="drink-step-title">{s.title}</div>
                <div className="drink-step-desc">{s.desc}</div>
              </div>
            </motion.div>
            {i < arr.length - 1 && <div className="drink-step-arrow" />}
          </React.Fragment>
        ))}
      </div>
    </section>

    {/* MOOD WORDS */}
    <div className="mood-section">
  <div className="mood-grid">
    <blockquote style={{
      fontFamily: 'var(--font-syne), sans-serif',
      fontSize: 'clamp(28px, 5vw, 64px)',
      fontWeight: 800,
      color: 'var(--text)',
      letterSpacing: '-.04em',
      lineHeight: 1.1,
      position: 'relative',
      zIndex: 1,
    }}>
      Slow down.{' '}
      <span style={{ color: 'var(--accent)' }}>The coffee</span>{' '}
      is worth it.
    </blockquote>
    <cite style={{
      display: 'block',
      marginTop: 24,
      fontStyle: 'normal',
      fontSize: 12,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--muted)',
      position: 'relative',
      zIndex: 1,
    }}>
      — {cafeNameTitle}, Ahmedabad
    </cite>
  </div>
</div>

    {/* GALLERY SPLIT */}
    <section className="gallery-section" id="gallery">
      <div className="gallery-left">
        <AnimatePresence mode="wait">
          <motion.div key={galleryImg} style={{ position: 'relative', width: '100%', height: '100%' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Image src={galleryImg} alt="Gallery" fill style={{ objectFit: 'cover' }} sizes="50vw" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="gallery-right">
        {galleryLabels.map((g, i) => (
          <div key={i} className="gallery-right-item" onMouseEnter={() => setGalleryImg(g.img)}>
            <Image src={g.img} alt={g.label} fill style={{ objectFit: 'cover' }} sizes="50vw" />
            <span className="gallery-right-label">{g.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* REVIEWS */}
    <section className="reviews-section" id="reviews">
      <div className="reviews-head">
        <motion.div className="section-label" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fade}>What people say</motion.div>
        <motion.div className="reviews-title" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fade}>1,200+ reviews. All earned.</motion.div>
      </div>
      <div className="marquee-outer">
  {/* Row 1 — left scroll */}
  <div className="marquee-track">
    {[...reviews, ...reviews].map((r, i) => (
      <div key={i} className="review-card">
        <div className="review-stars">★★★★★</div>
        <p className="review-text">{r.text}</p>
        <div className="review-author">{r.author}</div>
      </div>
    ))}
  </div>
  {/* Row 2 — right scroll (reverse) */}
  <div className="marquee-track reverse">
    {[...reviews.slice().reverse(), ...reviews.slice().reverse()].map((r, i) => (
      <div key={i} className="review-card">
        <div className="review-stars">★★★★★</div>
        <p className="review-text">{r.text}</p>
        <div className="review-author">{r.author}</div>
      </div>
    ))}
  </div>
</div>
    </section>

    {/* GIANT STATS */}
    <div className="giant-section">
      <motion.div className="giant-number" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>12,000+</motion.div>
      <motion.div className="giant-label" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>Cups Served</motion.div>
      <motion.div className="giant-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>And counting. Every single one brewed with intention.</motion.div>
    </div>

    <div className="stats-row">
      <StatCell target={4.8} suffix="★" label="Google Rating" decimals={1} />
      <StatCell target={14} suffix="" label="Farm Partners" />
      <StatCell target={6} suffix=" Years" label="In Ahmedabad" />
    </div>

    {/* LOCATION */}
    <section className="location-section" id="location">
      <iframe className="location-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14689!2d72.5!3d23.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f0!2sAhmedabad!5e0!3m2!1sen!2sin!4v1" loading="lazy" title="Location" />
      <div className="location-info">
        <motion.div className="location-label" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fade}>Visit Us</motion.div>
        <motion.div className="location-city" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fade}>Ahmedabad</motion.div>
        <motion.div className="location-hours" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fade}>Open Daily</motion.div>
        <motion.div className="location-time" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} variants={fade}>7AM — 11PM</motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4} variants={fade}>
          <button className="location-cta" onClick={() => setModal(true)} onMouseMove={onMagMove} onMouseLeave={onMagLeave}>Reserve a table →</button>
        </motion.div>
        <motion.div className="location-details" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5} variants={fade}>
          <div><div className="loc-detail-label">Address</div><div className="loc-detail-val">Satellite Road, Ahmedabad</div></div>
          <div><div className="loc-detail-label">Phone</div><div className="loc-detail-val">+91 98765 43210</div></div>
          <div><div className="loc-detail-label">Instagram</div><div className="loc-detail-val">@grovecafe.ahm</div></div>
        </motion.div>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main-grid">
          {/* Brand & Status */}
          <div className="footer-brand-col">
            <div className="footer-brand">{cafeNameUpper}</div>
            <p className="footer-tagline">
              Farm to cup. Single-origin coffee roasted with intention in Ahmedabad.
            </p>
            <div className="footer-status-widget">
              <div className="status-dot-wrapper">
                <span className={`status-dot ${isOpen ? 'open' : 'closed'}`} />
                <span className="status-text">{isOpen ? 'Open Now' : 'Closed'}</span>
              </div>
              <div className="status-time">
                Ahmedabad Local Time: <span>{time || '7:00 AM'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="footer-nav-grid">
            <div className="footer-nav-col">
              <h4>Explore</h4>
              <a href="#menu">Menu</a>
              <a href="#story">Our Story</a>
              <a href="#gallery">Gallery</a>
              <a href="#reviews">Reviews</a>
            </div>
            <div className="footer-nav-col">
              <h4>Visit</h4>
              <a href="#location">Location</a>
              <a onClick={() => setModal(true)} style={{ cursor: 'pointer' }}>Reserve a Table</a>
              <a href="#location">Hours & Directions</a>
            </div>
            <div className="footer-nav-col">
              <h4>Socials</h4>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">Spotify Playlist</a>
              <a href="mailto:hello@grove.cafe">hello@grove.cafe</a>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="footer-news-col">
            <h4>Freshly Brewed Inbox</h4>
            <p className="news-desc">Subscribe for early access to micro-lot roasts, tasting notes, and secret weekend bakes.</p>
            <form className="footer-news-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
              <input type="email" placeholder="Your email address" className="news-input" required />
              <button type="submit" className="news-submit-btn">
                <span>Join</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </form>
          </div>
        </div>

        <div className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span className="footer-copy">© {new Date().getFullYear()} {cafeNameTitle} Cafe. All rights reserved.</span>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span>Back to top</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
        </div>
      </div>
    </footer>

    {/* MODAL */}
    <AnimatePresence>
      {modal && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)}>
          <motion.div className="modal-content" initial={{ y: 40, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            <div className="modal-title">Reserve a Table</div>
            <div className="modal-sub">Save your spot for a quiet morning.</div>
            <form onSubmit={e => { e.preventDefault(); setModal(false); }}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" required /></div>
                <div className="form-group"><label className="form-label">Time</label><input type="time" className="form-input" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Guests</label>
                  <select className="form-input" required><option value="">Select</option>{[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}</select>
                </div>
                <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" placeholder="+91" required /></div>
              </div>
              <button type="submit" className="form-submit">Confirm Reservation</button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>);
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
