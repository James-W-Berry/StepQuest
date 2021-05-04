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

export async function deleteChallenge(id) {
  const docRef = firebase.firestore().collection("challenges").doc(id);

  return await docRef
    .delete()
    .then(() => {
      return {
        success: true,
        message: `Successfully deleted challenge ${id}`,
      };
    })
    .catch((error) => {
      return { success: false, message: error };
    });
}

export async function addUserToChallenge(userId, id) {
  const docRef = firebase.firestore().collection("challenges").doc(id);

  return await docRef
    .update({
      participants: firebase.firestore.FieldValue.arrayUnion(userId),
    })
    .then(() => {
      return {
        success: true,
        message: `Successfully joined challenge ${id}!`,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function removeUserFromChallenge(userId, id) {
  const docRef = firebase.firestore().collection("challenges").doc(id);

  return await docRef
    .update({
      participants: firebase.firestore.FieldValue.arrayRemove(userId),
    })
    .then(() => {
      return {
        success: true,
        message: `Successfully removed ${userId} from challenge ${id}!`,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function removeAdminFromChallenge(userId, id) {
  const docRef = firebase.firestore().collection("challenges").doc(id);

  return await docRef
    .update({
      admin: firebase.firestore.FieldValue.arrayRemove(userId),
    })
    .then(() => {
      return {
        success: true,
        message: `Successfully removed admin ${userId} from challenge ${id}!`,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
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

export async function addAdmins(admins, challengeId) {
  console.log(admins, challengeId);
  const docRef = firebase.firestore().collection("challenges").doc(challengeId);

  return await docRef
    .update({
      admin: firebase.firestore.FieldValue.arrayUnion(...admins),
    })
    .then(() => {
      return {
        success: true,
        message:
          admins.length > 1
            ? `Successfully added admins to challenge!`
            : `Successfully added ${admins[0]} to challenge!`,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}
