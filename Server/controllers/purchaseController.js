import Purchase from "../models/Purchase.js";
import "../models/Product.js";

const purchase = async (req, res) => {
    const data = req.body;
    // req body 
    // userId: 
    // productId: 
    // orderId:
    // status:
    // purchaseDate: 
    // value:
    //payerFullName= {given_name: 'Geyson Steven', surname: 'Gualdron  Arjona'}
    console.log("DATOS DE COMPRA", data);
    const FullName = data.payerFullName.given_name + " " + data.payerFullName.surname;
    const purchase = new Purchase({
        userId: data.userId,
        productId: data.productId,
        orderId: data.orderId,
        status: data.status,
        purchaseDate: data.purchaseDate,
        value: data.value,
        payerFullName: FullName,
    });
    try {
        const savedPurchase = await purchase.save();
        console.log("COMPRA GUARDADA", savedPurchase);
        res.status(200).json(savedPurchase);
    } catch (error) {
        console.error("ERROR AL GUARDAR COMPRA", error);
        res.status(500).json({ error: "Error al guardar la compra" });
    }

};

// ...existing code...
const getpurchases = async (req, res) => {
    const userId = req.session.user?._id; // Obtener el ID del usuario de la sesión

    console.log("ID DE USUARIO EN SESION", req.session.user?._id, userId);
    if (!userId) {
        return res.status(401).json({ message: "No estás autenticado" });
    }

    console.log("ID DE USUARIO", userId);
    try {
        const purchases = await Purchase.find({ userId: userId }).populate("productId").exec();
        console.log("COMPRAS OBTENIDAS", purchases);
        
        // Transform _id to id in each purchase
        const transformedPurchases = purchases.map(purchase => {
            const purchaseObj = purchase.toObject();
            purchaseObj.id = purchaseObj._id;
            delete purchaseObj._id;
            return purchaseObj;
        });
        
        res.status(200).json(transformedPurchases);
    } catch (error) {
        console.error("ERROR AL OBTENER COMPRAS", error);
        res.status(500).json({ error: "Error al obtener las compras" });
    }
};

const getAllPurchases = async (req, res) => {
    console.log("OBTENIENDO COMPRAS DE ADMIN");
    const role = req.session.user?.isAdmin; // Obtener el ID del usuario de la sesión
    if (!role) {
        return res.status(401).json({ message: "No estás autenticado" });
    }
    console.log("ID DE USUARIO", role);

    try {
        const purchases = await Purchase.find({})
            .sort({ purchaseDate: -1 }) // Ordenar por fecha descendente (más reciente primero)
            .populate("userId")
            .populate("productId")
            .exec();
            
        console.log("COMPRAS OBTENIDAS", purchases);
        res.status(200).json(purchases);
    } catch (error) {
        console.error("ERROR AL OBTENER COMPRAS", error);
        res.status(500).json({ error: "Error al obtener las compras" });
    }
};

export { purchase, getpurchases, getAllPurchases };
