import React, { useState, useEffect } from "react";
import axios from "axios";
import Bookmarks from "../Bookmark/Bookmarks";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

interface User {
  id: number;
  email: string;
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          // Handle the case where access token is not available
          navigate("/");
          return;
        }

        const response = await axios.get<User>(
          "http://localhost:4000/users/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear the access token from local storage
    localStorage.removeItem("accessToken");
    // Set the user state to null
    setUser(null);
    // Redirect to the login page
    navigate("/");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        {/* <h2 style={{color:"white"}}>Welcome to the Dashboard</h2> */}
        <div className="dashboard-content">
          {user && (
            <div>
              <h3>Welcome: {user.email}</h3>
              {/* <p>Email: {user.email}</p> */}
            </div>
          )}
        </div>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Bookmarks />
    </div>
  );
};

export default HomePage;
