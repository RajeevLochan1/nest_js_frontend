import React, { useState } from "react";
import "./signin.css";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isNewUser, setIsNewUser] = useState<boolean>(false); // To toggle between sign in and sign up
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // To track whether registration is successful
  const [showPassword, setShowPassword] = useState<boolean>(true); // To toggle between showing and hiding the password field
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await axios.post("https://bookmark-backend-jk3y.onrender.com/auth/signin", {
        firstName,
        lastName,
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
      const userData: { [key: string]: string } = {
        email,
        password,
      };
      if (firstName) userData.firstName = firstName;
      if (lastName) userData.lastName = lastName;

      const response = await axios.post(
        "http://localhost:4000/auth/signup",
        userData
      );
      toast.success(response.data.message);
      setIsRegistered(true); // Set registration status to true after successful registration
      setIsNewUser(false); // Set isNewUser to false to toggle to sign-in page
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  // Function to toggle between showing and hiding the password field
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // TODO remove, this demo shouldn't need to reset the theme.
  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isNewUser ? "Sign Up" : "Sign In"}
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {isNewUser && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  autoComplete="off"
                  type="text"
                  value={showPassword ? password : "*".repeat(password.length)}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <Button style={{ width: 0 }} onClick={toggleShowPassword}>
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </Button>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={isNewUser ? handleSignUp : handleSignIn}
            >
              {isNewUser ? "Sign Up" : "Sign In"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Box onClick={() => setIsNewUser(!isNewUser)}>
                  {!isRegistered && (
                    <p onClick={() => {setIsNewUser(!isNewUser); setEmail(""); setPassword("");}}>
                      {isNewUser
                        ? "Already have an account? Sign in"
                        : "Don't have an account? Sign up"}
                    </p>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignInPage;
