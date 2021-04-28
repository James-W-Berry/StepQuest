import firebase from "../firebase";

export async function getUser(id) {
  const docRef = firebase.firestore().collection("users").doc(id);

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

export async function joinChallenge(userId, challengeId) {
  console.log(userId, challengeId);
  const docRef = firebase.firestore().collection("users").doc(userId);

  return await docRef
    .update({
      activeChallenges: firebase.firestore.FieldValue.arrayUnion(challengeId),
    })
    .then(() => {
      return {
        success: true,
        message: `Successfully joined challenge ${challengeId}!`,
      };
    })
    .catch((error) => {
      return { success: false, message: error };
    });
}

export async function getChallenges(ids) {
  const docRef = firebase.firestore().collection("challenges");

  return await docRef
    .where(firebase.firestore.FieldPath.documentId(), "in", ids)
    .get()
    .then((querySnapshot) => {
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data());
        return doc.data();
      });
      return docs;
    })
    .catch((error) => {
      return {
        isLoading: false,
        success: false,
        message: error,
      };
    });
}
