import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";


// From: Firebase Console → Project Settings → Your apps → SDK setup
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app (singleton)
const app = initializeApp(firebaseConfig);

// Auth instance + Google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Force account picker every time (good UX)
googleProvider.setCustomParameters({ prompt: "select_account" });

/**
 * @function googleLogin
 * @description Opens the Google popup, retrieves the Firebase ID token,
 * and sends it to our backend for verification + JWT issuance.
 * Returns the user object from our own MongoDB (not Firebase's user).
 */
export async function googleLogin() {
  // Step 1: Open Google popup → Firebase gives us a credential
  const result = await signInWithPopup(auth, googleProvider);

  // Step 2: Extract the Firebase ID token
  // This token proves to our backend that Google authenticated this user
  const idToken = await result.user.getIdToken();

  // Step 3: Send idToken to our backend
  // Backend will verify it, create/find the MongoDB user, set JWT cookie
  const response = await fetch("http://localhost:3000/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",        // ← send/receive cookies
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    // Sign out of Firebase too so state stays clean
    await signOut(auth);
    throw new Error("Backend Google auth failed");
  }

  const data = await response.json();
  return data; // { message, user: { id, username, email } }
}