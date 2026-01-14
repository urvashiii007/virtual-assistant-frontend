import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "https://virtual-assistant-backend-uus6.onrender.com";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // 🔐 Get logged-in user
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        { withCredentials: true }
      );
      setUserData(result.data);
      console.log("Current User:", result.data);
    } catch (error) {
      // ✅ user not logged in = NORMAL case (no console noise)
      if (
        error.response?.status === 400 ||
        error.response?.status === 401
      ) {
        setUserData(null);
        return;
      }

      // ❌ only unexpected errors
      console.error(
        "Unexpected current user error:",
        error.response?.data || error.message
      );
      setUserData(null);
    }
  };

  // 🤖 Assistant
  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      // Gemini quota / server error → keep console clean
      console.error(
        "Gemini API error:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
