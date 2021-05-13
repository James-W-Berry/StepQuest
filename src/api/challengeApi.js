import firebase from "../firebase";

export async function createNewChallengeBatch(
  challengeData,
  userId,
  challengeId
) {
  const challengeDocRef = firebase
    .firestore()
    .collection("challenges")
    .doc(challengeId);
  const userDocRef = firebase.firestore().collection("users").doc(userId);
  const batch = firebase.firestore().batch();

  try {
    batch.set(challengeDocRef, challengeData);
    batch.update(userDocRef, {
      activeChallenges: firebase.firestore.FieldValue.arrayUnion(challengeId),
    });
    batch.update(userDocRef, {
      badges: firebase.firestore.FieldValue.arrayUnion({
        type: "createChallenge",
        title: "Challenge Creator",
      }),
    });
  } catch (error) {
    return {
      success: false,
      message: "Could not create challenge! Please try again later.",
    };
  }

  return await batch
    .commit()
    .then((response) => {
      console.log(response);
      return {
        success: true,
        message: `Successfully created new challenge ${challengeData.title}!`,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

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

export async function addActivityEntries(challengeId, userId, activities) {
  const docRef = firebase
    .firestore()
    .collection("challenges")
    .doc(challengeId)
    .collection("logs")
    .doc(userId);

  return await docRef
    .set(
      {
        activities: firebase.firestore.FieldValue.arrayUnion(...activities),
      },
      { merge: true }
    )
    .then(() => {
      return {
        success: true,
        message: `Successfully added activities from ${userId} to ${challengeId}`,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function getUserEntries(challengeId, userId) {
  const docRef = firebase
    .firestore()
    .collection("challenges")
    .doc(challengeId)
    .collection("logs")
    .doc(userId);

  return await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().activities) {
          return {
            success: true,
            data: doc.data().activities,
          };
        }
        return {
          success: true,
          data: [],
        };
      } else {
        return {
          success: false,
          data: null,
        };
      }
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}
