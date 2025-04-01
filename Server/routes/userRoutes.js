import express from "express";
import { registerUser, loginUser, logoutUser, changeData } from "../controllers/userController.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.send("SERVER RUNNING");
});

router.get("/getsession", (req, res) => {
  console.log("OBTENIENDO SESSIONES",req.session);
  res.json(req.session);
});
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout",logoutUser);
router.post("/changeData",  changeData);



export default router;
