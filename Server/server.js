import dotenv from "dotenv";
import { server } from "./app.js";
import connectDB from "./config/db.js";
import { createAdminUser } from "./controllers/userController.js";
import { desactivateProducts } from "./controllers/productController.js";
import schedule from "node-schedule";
// import "./routes/socketRoutes.js"
// import "./config/mailer.js"
dotenv.config();

connectDB();
createAdminUser();
desactivateProducts();

const madridRule = new schedule.RecurrenceRule();
madridRule.hour = 0;
madridRule.minute = 0;
madridRule.tz = 'Europe/Madrid';

schedule.scheduleJob(madridRule, function() {
  console.log('Ejecutando desactivateProducts a las 00:00 hora de España');
  desactivateProducts();
});

server.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000"));
