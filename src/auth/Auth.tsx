import * as userActions from "../redux/actions/user/userActions";

import { Box, Button, TextInput, createStyles } from "@mantine/core";
import { auth, provider } from "../firabase/sdk";
import { getStore, setStore } from "../services/storageService";
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import GoogleIcon from "../assets/images/google_icon.png";
import { RootState } from "../redux/store/store";
import { showNotification } from "@mantine/notifications";
import { signInWithPopup } from "firebase/auth";

const useStyles = createStyles(() => ({
  wrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "265px",
    height: "auto",
  },
  header: {
    width: "265px",
    textAlign: "center",
  },
  accQuestion: {
    "&:hover": {
      color: "red",
      cursor: "pointer",
    },
  },
  btnsContainer: {
    width: "265px",
  },
  btn: {
    width: "87px",
  },
  input: {
    marginBottom: "10px",
  },
  roleContainer: {
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  changeRoleBtn: {
    width: "110px",
  },
  role: {
    color: "#7950f2",
    fontWeight: "bold",
  },
  errorMsg: {
    color: "#ff0000",
  },
  forgottenPasswordGroup: {
    marginTop: "1rem",
  },
  forgottenPasswordContainer: {
    width: "265px",
  },
  forgottenPasswordInput: {
    width: "150px",
  },
  emailInput: {
    width: "100%",
  },
  emailSubmit: {
    width: "100%",
    marginTop: "1rem",
  },
  googleSignInBtn: {
    marginTop: "2rem",
    width: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: "26px",
    height: "26px",
    marginRight: "10px"
  },
}));

export default function Auth() {
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [email, setEmail] = useState("");
  const user = useSelector((state: RootState) => state.user);

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setEmail("");
        window.localStorage.removeItem("emailForSignIn");
        dispatch(userActions.userLoggedIn(user));
        showNotification({
          message: "Successfully logged in",
          autoClose: 5000,
          color: "green",
        });
      })
      .catch((error) => console.log(error));
  };

  const sendEmailLink = async () => {
    const actionCodeSettings = {
      url: "https://wkr92.github.io/war-up/",
      // url: "http://localhost:5173/",
      handleCodeInApp: true,
    };

    if (email !== "")
      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          setStore("emailForSignIn", email);
          showNotification({
            message: "Check your inbox for link to log in",
            autoClose: 5000,
            color: "green",
          });
        })
        .catch((error) => console.log(error));
  };

  const checkIfSignedInWithEmailLink = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = getStore("emailForSignIn") || "";
      console.log("email", email);
      if (!email) {
        email =
          window.prompt("Please provide your email for confirmation") || "";
      }
      await signInWithEmailLink(auth, email, window.location.href)
        .then((userCredentails) => {
          const user = userCredentails.user;
          setEmail("");
          window.localStorage.removeItem("emailForSignIn");
          dispatch(userActions.userLoggedIn(user));
          showNotification({
            message: "Successfully logged in",
            autoClose: 5000,
            color: "green",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    checkIfSignedInWithEmailLink();
  }, [user]);

  return (
    <Box className={classes.wrapper}>
      <Box sx={{ maxWidth: 300, height: 420 }} mx="auto">
        <h2 className={classes.header}>War-up!</h2>
        <TextInput
          className={classes.emailInput}
          label="Email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          className={classes.emailSubmit}
          onClick={async () => await sendEmailLink()}
        >
          Send me log in link
        </Button>
        <Button
          className={classes.googleSignInBtn}
          onClick={handleGoogleSignIn}
        >
          {" "}
          <img
            className={classes.googleIcon}
            src={GoogleIcon}
            alt="google icon"
          />
          Sign in with Google
        </Button>
      </Box>
    </Box>
  );
}
