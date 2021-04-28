import firebase from "../firebase";

export async function createNewChallenge(challenge) {
  const docRef = firebase
    .firestore()
    .collection("challenges")
    .doc(challenge.id);

  return await docRef
    .set(challenge)
    .then(() => {
      return {
        success: true,
        message: `Successfully created new challenge ${challenge.title}!`,
      };
    })
    .catch((error) => {
      return { success: false, message: error };
    });
}

export async function getChallenge(id) {
  const docRef = firebase.firestore().collection("challenges").doc(id);

  return await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        return {
          isLoading: false,
          success: true,
          data: doc.data(),
        };
      } else {
        return {
          isLoading: false,
          success: false,
          data: null,
        };
      }
    })
    .catch((error) => {
      return {
        isLoading: false,
        success: false,
        message: error,
      };
    });
}
