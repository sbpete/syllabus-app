import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import axios from "axios";

function LoginButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is already signed in
    const user = window.sessionStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const handleSuccess = async (credentialResponse) => {
    // Send the credential to your backend
    try {
      const response = await axios.post(
        "https://backend-sdpy.onrender.com/api/auth/google",
        { credential: credentialResponse.credential },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // Extract the user data from the response
      const user = response.data.user;

      // Store the user data in google context
      console.log("Login successful", user);

      // write to session storage
      window.sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Google client id */}
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      {user ? (
        <div className="flex flex-row items-center gap-2">
          <p>Signed In</p>
          <IoCheckmarkCircle className="text-green-500 text-2xl mb-1" />
        </div>
      ) : (
        <p className="text-red-500">Not Signed In</p>
      )}
    </div>
  );
}

export default LoginButton;
