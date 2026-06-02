import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT ?? 3000;

async function main() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

main();
