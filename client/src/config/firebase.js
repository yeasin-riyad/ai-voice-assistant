import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// Replace these with your actual Firebase config keys from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyALfLeiLpbAuu7pHqoSY_Lit2MlXy0M9hU",
  authDomain: "ai-voice-app-dfaa5.firebaseapp.com",
  projectId: "ai-voice-app-dfaa5",
  storageBucket: "ai-voice-app-dfaa5.firebasestorage.app",
  messagingSenderId: "609717391802",
  appId: "1:609717391802:web:28a2dbef1787b4503c8d83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Force account selection every time
googleProvider.setCustomParameters({
  prompt: 'select_account'
});


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    // The signed-in user info.
    const user = result.user;
    
    return { user, token };
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData?.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    
    console.error("Firebase Auth Error:", errorCode, errorMessage);
    throw error; // Re-throw so the UI can catch and display it
  }
};