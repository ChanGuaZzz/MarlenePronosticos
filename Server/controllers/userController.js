import User from "../models/User.js";

const registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;
  if (!username || !password || !email || !phone) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }, { phone: phone }],
    });

    if (existingUser) {
      let message = "El usuario ya existe";
      if (existingUser.username === username) {
        message = "El nombre de usuario ya está en uso";
      } else if (existingUser.email === email) {
        message = "El correo electrónico ya está registrado";
      } else if (existingUser.phone === phone) {
        message = "El número de teléfono ya está registrado";
      }
      return res.status(400).json({ message });
    }

    const newUser = new User({
      username,
      email,
      phone,
      password,
    })
    await newUser.save();
    req.session.user = newUser; // Guardar el usuario en la sesión
    return res.status(201).json({ message: "Usuario registrado correctamente", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Error al comprobar el usuario" });
  }
};
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try{

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }
    req.session.user = user; // Guardar el usuario en la sesión
    console.log(req.session.user);
    return res.status(200).json({ message: "Inicio de sesión exitoso", user });
  }catch(error){
    return res.status(500).json({ message: "Error al comprobar el usuario" });
  }
};
const changeData = async (req, res) => {};
const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión" });
    }
    res.clearCookie("connect.sid"); // Limpiar la cookie de sesión
    res.json({ message: "Sesión cerrada correctamente" });
  });
};

export { registerUser, loginUser, logoutUser, changeData };
