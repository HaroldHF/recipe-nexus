/* RecipeHub — datos mock (window.RH_DATA) */
(function () {
  const USERS = {
    lucia:  { id:"lucia",  name:"Lucía Fernández", handle:"@luciacocina", bio:"Cocinera casera y fotógrafa de comida. Me obsesionan los desayunos lentos de domingo.", avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=70", recipes:24, followers:"1.8k" },
    marco:  { id:"marco",  name:"Marco Ruiz",      handle:"@marcoenlacocina", bio:"Italiano de corazón. Pasta fresca, salsas de la nonna y poco más.", avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=70", recipes:31, followers:"3.2k" },
    sara:   { id:"sara",   name:"Sara Navarro",    handle:"@saraverde", bio:"Recetas vegetales, frescas y rápidas para días con prisa.", avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=70", recipes:18, followers:"940" },
    diego:  { id:"diego",  name:"Diego Méndez",    handle:"@diegohornea", bio:"Repostería clásica sin atajos. La paciencia es el ingrediente secreto.", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=70", recipes:27, followers:"2.1k" },
    paula:  { id:"paula",  name:"Paula Vidal",     handle:"@paulaspice", bio:"Especias, legumbres y cocina del mundo en mi cocina diminuta.", avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=70", recipes:22, followers:"1.4k" },
    tomas:  { id:"tomas",  name:"Tomás Gil",       handle:"@tomasbrunch", bio:"Brunch todos los días si me dejan. Tortitas, gofres y café.", avatar:"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=70", recipes:15, followers:"760" },
  };

  // logged-in demo user
  const ME = { id:"me", name:"Elena Soto", handle:"@elenacocina", email:"elena@recipehub.com",
    bio:"Aprendiz entusiasta. Colecciono recetas de la abuela y experimentos de fin de semana.",
    avatar:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=70", recipes:3, followers:"312" };

  const mk = (o) => o;
  const RECIPES = [
    mk({ id:"tostada-aguacate", title:"Tostada de aguacate y huevo", cat:"Desayuno", time:15, diff:"Fácil", rate:4.8, ratings:124, servings:2, author:"lucia", tags:["vegetariano","brunch","huevo","rápido","saludable"],
      tone:["#cdd6ad","#9aa86a"], cap:"Tostada de aguacate", img:"https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&q=75",
      desc:"Un desayuno que parece de cafetería pero se hace en 15 minutos. Pan de masa madre crujiente, aguacate cremoso y un huevo poché que lo une todo.",
      ingredients:[ {n:"Pan de masa madre", q:"2", u:"rebanadas"}, {n:"Aguacate maduro", q:"1", u:"ud"}, {n:"Huevos", q:"2", u:"ud"}, {n:"Limón", q:"1/2", u:"ud"}, {n:"Copos de chile", q:"1", u:"pizca"}, {n:"Aceite de oliva", q:"1", u:"cda"}, {n:"Sal y pimienta", q:"", u:"al gusto"} ],
      steps:[ "Tuesta el pan hasta que esté dorado y crujiente.", "Machaca el aguacate con zumo de limón, sal y pimienta.", "Escalfa los huevos en agua con un chorrito de vinagre, 3 minutos.", "Extiende el aguacate sobre el pan, coloca el huevo encima.", "Termina con copos de chile, un hilo de aceite y sal en escamas." ],
      comments:[ {user:"marco", rate:5, when:"hace 2 días", tx:"El truco del limón en el aguacate marca la diferencia. Lo hago cada mañana."}, {user:"sara", rate:4, when:"hace 1 semana", tx:"Riquísimo y rápido. Yo le añado rúcula por encima."} ] }),
    mk({ id:"pasta-pesto", title:"Pasta al pesto genovés", cat:"Almuerzo", time:25, diff:"Media", rate:4.6, ratings:98, servings:4, author:"marco", tags:["italiano","pasta","albahaca","vegetariano"],
      tone:["#c8d2a0","#8a9c58"], cap:"Pasta al pesto", img:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=75",
      desc:"Pesto fresco hecho en mortero, como manda la tradición ligur. Albahaca, piñones y un buen aceite hacen toda la diferencia.",
      ingredients:[ {n:"Pasta (trofie o linguine)", q:"400", u:"g"}, {n:"Albahaca fresca", q:"60", u:"g"}, {n:"Piñones", q:"30", u:"g"}, {n:"Parmesano rallado", q:"50", u:"g"}, {n:"Ajo", q:"1", u:"diente"}, {n:"Aceite de oliva virgen", q:"100", u:"ml"}, {n:"Sal gruesa", q:"", u:"al gusto"} ],
      steps:[ "Maja la albahaca con el ajo y la sal gruesa en el mortero.", "Añade los piñones y machaca hasta formar pasta.", "Incorpora el parmesano y el aceite poco a poco.", "Cuece la pasta en abundante agua con sal, al dente.", "Mezcla la pasta con el pesto y un poco de agua de cocción." ],
      comments:[ {user:"diego", rate:5, when:"hace 3 días", tx:"Hacerlo en mortero cambia el sabor por completo. Vale la pena."} ] }),
    mk({ id:"ensalada-mediterranea", title:"Ensalada mediterránea", cat:"Almuerzo", time:10, diff:"Fácil", rate:4.5, ratings:76, servings:2, author:"sara", tags:["vegetariano","fresco","sin cocción","feta","saludable"],
      tone:["#cdd9b4","#92a866"], cap:"Ensalada fresca", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=75",
      desc:"Colorida, fresca y lista en 10 minutos. Garbanzos, verduras crujientes y un aliño de limón que despierta el plato.",
      ingredients:[ {n:"Garbanzos cocidos", q:"400", u:"g"}, {n:"Pepino", q:"1", u:"ud"}, {n:"Tomates cherry", q:"200", u:"g"}, {n:"Aceitunas kalamata", q:"80", u:"g"}, {n:"Queso feta", q:"100", u:"g"}, {n:"Cebolla roja", q:"1/2", u:"ud"}, {n:"Limón y aceite", q:"", u:"al gusto"} ],
      steps:[ "Trocea el pepino, los tomates y la cebolla roja.", "Mezcla con los garbanzos y las aceitunas en un bol grande.", "Desmenuza el feta por encima.", "Aliña con limón, aceite, sal y orégano. Sirve fría." ],
      comments:[ {user:"tomas", rate:5, when:"hace 5 días", tx:"Mi almuerzo de oficina favorito. Aguanta perfecta hasta el día siguiente."}, {user:"paula", rate:4, when:"hace 2 semanas", tx:"Le pongo menta fresca y queda espectacular."} ] }),
    mk({ id:"tarta-manzana", title:"Tarta de manzana clásica", cat:"Postre", time:60, diff:"Difícil", rate:4.9, ratings:152, servings:8, author:"diego", tags:["repostería","horno","clásico","dulce"],
      tone:["#e8c98a","#c69850"], cap:"Tarta de manzana", img:"https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=900&q=75",
      desc:"Masa quebrada mantecosa y manzanas caramelizadas en capas. Un clásico que merece hacerse con calma una tarde de domingo.",
      ingredients:[ {n:"Harina", q:"250", u:"g"}, {n:"Mantequilla fría", q:"125", u:"g"}, {n:"Azúcar", q:"100", u:"g"}, {n:"Manzanas", q:"5", u:"ud"}, {n:"Huevo", q:"1", u:"ud"}, {n:"Canela", q:"1", u:"cdta"}, {n:"Mermelada de albaricoque", q:"3", u:"cda"} ],
      steps:[ "Mezcla harina, mantequilla y azúcar hasta formar una masa. Refrigera 30 min.", "Estira la masa y forra un molde. Pincha la base con un tenedor.", "Pela y lamina las manzanas finamente.", "Coloca las láminas en espiral sobre la masa, espolvorea canela y azúcar.", "Hornea a 180°C durante 40 minutos.", "Pincela con mermelada templada para dar brillo. Deja enfriar." ],
      comments:[ {user:"lucia", rate:5, when:"hace 1 día", tx:"La hice para un cumpleaños y desapareció en minutos. Receta guardada para siempre."}, {user:"marco", rate:5, when:"hace 4 días", tx:"Difícil pero el resultado lo vale. La masa quedó perfecta."} ] }),
    mk({ id:"curry-garbanzos", title:"Curry de garbanzos y coco", cat:"Cena", time:35, diff:"Media", rate:4.7, ratings:110, servings:4, author:"paula", tags:["vegano","especiado","legumbres","picante","coco"],
      tone:["#e6b074","#c47c3c"], cap:"Curry de garbanzos", img:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&q=75",
      desc:"Reconfortante, especiado y vegano. Leche de coco, tomate y un buen curry para una cena entre semana sin complicaciones.",
      ingredients:[ {n:"Garbanzos cocidos", q:"800", u:"g"}, {n:"Leche de coco", q:"400", u:"ml"}, {n:"Tomate triturado", q:"400", u:"g"}, {n:"Cebolla", q:"1", u:"ud"}, {n:"Jengibre", q:"1", u:"trozo"}, {n:"Pasta de curry", q:"2", u:"cda"}, {n:"Espinacas", q:"100", u:"g"} ],
      steps:[ "Pocha la cebolla, el ajo y el jengibre picados.", "Añade la pasta de curry y cocina 1 minuto.", "Incorpora el tomate y la leche de coco. Lleva a hervor suave.", "Agrega los garbanzos y cocina 15 minutos a fuego medio.", "Añade las espinacas al final hasta que se ablanden. Sirve con arroz." ],
      comments:[ {user:"sara", rate:5, when:"hace 6 días", tx:"Cena de entre semana resuelta. Mejora al día siguiente."} ] }),
    mk({ id:"tortitas-arandanos", title:"Tortitas con arándanos", cat:"Desayuno", time:20, diff:"Fácil", rate:4.8, ratings:89, servings:3, author:"tomas", tags:["dulce","brunch","esponjoso","arándanos"],
      tone:["#edc585","#cf9a4d"], cap:"Tortitas", img:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&q=75",
      desc:"Esponjosas, doradas y llenas de arándanos que estallan al primer bocado. El brunch de fin de semana definitivo.",
      ingredients:[ {n:"Harina", q:"200", u:"g"}, {n:"Leche", q:"250", u:"ml"}, {n:"Huevos", q:"2", u:"ud"}, {n:"Arándanos", q:"150", u:"g"}, {n:"Levadura química", q:"1", u:"sobre"}, {n:"Azúcar", q:"2", u:"cda"}, {n:"Sirope de arce", q:"", u:"para servir"} ],
      steps:[ "Bate los huevos con la leche y el azúcar.", "Incorpora la harina y la levadura hasta una masa lisa.", "Añade los arándanos con cuidado.", "Cocina cucharones de masa en sartén caliente hasta ver burbujas.", "Da la vuelta y dora el otro lado. Sirve con sirope de arce." ],
      comments:[ {user:"diego", rate:5, when:"hace 2 días", tx:"Quedaron altísimas y esponjosas. Mis hijos pidieron repetir."}, {user:"lucia", rate:4, when:"hace 1 semana", tx:"Truco: dejar reposar la masa 10 min antes de cocinar."} ] }),
  ];

  window.RH_DATA = { USERS, ME, RECIPES };
})();
