import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";
import "../models/User.js";

const getproducts = async (req, res) => {
  const userId = req.session.user?._id;
  let products = [];
  console.log("ID DE USUARIO EN SESION", req.session.user?._id, userId);
  if (!userId) {
    products = await Product.find({});
  } else {
    const productsPurchased = await Purchase.find({ userId: userId }).select("productId -_id");
        const productIds = productsPurchased.map((purchase) => purchase.productId);
  
    console.log("PRODUCTOS COMPRADOS", productIds);
    products = await Product.find({ _id: { $nin: productIds } });

    console.log("PRODUCTOS OBTENIDOS", products);
}
  if (!products) {
    return res.status(404).json({ message: "No products found" });
  }
  res.status(200).json(products);
};

const createproduct = async (req, res) => {};

export { getproducts, createproduct };
