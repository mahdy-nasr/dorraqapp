import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  firebase: paths.auth.firebase.login,
};

const registerPaths: Record<string, string> = {
  firebase: paths.auth.firebase.register,
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();

  const { authenticated, method, isRegistered } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else if (!isRegistered) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const registerPath = registerPaths[method];

      const href = `${registerPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router, isRegistered]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
