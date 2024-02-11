import React, { useState } from "react";
import "./signin.css";
import axios from "axios";
import { toast } from "sonner";
import HomePage from "./Home/Home";
import { useNavigate } from "react-router-dom";
const SignInPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isNewUser, setIsNewUser] = useState<boolean>(false); // To toggle between sign in and sign up
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // To track whether registration is successful
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://localhost:4000/auth/signin", {
        email,
        password,
      });

      // Extract the access token from the response
      const accessToken = response.data.token.access_token;

      // Save the access token to local storage or any other suitable storage mechanism
      localStorage.setItem("accessToken", accessToken);

      // Set the Authorization header for all subsequent requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      toast.success(response.data.message);
      setEmail("");
      setPassword("");
      navigate("/home");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:4000/auth/signup", {
        email,
        password,
      });
      toast.success(response.data.message);
      setIsRegistered(true); // Set registration status to true after successful registration
      setIsNewUser(false); // Set isNewUser to false to toggle to sign-in page
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className={`container ${isNewUser ? "signup" : "signin"}`}>
      <h2>{isNewUser ? "Sign Up" : "Sign In"}</h2>
      <form>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        {isNewUser ? (
          <button type="button" onClick={handleSignUp}>
            Sign Up
          </button>
        ) : (
          <button type="button" onClick={handleSignIn}>
            Sign In
          </button>
        )}
      </form>
      {isRegistered && !isNewUser && (
        <p>
          Registered successfully!{" "}
          <span onClick={() => setIsNewUser(true)}>Click here to Sign In</span>
        </p>
      )}
      {!isRegistered && (
        <p onClick={() => setIsNewUser(!isNewUser)}>
          {isNewUser
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </p>
      )}

      {/* {localStorage.getItem("accessToken") && <HomePage />} */}
    </div>
  );
};

export default SignInPage;
