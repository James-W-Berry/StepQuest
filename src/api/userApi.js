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

export async function joinChallengeBatch(userId, challengeId) {
  const userDocRef = firebase.firestore().collection("users").doc(userId);
  const challengeDocRef = firebase
    .firestore()
    .collection("challenges")
    .doc(challengeId);
  const batch = firebase.firestore().batch();

  batch.update(userDocRef, {
    activeChallenges: firebase.firestore.FieldValue.arrayUnion(challengeId),
  });
  batch.update(challengeDocRef, {
    participants: firebase.firestore.FieldValue.arrayUnion(userId),
  });

  return await batch
    .commit()
    .then((response) => {
      console.log(response);
      return {
        success: true,
        message: `Successfully joined challenge ${challengeId}!`,
      };
    })
    .catch((error) => {
      return {
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

export async function leaveChallengeBatch(userId, challengeId) {
  const userDocRef = firebase.firestore().collection("users").doc(userId);
  const challengeDocRef = firebase
    .firestore()
    .collection("challenges")
    .doc(challengeId);
  const batch = firebase.firestore().batch();

  batch.update(userDocRef, {
    activeChallenges: firebase.firestore.FieldValue.arrayRemove(challengeId),
  });
  batch.update(challengeDocRef, {
    participants: firebase.firestore.FieldValue.arrayRemove(userId),
  });
  batch.update(challengeDocRef, {
    admin: firebase.firestore.FieldValue.arrayRemove(userId),
  });

  return await batch
    .commit()
    .then((response) => {
      console.log(response);
      return {
        success: true,
        message: `Successfully lef challenge ${challengeId}`,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function leaveChallenge(userId, challengeId) {
  const docRef = firebase.firestore().collection("users").doc(userId);

  return await docRef
    .update({
      activeChallenges: firebase.firestore.FieldValue.arrayRemove(challengeId),
    })
    .then(() => {
      return {
        success: true,
        message: `Successfully left challenge ${challengeId}`,
      };
    })
    .catch((error) => {
      return { success: false, message: error };
    });
}

export async function getChallenges(ids) {
  if (ids.length > 0) {
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
  return [];
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

export async function removeEndedChallenges(
  userId,
  allChallenges,
  activeChallenges
) {
  const docRef = firebase.firestore().collection("users").doc(userId);
  const updatedChallenges = [];

  activeChallenges.forEach((challenge) => {
    if (allChallenges.includes(challenge.id)) {
      updatedChallenges.push(challenge.id);
    }
  });

  return await docRef
    .update({
      activeChallenges: updatedChallenges,
    })
    .then(() => {
      return {
        success: true,
        message: `Successfully removed inactive challenges from user`,
      };
    })
    .catch((error) => {
      return { success: false, message: error };
    });
}
