/* RecipeHub — vistas: Inicio, Detalle, Perfil */
const CATS = ["Todas","Desayuno","Almuerzo","Cena","Postre"];
const DIFFS = ["Todas","Fácil","Media","Difícil"];

/* ============================ INICIO ============================ */
function HomeView({ recipes, nav, getUser, search }) {
  const [cat, setCat] = useState("Todas");
  const [diff, setDiff] = useState("Todas");

  const filtered = recipes.filter(r => {
    const okCat = cat === "Todas" || r.cat === cat;
    const okDiff = diff === "Todas" || r.diff === diff;
    const q = search.toLowerCase();
    const okSearch = !search || r.title.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.n.toLowerCase().includes(q)) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(q)));
    return okCat && okDiff && okSearch;
  });

  return (
    <div className="container home-wrap">
      <section className="banner fade-in">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div style={{position:'relative',zIndex:1}}>
          <div className="eyebrow">El recetario de Recipe Nexus</div>
          <h1>Cocina algo memorable esta noche.</h1>
          <p>En Recipe Nexus encuentras recetas caseras compartidas y puntuadas por personas que cocinan de verdad. Descubre tu próxima favorita.</p>
          <span className="pill"><Star s={15} fill={true} /> Más de 1.200 cocineros activos</span>
        </div>
      </section>

      <div className="filters">
        {CATS.map(c => (
          <button key={c} className={"cat " + (cat===c?'on':'')} onClick={()=>setCat(c)}>{c}</button>
        ))}
        <span className="fsep"></span>
        <select className="diff-sel" value={diff} onChange={e=>setDiff(e.target.value)}>
          {DIFFS.map(d => <option key={d} value={d}>{d==='Todas'?'Cualquier dificultad':d}</option>)}
        </select>
        <span className="results-info">{filtered.length} receta{filtered.length!==1?'s':''}{search?` para “${search}”`:''}</span>
      </div>

      {filtered.length ? (
        <div className="grid3">
          {filtered.map(r => <RecipeCard key={r.id} r={r} nav={nav} getUser={getUser} />)}
        </div>
      ) : (
        <div className="empty">
          <div className="serif">Sin resultados</div>
          <p>Prueba con otra categoría, dificultad o término de búsqueda.</p>
        </div>
      )}
    </div>
  );
}

