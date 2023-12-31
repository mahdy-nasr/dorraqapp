import admin from 'firebase-admin';
import appConfig from '@/AppConfig/app.config';
export const setupFirebase = () => {
  admin.initializeApp({ projectId: appConfig.firebaseProjectID });
};

export const firebase = admin;
