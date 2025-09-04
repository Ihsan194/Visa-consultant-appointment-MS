import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export async function createAdmin(email, password, fullName) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      email,
      fullName,
      role: "admin",
    });

    console.log("✅ Admin created successfully!");
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
}
