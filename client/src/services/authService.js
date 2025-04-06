import axios from 'axios';
import { auth } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Get the current Auth token
export async function getAuthToken() {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
}

// Create an axios instance with auth headers
export async function getAuthenticatedAxios() {
  const token = await getAuthToken();
  
  if (!token) {
    return axios;
  }
  
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

// Verify authenticated status with backend
export async function verifyAuth() {
  try {
    const axiosAuth = await getAuthenticatedAxios();
    const response = await axiosAuth.get(`${API_URL}/verify-auth`);
    return response.data;
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authenticated: false };
  }
}

// Get user profile from backend
export async function getUserProfile() {
  try {
    const axiosAuth = await getAuthenticatedAxios();
    const response = await axiosAuth.get(`${API_URL}/user/${auth.currentUser.uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Add a produce listing through authenticated endpoint
export async function addListing(listingData) {
  try {
    const axiosAuth = await getAuthenticatedAxios();
    const response = await axiosAuth.post(
      `${API_URL}/add_listing/${auth.currentUser.uid}`, 
      listingData
    );
    return response.data;
  } catch (error) {
    console.error('Error adding listing:', error);
    throw error;
  }
} 