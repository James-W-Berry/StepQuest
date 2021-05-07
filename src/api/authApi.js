import firebase from "firebase";

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
        message: error,
      };
    });
}
