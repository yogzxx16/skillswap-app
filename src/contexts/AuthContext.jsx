import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { updateUserPresence } from '../services/chatService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in — load their profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        const sessionUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL,
        };

        if (userDoc.exists()) {
          // ✅ Existing user — load their saved data
          setProfile(userDoc.data());
        } else {
          // ✅ Brand new user — create fresh profile
          const newProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL,
            teachSkills: [],
            learnSkills: [],
            city: '',
            xp: 0,
            coins: 100,
            streak: 0,
            level: 'Beginner',
            badges: [],
            swapHistory: [],
            portfolio: [],
            onboarded: false,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newProfile);
          setProfile(newProfile);
        }

        setUser(sessionUser);
      } else {
        // User logged out
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Update presence
  useEffect(() => {
    if (user?.uid) {
      updateUserPresence(user.uid).catch(console.error);
      const interval = setInterval(() => {
        updateUserPresence(user.uid).catch(console.error);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
      // onAuthStateChanged above handles everything automatically
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email, password, displayName) => {
    const { createUserWithEmailAndPassword, updateProfile: updateAuthProfile } = await import('firebase/auth');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateAuthProfile(result.user, { displayName });
      return result.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged sets user/profile to null automatically
  };

  const updateProfile = async (updates) => {
    if (!user?.uid) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      // ✅ Save to Firestore — persists across login/logout
      await updateDoc(userDocRef, updates);
      // ✅ Update local state immediately
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const value = {
    user,
    profile,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};