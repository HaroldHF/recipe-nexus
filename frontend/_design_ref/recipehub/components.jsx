/* RecipeHub — componentes compartidos */
const { useState, useEffect, useRef } = React;

/* ---------- icons ---------- */
const Icon = {
  search: (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  clock:  (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  flame:  (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 3c1 3-2 4-2 7a2 2 0 004 0c2 2 3 3 3 6a5 5 0 01-10 0c0-4 5-6 5-13z"/></svg>,
  users:  (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0111 0M16 6a3 3 0 010 5.6M21 19a5.5 5.5 0 00-4-5.3"/></svg>,
  heart:  (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill={p?.fill?"#f4701f":"none"} stroke={p?.fill?"#f4701f":"#f4701f"} strokeWidth="2" strokeLinejoin="round"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/></svg>,
  plus:   (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  trash:  (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>,
  edit:   (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"/></svg>,
  check:  (p) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 7"/></svg>,
  back:   (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7"/></svg>,
  user:   (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="12" cy="8.5" r="3.7"/><path d="M5 20a7 7 0 0114 0"/></svg>,
  logout: (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5h4v14h-4M11 8l-4 4 4 4M7 12h9"/></svg>,
  book:   (p) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5zM6 17h12"/></svg>,
};

/* ---------- stars ---------- */
function Star({ fill, s }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} fill={fill ? "var(--gold)" : "none"} stroke={fill ? "var(--gold)" : "#d6c3ad"} strokeWidth="1.5">
      <path d="M12 17.3l-5.4 3 1-6-4.4-4.3 6.1-.9L12 3l2.7 5.6 6.1.9-4.4 4.3 1 6z" strokeLinejoin="round" />
    </svg>
  );
}
function Stars({ rate }) {
  const n = Math.round(rate);
  return <span className="star-row">{[1,2,3,4,5].map(i => <Star key={i} fill={i <= n} />)}</span>;
}
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-pick" onMouseLeave={() => setHover(0)}>
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onMouseEnter={() => setHover(i)} onClick={() => onChange(i)}>
          <Star s={30} fill={i <= (hover || value)} />
        </button>
      ))}
    </div>
  );
}

/* ---------- image with graceful fallback ---------- */
function PhImg({ r, children, className }) {
  return (
    <div className={"ph-img " + (className||"")} style={{ background:`linear-gradient(140deg, ${r.tone[0]}, ${r.tone[1]})` }}>
      <img src={r.img} alt={r.title} onError={(e)=>{ e.target.style.display='none'; }} />
      <span className="ph-cap">{r.cap}</span>
      {children}
    </div>
  );
}

function Avatar({ user, size=36 }) {
  const initials = (user?.name||"?").split(' ').map(w=>w[0]).slice(0,2).join('');
  return (
    <span className="avatar" style={{ width:size, height:size, fontSize:size*0.4 }}>
      {user?.avatar ? <img src={user.avatar} alt={user.name} onError={(e)=>{e.target.style.display='none';}} /> : initials}
    </span>
  );
}

/* ---------- navbar ---------- */
function Navbar({ route, user, nav, onLogout, search, setSearch }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  const is = (p) => route.name === p;
  return (
    <header className="nav">
      <div className="container nav-in">
        <a className="brand" href="#/" onClick={(e)=>{e.preventDefault();nav('/');}}>Recipe <span>Nexus</span></a>
        <nav className="nav-links">
          <a className={is('home')?'active':''} href="#/" onClick={(e)=>{e.preventDefault();nav('/');}}>Inicio</a>
          <a className={is('home')&&false?'active':''} href="#/" onClick={(e)=>{e.preventDefault();nav('/');}}>Explorar</a>
          {user && <a className={is('new')||is('edit')?'active':''} href="#/nueva" onClick={(e)=>{e.preventDefault();nav('/nueva');}}>Nueva receta</a>}
        </nav>
        <div className="nav-spacer"></div>
        <div className="nav-search">
          {Icon.search({s:16})}
          <input value={search} onChange={(e)=>{setSearch(e.target.value); if(!is('home')) nav('/');}} placeholder="Buscar recetas…" />
        </div>
        {user ? (
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <button className="btn btn-primary btn-sm" onClick={()=>nav('/nueva')}>{Icon.plus({s:15})} Crear</button>
            <div style={{position:'relative'}} ref={ref}>
              <button className="av-btn" onClick={()=>setOpen(o=>!o)}><Avatar user={user} size={38} /></button>
              {open && (
                <div className="menu">
                  <div className="mhead"><div className="nm">{user.name}</div><div className="em">{user.email||user.handle}</div></div>
                  <button onClick={()=>{setOpen(false);nav('/perfil');}}>{Icon.user({s:17})} Mi perfil</button>
                  <button onClick={()=>{setOpen(false);nav('/nueva');}}>{Icon.plus({s:17})} Nueva receta</button>
                  <button className="danger" onClick={()=>{setOpen(false);onLogout();}}>{Icon.logout({s:17})} Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>nav('/login')}>Iniciar sesión</button>
            <button className="btn btn-primary btn-sm" onClick={()=>nav('/register')}>Crear cuenta</button>
          </div>
        )}
      </div>
    </header>
  );
}

function Footer({ nav }) {
  return (
    <footer className="foot-main">
      <div className="container foot-in">
        <a className="brand" href="#/" onClick={(e)=>{e.preventDefault();nav('/');}}>Recipe <span>Nexus</span></a>
        <div className="links">
          <a href="#/" onClick={(e)=>{e.preventDefault();nav('/');}}>Explorar</a>
          <a href="#/" onClick={(e)=>e.preventDefault()}>Categorías</a>
          <a href="#/" onClick={(e)=>e.preventDefault()}>Cocineros</a>
          <a href="#/" onClick={(e)=>e.preventDefault()}>Acerca de</a>
        </div>
        <div className="copy">© 2026 Recipe Nexus · Cocina colaborativa</div>
      </div>
    </footer>
  );
}

/* ---------- recipe card ---------- */
function avgRate(r) {
  return r.comments && r.comments.length
    ? r.comments.reduce((s,c)=>s+(c.rate||0),0) / r.comments.length
    : null;
}
function RecipeCard({ r, nav, getUser }) {
  const author = getUser(r.author);
  const avg = avgRate(r);
  return (
    <a className="r-card fade-in" href={"#/recetas/"+r.id} onClick={(e)=>{e.preventDefault();nav('/recetas/'+r.id);}}>
      <div className="img-wrap">
        <PhImg r={r}>
          <span className="badge">{r.diff}</span>
          <button className="fav" onClick={(e)=>{e.preventDefault();e.stopPropagation();}}>{Icon.heart({s:17})}</button>
        </PhImg>
      </div>
      <div className="cat-tag">{r.cat}</div>
      <h3>{r.title}</h3>
      <div className="meta"><span>{Icon.clock({s:14})} {r.time} min</span><span className="dot"></span><span>{r.diff}</span></div>
      <div className="foot">
        {avg != null
          ? <span className="rate"><Stars rate={avg} /> {avg.toFixed(1)}</span>
          : <span className="rate" style={{color:'var(--muted)',fontWeight:600}}><Star s={15} fill={false} /> Nuevo</span>}
        <span className="author">por {author? author.name.split(' ')[0] : '—'}</span>
      </div>
    </a>
  );
}

Object.assign(window, { Icon, Star, Stars, StarPicker, PhImg, Avatar, Navbar, Footer, RecipeCard, avgRate });
