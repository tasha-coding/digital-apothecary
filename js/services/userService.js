// js/services/userService.js
export async function getUser(uid) {
    const doc = await firebase.firestore().collection("users").doc(uid).get();
    return doc.exists ? doc.data() : null;
}
