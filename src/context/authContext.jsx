import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import LoadingSpinner from "../components/loadingSpinner";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, fullName) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      email,
      fullName,
      role: "user"
    });
    return res;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth).then(() => {
      setCurrentUser(null);
      setUserData(null);
    });
  };

  useEffect(() => {
    let unsubDoc;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (unsubDoc) {
        try { unsubDoc(); } catch { }
        unsubDoc = undefined;
      }
      if (user) {
        unsubDoc = onSnapshot(
          doc(db, "users", user.uid),
          (docSnap) => {
            setUserData(docSnap.exists() ? docSnap.data() : null);
            setLoading(false);
          },
          (err) => {
            console.error("user snapshot error:", err);
            setLoading(false);
          }
        );
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  const value = { currentUser, userData, setUserData, signup, login, logout };

  if (loading) {
    return <LoadingSpinner tip="Authenticating user..." fullScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
