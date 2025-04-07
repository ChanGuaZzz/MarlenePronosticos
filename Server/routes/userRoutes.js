import express from "express";
import { registerUser, loginUser, logoutUser, updateProfile } from "../controllers/userController.js";
import { getpurchases, purchase, getAllPurchases } from "../controllers/purchaseController.js";
import {
  toggleproduct,
  createProduct,
  getallGiftCards,
  getallProducts,
  getGiftCards,
  getproducts,
  deleteProduct,
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
router.post("/updateProfile", updateProfile);
router.post("/purchase", purchase);
router.get("/getpurchases", getpurchases);
router.get("/getproducts", getproducts);
router.get("/getgiftcards", getGiftCards);
router.get("/getallproducts", getallProducts);
router.get("/getallgiftcards", getallGiftCards);
router.post("/createproduct", createProduct);
router.post("/toggleproduct", toggleproduct);
router.post("/deleteproduct", deleteProduct);
router.get("/getallpurchases", getAllPurchases);

export default router;
