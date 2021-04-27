import firebase from "../firebase";

export async function createNewChallenge(challenge) {
  const docRef = await firebase
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
