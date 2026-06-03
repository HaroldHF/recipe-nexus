/* RecipeHub — vistas: Formulario (Nueva/Editar) + Login + Register */

function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,40) || ('receta-'+Date.now());
}

const UNITS = ["g","kg","ml","l","ud","cda","cdta","taza","diente","pizca","rebanada","al gusto"];

/* ============================ FORM (nueva/editar) ============================ */
function RecipeForm({ initial, mode, user, nav, onSave }) {
  if (!user) return (
    <div className="container" style={{padding:'70px 0'}}>
      <div className="form-card" style={{maxWidth:520,textAlign:'center'}}>
        <div style={{width:60,height:60,borderRadius:16,background:'var(--orange-soft)',color:'var(--orange-d)',display:'grid',placeItems:'center',margin:'0 auto 18px'}}>{Icon.book({s:26})}</div>
        <h2 className="fc-title" style={{textAlign:'center'}}>Inicia sesión para crear recetas</h2>
        <p className="fc-sub" style={{textAlign:'center',marginBottom:22}}>Necesitas una cuenta para publicar y compartir tus recetas con la comunidad.</p>
        <div style={{display:'flex',gap:10,justifyContent:'center'}}>
          <button className="btn btn-primary" onClick={()=>nav('/login')}>Iniciar sesión</button>
          <button className="btn btn-ghost" onClick={()=>nav('/register')}>Crear cuenta</button>
        </div>
      </div>
    </div>
  );

  const [title, setTitle] = useState(initial?.title || "");
  const [desc, setDesc] = useState(initial?.desc || "");
  const [cat, setCat] = useState(initial?.cat || "Almuerzo");
  const [diff, setDiff] = useState(initial?.diff || "Fácil");
  const [time, setTime] = useState(initial?.time || 30);
  const [servings, setServings] = useState(initial?.servings || 4);
  const [ings, setIngs] = useState(initial?.ingredients?.length ? initial.ingredients.map(i=>({...i})) : [{n:"",q:"",u:"g"}]);
  const [steps, setSteps] = useState(initial?.steps?.length ? [...initial.steps] : [""]);
  const [errs, setErrs] = useState({});
  const [saving, setSaving] = useState(false);
  const clr = (k) => { if (errs[k]) setErrs(p => ({ ...p, [k]: undefined })); };

  const setIng = (i, k, v) => setIngs(a => a.map((x,j)=> j===i? {...x,[k]:v} : x));
  const addIng = () => setIngs(a => [...a, {n:"",q:"",u:"g"}]);
  const delIng = (i) => setIngs(a => a.length>1 ? a.filter((_,j)=>j!==i) : a);
  const setStep = (i, v) => setSteps(a => a.map((x,j)=> j===i? v : x));
  const addStep = () => setSteps(a => [...a, ""]);
  const delStep = (i) => setSteps(a => a.length>1 ? a.filter((_,j)=>j!==i) : a);

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!title.trim()) er.title = 'El título es obligatorio.';
    if (!desc.trim()) er.desc = 'Añade una breve descripción del plato.';
    if (!ings.some(i => i.n.trim())) er.ings = 'Añade al menos un ingrediente con nombre.';
    if (!steps.some(s => s.trim())) er.steps = 'Añade al menos un paso de preparación.';
    setErrs(er);
    if (Object.keys(er).length) return;
    setSaving(true);
    setTimeout(() => {
      const validIngs = ings.filter(i => i.n.trim());
      const validSteps = steps.filter(s => s.trim());
      const rec = {
        ...(initial||{}),
        id: initial?.id || slugify(title),
        title: title.trim(), desc: desc.trim(), cat, diff, time: Number(time)||0, servings: Number(servings)||1,
        author: "me",
        ingredients: validIngs, steps: validSteps,
        tags: initial?.tags || [],
        tone: initial?.tone || ["#e6b074","#c47c3c"],
        cap: title.trim(),
        img: initial?.img || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=900&q=75",
        rate: initial?.rate ?? 0, ratings: initial?.ratings ?? 0, comments: initial?.comments || [],
      };
      onSave(rec, mode);
    }, 750);
  };

  return (
    <div className="container form-page fade-in">
      <div className="head">
        <div className="eyebrow">{mode==='edit'?'Editar receta':'Nueva receta'}</div>
        <h1>{mode==='edit'? title || 'Editar receta' : 'Comparte una receta'}</h1>
        <p>{mode==='edit'?'Actualiza los detalles de tu receta.':'Cuéntale a la comunidad cómo preparar uno de tus platos.'}</p>
      </div>

      <form onSubmit={submit}>
        <div className="form-card">
          <h3 className="fc-title">Lo básico</h3>
          <p className="fc-sub">El nombre y una breve descripción que abra el apetito.</p>
          <div className="field">
            <label className="label">Título de la receta</label>
            <input className={"input"+(errs.title?' err':'')} value={title} onChange={e=>{setTitle(e.target.value);clr('title');}} placeholder="Ej. Risotto de setas y parmesano" />
            {errs.title && <div className="field-err">{errs.title}</div>}
          </div>
          <div className="field">
            <label className="label">Descripción</label>
            <textarea className={"textarea"+(errs.desc?' err':'')} value={desc} onChange={e=>{setDesc(e.target.value);clr('desc');}} placeholder="Una o dos frases que describan el plato…" />
            {errs.desc && <div className="field-err">{errs.desc}</div>}
          </div>
          <div className="row row-3">
            <div className="field" style={{margin:0}}>
              <label className="label">Categoría</label>
              <select className="select" value={cat} onChange={e=>setCat(e.target.value)}>
                {["Desayuno","Almuerzo","Cena","Postre"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="label">Dificultad</label>
              <select className="select" value={diff} onChange={e=>setDiff(e.target.value)}>
                {["Fácil","Media","Difícil"].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="label">Tiempo <span className="opt">(min)</span></label>
              <input className="input" type="number" min="1" value={time} onChange={e=>setTime(e.target.value)} />
            </div>
          </div>
          <div className="field" style={{marginTop:16,maxWidth:200}}>
            <label className="label">Porciones</label>
            <input className="input" type="number" min="1" value={servings} onChange={e=>setServings(e.target.value)} />
          </div>
          <div className="field" style={{margin:'4px 0 0'}}>
            <label className="label">Foto del plato</label>
            <div className="img-drop">
              {Icon.plus({s:22})}
              <div>Arrastra una imagen o haz clic para subir</div>
              <div className="ph-mono" style={{fontFamily:'monospace'}}>JPG / PNG · usaremos un marcador si la omites</div>
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3 className="fc-title">Ingredientes</h3>
          <p className="fc-sub">Añade tantos como necesites. Cantidad y unidad son opcionales.</p>
          {ings.map((ing, i) => (
            <div className="ing-row" key={i}>
              <input className={"input"+(errs.ings && !ing.n.trim()?' err':'')} value={ing.n} onChange={e=>{setIng(i,'n',e.target.value);clr('ings');}} placeholder={`Ingrediente ${i+1}`} />
              <input className="input" value={ing.q} onChange={e=>setIng(i,'q',e.target.value)} placeholder="Cant." />
              <select className="select" value={ing.u} onChange={e=>setIng(i,'u',e.target.value)}>
                {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
              </select>
              <button type="button" className="row-del" onClick={()=>delIng(i)} title="Quitar">{Icon.trash({s:16})}</button>
            </div>
          ))}
          {errs.ings && <div className="field-err">{errs.ings}</div>}
          <button type="button" className="add-row" onClick={addIng}>{Icon.plus({s:16})} Añadir ingrediente</button>
        </div>

        <div className="form-card">
          <h3 className="fc-title">Pasos</h3>
          <p className="fc-sub">Describe la preparación paso a paso, en orden.</p>
          {steps.map((s, i) => (
            <div className="step-row" key={i}>
              <span className="num">{i+1}</span>
              <textarea className={"textarea"+(errs.steps && !s.trim()?' err':'')} value={s} onChange={e=>{setStep(i,e.target.value);clr('steps');}} placeholder={`Describe el paso ${i+1}…`} />
              <button type="button" className="row-del" onClick={()=>delStep(i)} title="Quitar" style={{height:42}}>{Icon.trash({s:16})}</button>
            </div>
          ))}
          {errs.steps && <div className="field-err">{errs.steps}</div>}
          <button type="button" className="add-row" onClick={addStep}>{Icon.plus({s:16})} Añadir paso</button>
        </div>

        {Object.keys(errs).filter(k=>errs[k]).length>0 && <div style={{maxWidth:760,margin:'16px auto 0',color:'var(--berry)',fontSize:14,fontWeight:600,textAlign:'right'}}>Revisa los campos marcados en rojo.</div>}

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={()=>nav(initial? '/recetas/'+initial.id : '/')} disabled={saving}>Cancelar</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{opacity:saving?.85:1}}>
            {saving
              ? <span style={{display:'inline-flex',alignItems:'center',gap:9}}><span className="spinner"></span> Guardando…</span>
              : (mode==='edit'?'Guardar cambios':'Publicar receta')}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================ AUTH ============================ */
function AuthAside({ quote, who }) {
  return (
    <div className="auth-aside">
      <div className="blob" style={{width:240,height:240,right:-60,top:-50}}></div>
      <div className="blob" style={{width:160,height:160,left:-40,bottom:80,background:'rgba(255,255,255,.08)'}}></div>
      <a className="brand" href="#/">Recipe <span>Nexus</span></a>
      <div style={{position:'relative',zIndex:1}}>
        <div className="quote">“{quote}”</div>
        <div className="who">{who}</div>
      </div>
      <div style={{fontSize:13,opacity:.85,position:'relative',zIndex:1}}>Recipe Nexus · 248 recetas y subiendo</div>
    </div>
  );
}

function LoginView({ nav, onLogin }) {
  const [email, setEmail] = useState("elena@recipehub.com");
  const [pass, setPass] = useState("");
  const submit = (e) => { e.preventDefault(); onLogin(); };
  return (
    <div className="auth">
      <AuthAside quote="Las mejores recetas son las que se comparten." who="— La comunidad de RecipeHub" />
      <div className="auth-main">
        <form className="auth-card fade-in" onSubmit={submit}>
          <h1>Bienvenida de nuevo</h1>
          <p className="sub">Entra para guardar, valorar y publicar recetas.</p>
          <div className="field">
            <label className="label">Correo electrónico</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" />
          </div>
          <div className="field">
            <label className="label">Contraseña</label>
            <input className="input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit">Iniciar sesión</button>
          <div className="demo-note">Demo: pulsa “Iniciar sesión” con cualquier dato para entrar como <b>Elena Soto</b> y ver el estado autenticado.</div>          <div className="auth-foot">¿No tienes cuenta? <a href="#/register" onClick={(e)=>{e.preventDefault();nav('/register');}}>Crear cuenta</a></div>
        </form>
      </div>
    </div>
  );
}

function RegisterView({ nav, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const submit = (e) => { e.preventDefault(); onLogin(); };
  return (
    <div className="auth">
      <AuthAside quote="Tu recetario, abierto al mundo." who="— Únete a 1.200 cocineros" />
      <div className="auth-main">
        <form className="auth-card fade-in" onSubmit={submit}>
          <h1>Crea tu cuenta</h1>
          <p className="sub">Empieza a publicar y guardar recetas en minutos.</p>
          <div className="field">
            <label className="label">Nombre</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" />
          </div>
          <div className="field">
            <label className="label">Correo electrónico</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" />
          </div>
          <div className="field">
            <label className="label">Contraseña</label>
            <input className="input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Mínimo 8 caracteres" />
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit">Crear cuenta</button>
          <div className="demo-note">Demo: pulsa “Crear cuenta” con cualquier dato para entrar como usuario autenticado.</div>
          <div className="auth-foot">¿Ya tienes cuenta? <a href="#/login" onClick={(e)=>{e.preventDefault();nav('/login');}}>Iniciar sesión</a></div>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { RecipeForm, LoginView, RegisterView, slugify });