/* ============================ DETALLE ============================ */
function DetailView({ recipe, nav, getUser, user, addComment, onDelete }) {
  const [checked, setChecked] = useState(() => recipe ? recipe.ingredients.map(()=>false) : []);
  const [rate, setRate] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => { setChecked(recipe ? recipe.ingredients.map(()=>false) : []); setRate(0); setText(""); }, [recipe && recipe.id]);

  if (!recipe) return (
    <div className="container" style={{padding:'80px 0',textAlign:'center'}}>
      <div className="empty"><div className="serif">Receta no encontrada</div><p>Puede que se haya movido.</p>
      <button className="btn btn-primary" style={{marginTop:10}} onClick={()=>nav('/')}>Volver al inicio</button></div>
    </div>
  );

  const author = getUser(recipe.author);
  const submit = (e) => { e.preventDefault(); if (!rate || !text.trim()) return; addComment(recipe.id, { rate, tx: text.trim() }); setRate(0); setText(""); };

  return (
    <div className="container detail fade-in">
      <div className="crumb">
        <a href="#/" onClick={(e)=>{e.preventDefault();nav('/');}} style={{display:'inline-flex',alignItems:'center',gap:6}}>{Icon.back({s:15})} Inicio</a>
        <span>/</span><span style={{color:'var(--ink-soft)'}}>{recipe.cat}</span>
      </div>

      <div className="d-hero"><PhImg r={recipe} /></div>

      <div className="d-head">
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
          <div>
            <div className="d-eyebrow">{recipe.cat}</div>
            <h1 className="d-title">{recipe.title}</h1>
          </div>
          {user && recipe.author === 'me' && (
            <div style={{display:'flex',gap:10,flexShrink:0,marginTop:8}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>nav('/editar/'+recipe.id)}>{Icon.edit({s:15})} Editar</button>
              <button className="btn btn-danger btn-sm" onClick={()=>onDelete && onDelete(recipe.id)}>{Icon.trash({s:15})} Eliminar</button>
            </div>
          )}
        </div>
        <p className="d-lede">{recipe.desc}</p>
      </div>

      <div className="d-stats">
        <div className="d-stat"><span className="ic">{Icon.clock({s:18})}</span><span><span className="k">Tiempo</span><div className="v">{recipe.time} min</div></span></div>
        <div className="d-stat"><span className="ic">{Icon.flame({s:18})}</span><span><span className="k">Dificultad</span><div className="v">{recipe.diff}</div></span></div>
        <div className="d-stat"><span className="ic">{Icon.users({s:18})}</span><span><span className="k">Porciones</span><div className="v">{recipe.servings}</div></span></div>
        <div className="d-stat"><span className="ic"><Star s={18} fill={true} /></span><span><span className="k">Valoración</span><div className="v">{recipe.rate.toFixed(1)} <span style={{color:'var(--muted)',fontWeight:600,fontSize:13}}>({recipe.ratings})</span></div></span></div>
      </div>

      <div className="d-grid">
        <aside className="ing-card">
          <h3>Ingredientes</h3>
          <div className="sub">Para {recipe.servings} porciones</div>
          <ul className="ing-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className={checked[i]?'done':''}>
                <span className={"ing-check " + (checked[i]?'on':'')} onClick={()=>setChecked(c=>c.map((v,j)=>j===i?!v:v))}>{checked[i] && Icon.check({s:13})}</span>
                <span className="nm" style={{flex:1}}><span className="qty">{ing.q} {ing.u}</span> {ing.n}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main>
          <h2 className="section-h">Preparación</h2>
          <ol className="steps">
            {recipe.steps.map((s, i) => (
              <li key={i}><span className="step-n">{i+1}</span><span className="step-tx">{s}</span></li>
            ))}
          </ol>

          {author && (
            <div className="author-card">
              <Avatar user={author} size={54} />
              <div className="meta"><div className="nm">{author.name}</div><div className="bio">{author.bio}</div></div>
              <button className="btn btn-ghost btn-sm" onClick={()=>nav('/perfil')}>Ver perfil</button>
            </div>
          )}

          <h2 className="section-h">Comentarios · {recipe.comments.length}</h2>
          <div className="comments">
            {user ? (
              <form className="c-form" onSubmit={submit}>
                <div className="ttl">Deja tu valoración</div>
                <div className="rate-lbl">¿Qué te pareció esta receta?</div>
                <StarPicker value={rate} onChange={setRate} />
                <textarea className="textarea" style={{marginTop:14}} placeholder="Cuenta cómo te quedó, tus trucos o variaciones…" value={text} onChange={e=>setText(e.target.value)} />
                <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
                  <button className="btn btn-primary" type="submit" disabled={!rate||!text.trim()} style={{opacity:(!rate||!text.trim())?.5:1}}>Publicar comentario</button>
                </div>
              </form>
            ) : (
              <div className="c-login-prompt">
                <p>Inicia sesión para valorar y comentar esta receta.</p>
                <button className="btn btn-primary" onClick={()=>nav('/login')}>Iniciar sesión</button>
              </div>
            )}

            {recipe.comments.map((c, i) => {
              const cu = getUser(c.user);
              return (
                <div className="c-item" key={i}>
                  <Avatar user={cu} size={44} />
                  <div className="body">
                    <div className="top">
                      <span className="nm">{cu ? cu.name : c.user}</span>
                      <Stars rate={c.rate} />
                      <span className="when">· {c.when}</span>
                    </div>
                    <div className="tx">{c.tx}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ============================ PERFIL ============================ */
function ProfileView({ profile, recipes, nav, getUser }) {
  const [tab, setTab] = useState("recetas");
  const mine = recipes.filter(r => r.author === profile.id);
  return (
    <div className="profile fade-in">
      <div className="p-cover">
        <div className="blob" style={{width:200,height:200,right:60,top:-60}}></div>
        <div className="blob" style={{width:130,height:130,right:280,bottom:-70}}></div>
      </div>
      <div className="container">
        <div className="p-head">
          <span className="p-avatar"><Avatar user={profile} size={114} /></span>
          <div className="p-info">
            <div className="nm">{profile.name}</div>
            <div className="handle">{profile.handle}</div>
          </div>
          <button className="btn btn-ghost" onClick={()=>nav('/nueva')}>{Icon.plus({s:16})} Nueva receta</button>
          <button className="btn btn-ghost btn-icon" title="Editar perfil">{Icon.edit({s:17})}</button>
        </div>
        <p className="p-bio">{profile.bio}</p>
        <div className="p-stats">
          <div className="p-stat"><div className="v">{mine.length}</div><div className="k">Recetas</div></div>
          <div className="p-stat"><div className="v">{profile.followers}</div><div className="k">Seguidores</div></div>
          <div className="p-stat"><div className="v">4.8</div><div className="k">Valoración media</div></div>
        </div>

        <div className="p-tabs">
          <button className={"p-tab "+(tab==='recetas'?'on':'')} onClick={()=>setTab('recetas')}>Recetas publicadas</button>
          <button className={"p-tab "+(tab==='guardadas'?'on':'')} onClick={()=>setTab('guardadas')}>Guardadas</button>
        </div>

        {tab==='recetas' ? (
          mine.length ? (
            <div className="grid3" style={{paddingBottom:50}}>
              {mine.map(r => <RecipeCard key={r.id} r={r} nav={nav} getUser={getUser} />)}
            </div>
          ) : (
            <div className="empty"><div className="serif">Aún no has publicado recetas</div><p>Comparte tu primera receta con la comunidad.</p>
            <button className="btn btn-primary" style={{marginTop:10}} onClick={()=>nav('/nueva')}>Crear receta</button></div>
          )
        ) : (
          <div className="empty" style={{paddingBottom:60}}><div className="serif">Nada guardado todavía</div><p>Pulsa el corazón en cualquier receta para guardarla aquí.</p></div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { HomeView, DetailView, ProfileView, CATS, DIFFS });
