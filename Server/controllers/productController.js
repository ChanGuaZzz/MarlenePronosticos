import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";
import "../models/User.js";

const getproducts = async (req, res) => {
  const userId = req.session.user?._id;
  let products = [];
  console.log("ID DE USUARIO EN SESION", req.session.user?._id, userId);
  if (!userId) {
    products = await Product.find({ isGiftCard: false, isActive: true }).select("-forecastImageUrl");
  } else {
    const productsPurchased = await Purchase.find({ userId: userId }).select("productId -_id");
    const productIds = productsPurchased.map((purchase) => purchase.productId);

    console.log("PRODUCTOS COMPRADOS", productIds);
    products = await Product.find({ _id: { $nin: productIds }, isGiftCard: false, isActive: true }).select("-forecastImageUrl");

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
    products = await Product.find({ isGiftCard: true, isActive: true }).select("-giftCardCode");
  } else {
    const productsPurchased = await Purchase.find({ userId: userId }).select("productId -_id");
    const productIds = productsPurchased.map((purchase) => purchase.productId);

    console.log("PRODUCTOS COMPRADOS", productIds);
    products = await Product.find({ _id: { $nin: productIds }, isGiftCard: true, isActive: true }).select("-giftCardCode");

    console.log("PRODUCTOS OBTENIDOS", products);
  }
  if (!products) {
    return res.status(404).json({ message: "No products found" });
  }
  res.status(200).json(products);
};

const createProduct = async (req, res) => {
  const { title, description, price, matchDate, forecastImageUrl, accuracy, isGiftCard, giftCardCode } = req.body;
  const product = new Product({
    title,
    description,
    price,
    matchDate,
    forecastImageUrl,
    accuracy,
    isGiftCard,
    giftCardCode,
  });
  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("ERROR AL CREAR PRODUCTO", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

const desactivateProducts = async () => {
  try {
    await Product.updateMany({ isGiftCard: false }, { isActive: false });
  } catch (error) {
    console.error("ERROR AL DESACTIVAR PRODUCTOS", error);
  }
};

const toggleproduct = async (req, res) => {
  const { productId } = req.body;
  const role = req.session.user?.isAdmin;
  if (!role) {
    return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
  }
  if (!productId) {
    return res.status(400).json({ message: "ID de producto no proporcionado" });
  }
  try {
    const product = await Product.findById(productId);
    await Product.updateOne({ _id: productId }, { $set: { isActive: !product.isActive } });
    res.status(200).json({ message: "Producto cambiado el estado correctamente" });
  } catch (error) {
    console.error("ERROR AL cambiado el estado PRODUCTO", error);
    res.status(500).json({ error: "Error al cambiado el estado el producto" });
  }
};

const getallProducts = async (req, res) => {
  try {
    const products = await Product.find({ isGiftCard: false });
    
    console.log("PRODUCTOS NO TARJETAS OBTENIDAS", products);
    res.status(200).json(products);
  } catch (error) {
    console.error("ERROR AL OBTENER PRODUCTOS", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};
const getallGiftCards = async (req, res) => {
  try {
    const products = await Product.find({ isGiftCard: true });
    console.log("PRODUCTOS TARJETAS OBTENIDAS", products);
    res.status(200).json(products);
  } catch (error) {
    console.error("ERROR AL OBTENER TARJETAS DE REGALO", error);
    res.status(500).json({ error: "Error al obtener las tarjetas de regalo" });
  }
};

export { getproducts, createProduct, getGiftCards, desactivateProducts, toggleproduct, getallProducts, getallGiftCards };
