import express from "express";
import { registerUser, loginUser, logoutUser, changeData } from "../controllers/userController.js";
import { getpurchases, purchase } from "../controllers/purchaseController.js";
import {
  toggleproduct,
  createProduct,
  getallGiftCards,
  getallProducts,
  getGiftCards,
  getproducts,
} from "../controllers/productController.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.send("SERVER RUNNING");
});

router.get("/getsession", (req, res) => {
  console.log("OBTENIENDO SESSIONES", req.session);
  res.json(req.session);
});
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/changeData", changeData);
router.post("/purchase", purchase);
router.get("/getpurchases", getpurchases);
router.get("/getproducts", getproducts);
router.get("/getgiftcards", getGiftCards);
router.get("/getallproducts", getallProducts);
router.get("/getallgiftcards", getallGiftCards);
router.post("/createproduct", createProduct);
router.post("/toggleproduct", toggleproduct);

export default router;
