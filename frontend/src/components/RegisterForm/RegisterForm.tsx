"use client";

import {
  Box,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";
import theme from "@/lib/theme";

const RegisterForm: React.FC = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [registratioError, setRegistratioError] = useState(false);
  const [signInError, setSignInError] = useState(false);
  const [badRequestError, setBadRequestError] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(undefined);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    React.useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const [confirmationPolicy, setConfirmationPolicy] = useState(false);
  const [confirmationAge, setConfirmationAge] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(true);

  const [secretToken, setSecretToken] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowPasswordConfirmation = () =>
    setShowPasswordConfirmation((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChangePassword = (event: any) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordError(newPassword.length < 8);
    setPasswordMatchError(newPassword !== passwordConfirmation);
  };

  const handleChangePasswordConfirmation = (event: any) => {
    const newPasswordConfirmation = event.target.value;
    setPasswordConfirmation(newPasswordConfirmation);
    setPasswordMatchError(newPasswordConfirmation !== password);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const resRegistration = await axios.post("/api/register", {
        name: fullname,
        email: email,
        password: secretToken ? null : password,
        token: secretToken,
      });

      if (resRegistration) {
        if (resRegistration.status !== 200) {
          if (resRegistration.status == 400) {
            clearTimeout(timerId);
            setBadRequestError(true);
            setTimerId(setTimeout(() => setBadRequestError(false), 2000));
          } else {
            clearTimeout(timerId);
            setRegistratioError(true);
            setTimerId(setTimeout(() => setRegistratioError(false), 2000));
          }
          return;
        }
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status == 400) {
        clearTimeout(timerId);
        setBadRequestError(true);
        setTimerId(setTimeout(() => setBadRequestError(false), 2000));
      } else {
        clearTimeout(timerId);
        setRegistratioError(true);
        setTimerId(setTimeout(() => setRegistratioError(false), 2000));
      }
      return;
    }

    const resSignIn = await signIn("credentials", {
      email: email,
      password: password,
      token: secretToken,
      redirect: false,
    });

    if (resSignIn) {
      if (resSignIn.status !== 200) {
        clearTimeout(timerId);
        setSignInError(true);
        setTimerId(setTimeout(() => setSignInError(false), 2000));
        return;
      }
    }

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    router.push(callbackUrl);
  };

  useEffect(() => {
    if (window !== undefined) {
      const token = searchParams.get("token");
      const emailParam = searchParams.get("email");
      const name = searchParams.get("name");

      setFullname(name || "");
      setEmail(emailParam || "");

      if (token && emailParam) {
        setShowPasswordForm(false);
        setSecretToken(token);
      }
    }
  }, [searchParams]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginTop: "50px",
          marginBottom: "0px",
          fontSize: "40px",
          color: theme.palette.primary.main,
        }}
      >
        Web Application
      </h1>
      <h2
        style={{
          marginTop: "50px",
          marginBottom: "0px",
        }}
      >
        Create an account
      </h2>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          margin: "0 auto",
        }}
        onSubmit={handleSubmit}
      >
        <Box
          component="div"
          sx={{
            margin: "0",
          }}
        ></Box>
        <TextField
          id="fullname"
          label="Full Name"
          variant="outlined"
          margin="normal"
          type="text"
          required
          value={fullname}
          onChange={(event) => setFullname(event.target.value)}
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ marginTop: "0px" }}
        />
        {showPasswordForm && (
          <>
            <FormControl
              variant="outlined"
              sx={{ marginBottom: "8px", height: "56px" }}
            >
              <InputLabel htmlFor="outlined-adornment-password" required>
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={handleChangePassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <FormControl
              variant="outlined"
              sx={{ marginBottom: "20px", height: "56px" }}
            >
              <InputLabel htmlFor="outlined-adornment-password" required>
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPasswordConfirmation ? "text" : "password"}
                value={passwordConfirmation}
                required
                onChange={handleChangePasswordConfirmation}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordConfirmation}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPasswordConfirmation ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />

              {passwordError && (
                <FormHelperText>
                  Password must be at least 8 characters long
                </FormHelperText>
              )}
              {!passwordError && passwordMatchError && (
                <FormHelperText>Passwords do not match</FormHelperText>
              )}
            </FormControl>
          </>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmationAge}
              onChange={(event) => setConfirmationAge(event.target.checked)}
              name="confirmationAge"
              color="primary"
              required
            />
          }
          label={
            <span
              style={{
                fontSize: "12px",
              }}
            >
              I confirm that I am at least 18 years old.
            </span>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmationPolicy}
              onChange={(event) => setConfirmationPolicy(event.target.checked)}
              name="confirmationPolicy"
              color="primary"
              required
            />
          }
          label={
            <span
              style={{
                fontSize: "12px",
              }}
            >
              I accept the{" "}
              <a
                href="https://brayandm.github.io/documents/multi-cv/privacy-policy"
                style={{ color: theme.palette.primary.main }}
              >
                Privacy Policy
              </a>
              .
            </span>
          }
        />
        <Button
          variant="contained"
          type="submit"
          sx={{ marginTop: "16px" }}
          disabled={
            passwordMatchError ||
            passwordError ||
            !fullname ||
            !email ||
            (showPasswordForm && !password) ||
            !confirmationPolicy ||
            !confirmationAge
          }
        >
          Register
        </Button>
        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ color: theme.palette.primary.main }}>
            Sign in here
          </a>
        </p>
        {registratioError && (
          <Alert severity="error">Registration failed</Alert>
        )}
        {signInError && <Alert severity="error">Sign in failed</Alert>}
        {badRequestError && <Alert severity="error">Bad request</Alert>}
      </Box>
    </div>
  );
};

export default RegisterForm;
