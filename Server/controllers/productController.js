import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";
import "../models/User.js";

const getproducts = async (req, res) => {
  const userId = req.session.user?._id;
  let products = [];
  console.log("ID DE USUARIO EN SESION", req.session.user?._id, userId);
  if (!userId) {
    products = await Product.find({isGiftCard: false}).select("-forecastImageUrl");
  } else {
    const productsPurchased = await Purchase.find({ userId: userId }).select("productId -_id");
        const productIds = productsPurchased.map((purchase) => purchase.productId);
  
    console.log("PRODUCTOS COMPRADOS", productIds);
    products = await Product.find({ _id: { $nin: productIds }, isGiftCard: false }).select("-forecastImageUrl");

    console.log("PRODUCTOS OBTENIDOS", products);
}
  if (!products) {
    return res.status(404).json({ message: "No products found" });
  }
  res.status(200).json(products);
};

const getGiftCards = async (req, res) => {
  const userId = req.session.user?._id;
  let products = [];
  console.log("ID DE USUARIO EN SESION", req.session.user?._id, userId);
  if (!userId) {
    products = await Product.find({isGiftCard: true}).select("-giftCardCode");
  } else {
    const productsPurchased = await Purchase.find({ userId: userId }).select("productId -_id");
        const productIds = productsPurchased.map((purchase) => purchase.productId);
  
    console.log("PRODUCTOS COMPRADOS", productIds);
    products = await Product.find({ _id: { $nin: productIds }, isGiftCard: true }).select("-giftCardCode");


    console.log("PRODUCTOS OBTENIDOS", products);
}
  if (!products) {
    return res.status(404).json({ message: "No products found" });
  }
  res.status(200).json(products);
}


const createProduct = async (req, res) => {
  const { title, description, price, matchDate, forecastImageUrl, accuracy, isGiftCard } = req.body;
  const product = new Product({
    title,
    description,
    price,
    matchDate,
    forecastImageUrl,
    accuracy,
    isGiftCard
  });
  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("ERROR AL CREAR PRODUCTO", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

export { getproducts, createProduct, getGiftCards};
