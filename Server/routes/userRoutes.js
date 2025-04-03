import express from "express";
import { registerUser, loginUser, logoutUser, changeData } from "../controllers/userController.js";
import { getpurchases, purchase } from "../controllers/purchaseController.js";
import { createProduct, getGiftCards, getproducts } from "../controllers/productController.js";

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
router.post("/purchase",  purchase);
router.get("/getpurchases",  getpurchases);
router.get("/getproducts", getproducts)
router.get("/getgiftcards", getGiftCards)
router.post("/createProducts", createProduct)



export default router;
