import dotenv from "dotenv";
import { server } from "./app.js";
import connectDB from "./config/db.js";
// import "./routes/socketRoutes.js"
// import "./config/mailer.js"
dotenv.config();

  connectDB();
  server.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000"));
