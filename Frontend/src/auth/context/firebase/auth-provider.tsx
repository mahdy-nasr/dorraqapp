import { useMemo, useEffect, useReducer, useCallback } from 'react';
import {
  getAuth,
  signOut,
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';

// import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { firebaseApp, isRegistered as isRegister } from './lib';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';
// ----------------------------------------------------------------------

const AUTH = getAuth(firebaseApp);

enum Types {
  INITIAL = 'INITIAL',
  REGISTER = 'REGISTER',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
};

type Action = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: Action) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(() => {
    // signOut(AUTH);
    try {
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          if (user.emailVerified) {
            const accessToken = await user.getIdToken();
            const isRegistered = await isRegister(accessToken);
            dispatch({
              type: Types.INITIAL,
              payload: {
                user: {
                  ...user,
                  isRegistered,
                  id: user.uid,
                  role: 'student',
                },
              },
            });
          } else {
            dispatch({
              type: Types.INITIAL,
              payload: {
                user: null,
              },
            });
          }
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: null,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(AUTH, provider);
  }, []);

  const loginWithFacebook = useCallback(async () => {
    const provider = new FacebookAuthProvider();

    await signInWithPopup(AUTH, provider);
  }, []);

  const loginWithMicrosoft = useCallback(async () => {
    const provider = new OAuthProvider('microsoft.com');

    await signInWithPopup(AUTH, provider);
  }, []);

  // REGISTER
  const register = useCallback(
    async (firstName: string, lastName: string): Promise<void> => {
      const data = {
        firstName,
        lastName,
      };

      if (!data.firstName || !data.lastName) {
        console.error('first name and last name are required!!!');
      } else {
        const accessToken = state.user?.accessToken;
        console.table({ 'access token': accessToken, ...data });
        // try {
        //   const res = await axios.post(endpoints.auth.register, data, {
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`,
        //       'Content-Type': 'application/json',
        //     },
        //   });
        //   const user = await res.data;
        //   dispatch({
        //     type: Types.REGISTER,
        //     payload: {
        //       user: {
        //         ...user,
        //       },
        //     },
        //   });
        // } catch (error) {
        //   console.log(error);
        // }
      }
    },
    [state]
  );

  // LOGOUT
  const logout = useCallback(async () => {
    await signOut(AUTH);
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user?.emailVerified ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const isRegistered = state.user?.isRegistered;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'firebase',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      isRegistered,
      logout,
      register,
      loginWithGoogle,
      loginWithFacebook,
      loginWithMicrosoft,
    }),
    [
      status,
      state.user,
      isRegistered,
      logout,
      register,
      loginWithFacebook,
      loginWithGoogle,
      loginWithMicrosoft,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
