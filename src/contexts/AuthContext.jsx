import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { updateUserPresence } from '../services/chatService';

const AuthContext = createContext(null);

// Demo users for showcasing the app without Firebase
const DEMO_USERS = {
  'demo@skillswap.com': {
    uid: 'demo-user-1',
    email: 'demo@skillswap.com',
    displayName: 'Alex Rivera',
    photoURL: null,
  }
};

const DEFAULT_PROFILE = {
  displayName: 'Alex Rivera',
  email: 'demo@skillswap.com',
  photoURL: null,
  teachSkills: ['JavaScript', 'React', 'Python'],
  learnSkills: ['Guitar', 'Photography'],
  xp: 2450,
  coins: 380,
  streak: 12,
  level: 'Expert',
  badges: ['first_swap', '7_day_streak', 'top_teacher'],
  swapHistory: [],
  createdAt: new Date().toISOString(),
  onboarded: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persisted session
    const saved = localStorage.getItem('skillswap_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user);
      setProfile(parsed.profile);
    }
    setLoading(false);
  }, []);

  // Sync presence to Firestore
  useEffect(() => {
    if (user?.uid && !user.uid.startsWith('demo-')) {
      // Update immediately on login
      updateUserPresence(user.uid).catch(console.error);

      // Setup interval to update every 1 minute
      const interval = setInterval(() => {
        updateUserPresence(user.uid).catch(console.error);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const login = async (email, password) => {
    // Demo login
    const demoUser = DEMO_USERS[email] || {
      uid: 'user-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      photoURL: null,
    };
    const userProfile = { ...DEFAULT_PROFILE, email, displayName: demoUser.displayName };
    setUser(demoUser);
    setProfile(userProfile);
    localStorage.setItem('skillswap_user', JSON.stringify({ user: demoUser, profile: userProfile }));
    return demoUser;
  };

  const signup = async (email, password, displayName) => {
    const newUser = {
      uid: 'user-' + Date.now(),
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: null,
    };
    const newProfile = {
      ...DEFAULT_PROFILE,
      email,
      displayName: newUser.displayName,
      xp: 0,
      coins: 100,
      streak: 0,
      level: 'Beginner',
      badges: [],
      teachSkills: [],
      learnSkills: [],
      onboarded: false,
    };
    setUser(newUser);
    setProfile(newProfile);
    localStorage.setItem('skillswap_user', JSON.stringify({ user: newUser, profile: newProfile }));
    return newUser;
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;
      
      const userDocRef = doc(db, 'users', loggedInUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      let userProfile;
      if (userDoc.exists()) {
        userProfile = userDoc.data();
      } else {
        userProfile = {
          ...DEFAULT_PROFILE,
          uid: loggedInUser.uid,
          email: loggedInUser.email,
          displayName: loggedInUser.displayName || loggedInUser.email.split('@')[0],
          photoURL: loggedInUser.photoURL,
          xp: 0,
          coins: 100,
          streak: 0,
          level: 'Beginner',
          badges: [],
          teachSkills: [],
          learnSkills: [],
          onboarded: false,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, userProfile);
      }
      
      const sessionUser = {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        displayName: loggedInUser.displayName || loggedInUser.email.split('@')[0],
        photoURL: loggedInUser.photoURL,
      };

      setUser(sessionUser);
      setProfile(userProfile);
      localStorage.setItem('skillswap_user', JSON.stringify({ user: sessionUser, profile: userProfile }));
      
      return sessionUser;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('skillswap_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem('skillswap_user', JSON.stringify({ user, profile: updated }));
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
