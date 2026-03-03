// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /intakes/{docId} {
      allow read, write: if request.auth != null;
    }
    match /admin/{docId} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}


firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";

