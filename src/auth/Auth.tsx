import { useEffect, useState } from "react";
import { auth } from "../firabase/sdk";
import {
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
import { TextInput, Button, Group, Box, createStyles } from "@mantine/core";
// import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import * as userActions from "../redux/actions/user/userActions";
import { showNotification } from "@mantine/notifications";
import { setStore, getStore } from "../services/storageService";
import { RootState } from "../redux/store/store";

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
    marginTop: '1rem'
  },
}));

export default function Auth() {
  // const [errorMsgs, setErrorMsgs] = useState("");
  // const [hasAccount, setHasAccount] = useState(false);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  // const [openForgottenBox, setOpenForgottenBox] = useState(false);
  // const [emailToResetPassword, setEmailToResetPassword] = useState("");
  const [email, setEmail] = useState("");
  const user = useSelector((state: RootState) => state.user);

  const sendEmailLink = async () => {
    const actionCodeSettings = {
      // url: "https://wkr92.github.io/war-up/",
      url: 'http://localhost:5173/',
      handleCodeInApp: true,
    };

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

  // useEffect(() => {
  //   setErrorMsgs("");
  // }, [hasAccount]);

  // const form = useForm({
  //   initialValues: { email: "", password: "" },

  //   validate: {
  //     email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
  //     password: (value) => {
  //       if (value.length < 6)
  //         return "Password need to have at least 3 characters";
  //       if (!/[A-Z]/.test(value))
  //         return "The string must contain at least 1 uppercase alphabetical character";
  //       if (!/[0-9]/.test(value))
  //         return "The string must contain at least 1 numeric character";
  //     },
  //   },
  // });

  // const handleLogin = (values: FormValues) => {
  //   setErrorMsgs("");

  //   signInWithEmailAndPassword(auth, values.email, values.password)
  //     .then((userCredentails) => {
  //       const user = userCredentails.user;
  //       dispatch(userActions.userLoggedIn(user));
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setErrorMsgs(error.message);
  //     });
  // };

  // const handleCreateUser = (values: FormValues) => {
  //   setErrorMsgs("");

  //   createUserWithEmailAndPassword(auth, values.email, values.password).catch(
  //     (error) => {
  //       console.error(error);
  //       setErrorMsgs(error.message);
  //     }
  //   );
  // };

  // const sendResetPasswordEmailToUser = async () => {
  //   await sendPasswordResetEmail(auth, email)
  //     .then(() => {
  //       showNotification({
  //         message: "Reset password email sent",
  //         autoClose: 5000,
  //         color: "green",
  //       });
  //     })
  //     .catch((error) => {
  //       showNotification({
  //         message: error.message ? error.message : "Error",
  //         autoClose: 5000,
  //         color: "red",
  //       });
  //     });
  // };

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
          onKeyDown={async () => await sendEmailLink()}
          className={classes.emailSubmit}
          onClick={async () => await sendEmailLink()}
        >
          Send me log in link 
        </Button>
        {/* <form
          className={classes.form}
          onSubmit={form.onSubmit((values) =>
            hasAccount ? handleLogin(values) : handleCreateUser(values)
          )}
        >
          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
            className={classes.input}
          />
          <TextInput
            required
            label="Password"
            placeholder="your password"
            {...form.getInputProps("password")}
            className={classes.input}
          />
          <Group position="right" mt="md" className={classes.btnsContainer}>
            <p
              onClick={() => setHasAccount(!hasAccount)}
              className={classes.accQuestion}
            >
              {hasAccount ? "Don't have account?" : "Already have account?"}
            </p>
            <Button className={classes.btn} type="submit">
              {hasAccount ? "Sign in" : "Sing up"}
            </Button>
          </Group>
          <p className={classes.errorMsg}>{errorMsgs}</p>
        </form> */}
        {/* <Box className={classes.forgottenPasswordContainer}>
          <Button onClick={() => setOpenForgottenBox(!openForgottenBox)}>
            I forgot password
          </Button>
          {openForgottenBox && (
            <Group className={classes.forgottenPasswordGroup}>
              <TextInput
                className={classes.forgottenPasswordInput}
                placeholder="email"
                value={emailToResetPassword}
                onChange={(e) => setEmailToResetPassword(e.target.value)}
              />
              <Button
                onClick={async () => await sendEmailLink()}
              >
                Send
              </Button>
            </Group>
          )}
        </Box> */}
      </Box>
    </Box>
  );
}

type FormValues = {
  email: string;
  password: string;
};
