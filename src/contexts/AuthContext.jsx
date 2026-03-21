import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { updateUserPresence } from '../services/chatService';
import { requestNotificationPermission } from '../services/notificationService';
const AuthContext = createContext(null);

// ── Streak Logic Helpers ─────────────────────────────────────
const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0]; // "2026-03-21"
};

const getDaysDiff = (dateStr1, dateStr2) => {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  return diff;
};

const checkAndUpdateStreak = async (uid, existingProfile) => {
  const today = getDateString();
  const lastLoginDate = existingProfile?.lastLoginDate || null;
  const currentStreak = existingProfile?.streak || 0;
  const streakRefillsLeft = existingProfile?.streakRefillsLeft ?? 4;
  const lastWeekReset = existingProfile?.lastWeekReset || today;

  // Check if week has passed → reset refill count to 4
  const daysSinceWeekReset = getDaysDiff(lastWeekReset, today);
  const newRefillsLeft = daysSinceWeekReset >= 7 ? 4 : streakRefillsLeft;
  const newLastWeekReset = daysSinceWeekReset >= 7 ? today : lastWeekReset;

  let newStreak = currentStreak;
  let updates = {};

  if (!lastLoginDate) {
    // First ever login
    newStreak = 1;
  } else if (lastLoginDate === today) {
    // Already logged in today — no change
    return null;
  } else {
    const daysDiff = getDaysDiff(lastLoginDate, today);
    if (daysDiff === 1) {
      // Logged in yesterday → increment streak 🔥
      newStreak = currentStreak + 1;
    } else if (daysDiff > 1) {
      // Missed days → reset streak 💔
      newStreak = 1;
    }
  }

  updates = {
    streak: newStreak,
    lastLoginDate: today,
    streakRefillsLeft: newRefillsLeft,
    lastWeekReset: newLastWeekReset,
  };

  try {
    await updateDoc(doc(db, 'users', uid), updates);
    return updates;
  } catch (err) {
    console.error('Streak update error:', err);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        const sessionUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL,
        };

        if (userDoc.exists()) {
          // ✅ Existing user — load profile
          const existingProfile = userDoc.data();
          // ✅ Ask for notification permission on login
          requestNotificationPermission();

          // ✅ Run streak check on every login
          const streakUpdates = await checkAndUpdateStreak(
            firebaseUser.uid,
            existingProfile
          );

          const updatedProfile = streakUpdates
            ? { ...existingProfile, ...streakUpdates }
            : existingProfile;

          setProfile(updatedProfile);
        } else {
          // ✅ Brand new user
          const today = getDateString();
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
            streak: 1,
            level: 'Beginner',
            badges: [],
            swapHistory: [],
            portfolio: [],
            onboarded: false,
            lastLoginDate: today,
            streakRefillsLeft: 4,
            lastWeekReset: today,
            swapCount: 0,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newProfile);
          setProfile(newProfile);
        }

        setUser(sessionUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Update presence every minute
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
  };

  const updateProfile = async (updates) => {
    if (!user?.uid) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, updates);
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // ── Streak Refill Function ────────────────────────────────
  // Costs 150 XP, restores 1 lost streak day
  // Max 4 refills per week, then must wait for next week
  const refillStreak = async () => {
    if (!user?.uid || !profile) return { success: false, reason: 'Not logged in' };

    const XP_COST = 150;
    const currentXP = profile.xp || 0;
    const refillsLeft = profile.streakRefillsLeft ?? 4;

    // Check refills left
    if (refillsLeft <= 0) {
      return {
        success: false,
        reason: 'No refills left this week! You get 4 refills per week. Come back next week! 📅'
      };
    }

    // Check XP
    if (currentXP < XP_COST) {
      return {
        success: false,
        reason: `Not enough XP! You need ${XP_COST} XP but have ${currentXP} XP. Complete swaps or practice to earn more! ⚡`
      };
    }

    // Apply refill
    const today = getDateString();
    const newStreak = (profile.streak || 0) + 1;
    const newXP = currentXP - XP_COST;
    const newRefillsLeft = refillsLeft - 1;

    const updates = {
      streak: newStreak,
      xp: newXP,
      streakRefillsLeft: newRefillsLeft,
      lastLoginDate: today,
    };

    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      setProfile(prev => ({ ...prev, ...updates }));
      return {
        success: true,
        newStreak,
        newXP,
        refillsLeft: newRefillsLeft,
        reason: `Streak restored to ${newStreak} days! 🔥 (-${XP_COST} XP). ${newRefillsLeft} refills left this week.`
      };
    } catch (err) {
      console.error('Refill error:', err);
      return { success: false, reason: 'Something went wrong. Try again!' };
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
    refillStreak,
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