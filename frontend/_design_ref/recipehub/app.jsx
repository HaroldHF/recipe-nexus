/* RecipeHub — app: router + estado global */
const { useState: useStateA, useEffect: useEffectA } = React;

function parseHash() {
  let h = window.location.hash.replace(/^#/, '');
  if (!h || h === '/') return { name:'home' };
  const parts = h.split('/').filter(Boolean);
  if (parts[0] === 'recetas' && parts[1]) return { name:'detail', id:parts[1] };
  if (parts[0] === 'nueva') return { name:'new' };
  if (parts[0] === 'editar' && parts[1]) return { name:'edit', id:parts[1] };
  if (parts[0] === 'perfil') return { name:'profile' };
  if (parts[0] === 'login') return { name:'login' };
  if (parts[0] === 'register') return { name:'register' };
  return { name:'home' };
}

function App() {
  const { USERS, ME, RECIPES } = window.RH_DATA;
  const [route, setRoute] = useStateA(parseHash());
  const [user, setUser] = useStateA(null);
  const [search, setSearch] = useStateA("");
  const [toast, setToast] = useStateA(null);
  // seed: Elena (me) is author of two community recipes so her profile isn't empty
  const [recipes, setRecipes] = useStateA(() => RECIPES.map((r,i)=> (i===2||i===5)? {...r, author:'me'} : r));

  useEffectA(() => {
    const h = () => { setRoute(parseHash()); window.scrollTo(0,0); };
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const nav = (path) => {
    const target = '#' + path;
    if (window.location.hash === target) { setRoute(parseHash()); window.scrollTo(0,0); }
    else window.location.hash = path;
  };

  const getUser = (id) => id === 'me' ? (user || ME) : (USERS[id] || (id==='me'?ME:null)) || ME;
  const flash = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 2600); };

  const onLogin = () => { setUser(ME); nav('/'); flash('Sesión iniciada · ¡Hola Elena!'); };
  const onLogout = () => { setUser(null); nav('/'); flash('Sesión cerrada'); };

  const addComment = (rid, c) => {
    setRecipes(rs => rs.map(r => r.id===rid ? { ...r, comments:[{ user:'me', rate:c.rate, when:'ahora', tx:c.tx }, ...r.comments], ratings:(r.ratings||0)+1 } : r));
    flash('¡Gracias por tu valoración!');
  };

  const onSave = (rec, mode) => {    setRecipes(rs => {
      const exists = rs.some(r => r.id === rec.id);
      return exists ? rs.map(r => r.id===rec.id ? rec : r) : [rec, ...rs];
    });
    nav('/recetas/'+rec.id);
    flash(mode==='edit' ? 'Cambios guardados' : '¡Receta publicada!');
  };

  const onDelete = (rid) => {
    setRecipes(rs => rs.filter(r => r.id !== rid));
    nav('/');
    flash('Receta eliminada');
  };

  const findRecipe = (id) => recipes.find(r => r.id === id);

  let view;
  if (route.name === 'home') view = <HomeView recipes={recipes} nav={nav} getUser={getUser} search={search} />;
  else if (route.name === 'detail') view = <DetailView recipe={findRecipe(route.id)} nav={nav} getUser={getUser} user={user} addComment={addComment} onDelete={onDelete} />;
  else if (route.name === 'new') view = <RecipeForm initial={null} mode="new" user={user} nav={nav} onSave={onSave} />;
  else if (route.name === 'edit') view = <RecipeForm initial={findRecipe(route.id)} mode="edit" user={user} nav={nav} onSave={onSave} />;
  else if (route.name === 'profile') view = <ProfileView profile={user || ME} recipes={recipes} nav={nav} getUser={getUser} />;
  else if (route.name === 'login') view = <LoginView nav={nav} onLogin={onLogin} />;
  else if (route.name === 'register') view = <RegisterView nav={nav} onLogin={onLogin} />;

  const isAuth = route.name === 'login' || route.name === 'register';

  return (
    <React.Fragment>
      <Navbar route={route} user={user} nav={nav} onLogout={onLogout} search={search} setSearch={setSearch} />
      <main>{view}</main>
      {!isAuth && <Footer nav={nav} />}
      {toast && <div className="toast">{Icon.check({s:16})} {toast}</div>}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
