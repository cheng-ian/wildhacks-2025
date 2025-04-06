import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, name) {
    try {
      // Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, { displayName: name });
      
      // Create user in our backend
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/add_user`, {
        uid: result.user.uid,
        name: name
      });
      
      return result;
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google sign-in
  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in our database, if not create them
      try {
        await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/add_user`, {
          uid: result.user.uid,
          name: result.user.displayName || 'User'
        });
      } catch (error) {
        // If error is because user already exists, that's fine
        console.log("User may already exist:", error);
      }
      
      return result;
    } catch (error) {
      console.error("Error in Google login:", error);
      throw error;
    }
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Password reset
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update user profile
  async function updateUserProfile(displayName) {
    try {
      await updateProfile(auth.currentUser, { displayName });
      setCurrentUser(prev => ({...prev, displayName}));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 