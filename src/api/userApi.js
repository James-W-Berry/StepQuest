import firebase from "../firebase";

export async function createUser(username, email, password) {
  const db = firebase.firestore();

  return await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async () => {
      var userId = firebase.auth().currentUser.uid;

      return await db
        .collection("users")
        .doc(userId)
        .set({
          displayName: username,
          badges: [{ type: "welcome", title: "New User" }],
        })
        .then(() => {
          return {
            success: true,
            message: `Successfully sign up new user ${userId}`,
          };
        })
        .catch(function (error) {
          console.log(error);
          alert(error.message);
          return { success: false, message: error };
        });
    })
    .catch(function (error) {
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

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

export async function addBadge(userId, badge) {
  const docRef = firebase.firestore().collection("users").doc(userId);

  return await docRef
    .update({
      badges: firebase.firestore.FieldValue.arrayUnion(badge),
    })
    .then(() => {
      return {
        success: true,
        message: `Successfully added badge to user ${userId}!`,
      };
    })
    .catch((error) => {
      return { success: false, message: error };
    });
}
