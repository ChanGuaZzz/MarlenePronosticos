import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaEnvelope, FaShoppingCart, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaLock } from "react-icons/fa";
import Footer from "../components/Footer";
import { useAppContext } from "../contexts/AppContext";
import { MessageType, session } from "../models/interfaces";
import ModalToLock from "../components/ModalToLock";
import axios from "axios";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageType>({ text: "", type: "" });
  const [formData, setFormData] = useState<Partial<session>>({});
  const { session } = useAppContext(); // Assuming you have a context to get the session
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState<MessageType>({ text: "", type: "" });

  useEffect(() => {
    setProfile(session);
  }, [session]);

  const handleEdit = () => {
    if (profile) {
      setFormData({
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_URL_SERVER}/updateProfile`, { ...formData }, { withCredentials: true })
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        setLoading(false);
        if (profile && formData) {
          setProfile({
            ...profile,
            ...formData,
          });
        }
        setMessage({ text: "Perfil actualizado con éxito", type: "success" });
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setLoading(false);
        setMessage({ text: "Error al actualizar el perfil", type: "error" });
      })
      .finally(() => {
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      });
    // Update profile with form data

    setIsEditing(false);
    // Show success message or toast here
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<session>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPasswordChange = async (e:any) => {
    e.preventDefault();
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ text: "Las contraseñas nuevas no coinciden", type: "error" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ text: "La contraseña debe tener al menos 6 caracteres", type: "error" });
      return;
    }

    setLoading(true);

    axios
      .post(
        `${import.meta.env.VITE_URL_SERVER}/changePassword`,
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      )
      .then(() => {
        setPasswordMessage({ text: "Contraseña actualizada con éxito", type: "success" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Close password change form after success
      })
      .catch((error) => {
        console.log("Error changing password:", error.response.data.message);
        setPasswordMessage({ text: error.response.data.message, type: "error" });
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setPasswordMessage({ text: "", type: "" });
        }, 3000);
      });
  };

  useEffect(() => {
    if(passwordData.newPassword && passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordMessage({ text: "Las contraseñas no coinciden", type: "error" });
      }
      else {
        setPasswordMessage({ text: "", type: "" });
      }
    }
  }
  , [passwordData.newPassword, passwordData.confirmPassword]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <ModalToLock message="ver el historial de tus pronósticos comprados" />;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 min-h-screen">
        {message.text && (
          <div
            className={`p-4 mb-6 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <h1 className="text-3xl font-bold text-center mb-12">Mi Perfil</h1>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-[#f3fff7] rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-500">
                    <FaUser size={40} />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username || ""}
                      onChange={handleChange}
                      className="mt-4 text-xl font-semibold text-gray-800 text-center border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                    />
                  ) : (
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">{profile.username}</h2>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <FaEnvelope />
                    </div>
                    <div className="ml-4 flex-1">
                      <span className="text-xs text-gray-500">Correo electrónico</span>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          className="text-sm font-medium text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-800">{profile.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <FaPhone />
                    </div>
                    <div className="ml-4 flex-1">
                      <span className="text-xs text-gray-500">Teléfono</span>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleChange}
                          className="text-sm font-medium text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-800">{profile.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <FaShoppingCart />
                    </div>
                    <div className="ml-4">
                      <span className="text-xs text-gray-500">Compras totales</span>
                      <div className="text-sm font-medium text-gray-800">{profile.totalPurchases}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <FaCalendarAlt />
                    </div>
                    <div className="ml-4">
                      <span className="text-xs text-gray-500">Miembro desde</span>
                      <div className="text-sm font-medium text-gray-800">{profile.createdAt}</div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    {isEditing ? (
                      <div className="space-x-3 space-y-2">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center hover:bg-green-600 transition"
                          disabled={loading}
                        >
                          <FaSave className="mr-2" />
                          Guardar
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md flex items-center hover:bg-gray-400 transition"
                        >
                          <FaTimes className="mr-2" />
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600 transition"
                      >
                        <FaEdit className="mr-2" />
                        Editar Perfil
                      </button>
                    )}
                  </div>

                  <div className="pt-4 flex justify-center">
                    {showPasswordChange ? (
                      <form onSubmit={handleSubmitPasswordChange} className="space-y-4 w-full">
                        <div className="flex flex-col">
                          <label htmlFor="currentPassword" className="text-xs text-gray-500">
                            Contraseña actual
                          </label>
                          <input
                            required
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="text-sm font-medium text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="newPassword" className="text-xs text-gray-500">
                            Nueva contraseña
                          </label>
                          <input
                            required
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="text-sm font-medium text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="confirmPassword" className="text-xs text-gray-500">
                            Confirmar nueva contraseña
                          </label>
                          <input
                            required
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="text-sm font-medium text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                          />
                        </div>
                        {passwordMessage.text && (
                          <div
                            className={`p-2 rounded-md ${
                              passwordMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {passwordMessage.text}
                          </div>
                        )}
                        <div className="space-x-3">
                          <button
                           
                            className={`px-4 py-2 my-2 ${passwordMessage.text !== ""&& "opacity-50"}  bg-green-500 text-white rounded-md flex items-center hover:bg-green-600 transition`}
                            disabled={ passwordMessage.text !== ""}
                          >
                            <FaSave className="mr-2" />
                            Guardar
                          </button>
                          <button
                            onClick={() => setShowPasswordChange(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md flex items-center hover:bg-gray-400 transition"
                          >
                            <FaTimes className="mr-2" />
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setShowPasswordChange(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600 transition"
                      >
                        <FaLock className="mr-2" />
                        Cambiar Contraseña
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
