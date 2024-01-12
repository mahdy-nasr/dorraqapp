import { User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

import axios, { endpoints } from 'src/utils/axios';

import { FIREBASE_API } from 'src/config-global';
// ----------------------------------------------------------------------

export const firebaseApp = initializeApp(FIREBASE_API);

// ______________________________________________________________________

// this function is not used yet!!!!!!!!! (with love)
export const isNewUser = (user: User): Boolean => {
  if (user.metadata.creationTime === user.metadata.lastSignInTime) return true;
  return false;
};

export const isRegistered = async (jwt: string): Promise<boolean> => {
  if (jwt) {
    try {
      const res = await axios.get(endpoints.auth.login, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
      const { user } = await res.data;
      if (!user?.firstName || !user?.lastName) {
        return false;
      }
    } catch (error) {
      return false;
    }
    return true;
  }
  return false;
};
