import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { GuestGuard } from 'src/auth/guard';
import AuthModernLayout from 'src/layouts/auth/modern';

import { SplashScreen } from 'src/components/loading-screen';

// FIREBASE
const FirebaseLoginPage = lazy(() => import('src/pages/auth/firebase/login'));
const FirebaseRegisterPage = lazy(() => import('src/pages/auth/firebase/register'));

const authFirebase = {
  element: (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      index: true,
      path: 'login',
      element: (
        <GuestGuard>
          <AuthModernLayout>
            <FirebaseLoginPage />
          </AuthModernLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'register',
      element: (
        <GuestGuard>
          <AuthModernLayout>
            <FirebaseRegisterPage />
          </AuthModernLayout>
        </GuestGuard>
      ),
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authFirebase],
  },
];
