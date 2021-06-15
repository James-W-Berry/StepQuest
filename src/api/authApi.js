import firebase from "firebase";

export async function signUpUser(email, password) {
  return await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async () => {
      var userId = firebase.auth().currentUser.uid;

      return await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .set({
          displayName: "Anonymous",
          badges: [{ type: "welcome", title: "New User" }],
        })
        .then(() => {
          return {
            success: true,
            message: `Successfully signed up!`,
          };
        })
        .catch((error) => {
          return {
            success: false,
            message: error.message,
          };
        });
    })
    .catch((error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}

export async function sendResetPasswordEmail(email) {
  return await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then((response) => {
      return {
        success: true,
        message: `Please check your email and follow the instructions to reset your password.`,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}

export async function signInUser(email, password) {
  return await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((doc) => {
      return {
        success: true,
        message: "Sign in successful",
      };
      //ensureUserExists(doc.user.uid);
    })
    .catch((error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}

export async function signInUserWithProvider(provider) {
  return await firebase
    .auth()
    .signInWithRedirect(provider)
    .then(() => {
      return {
        success: true,
        message: "Signed in with Google",
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}
