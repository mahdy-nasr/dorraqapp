import { useState } from 'react';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';

import AuthButton from './components/AuthButton';

// ----------------------------------------------------------------------

export default function FirebaseLoginView() {
  const theme = useTheme();
  const { loginWithGoogle, loginWithFacebook, loginWithMicrosoft } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle?.();
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook?.();
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      await loginWithMicrosoft?.();
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Dorraq platform</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link
          component={RouterLink}
          href={paths.auth.firebase.register}
          variant="subtitle2"
          underline="none"
          color={theme.palette.primary.main}
        >
          Create an account
        </Link>
      </Stack>
    </Stack>
  );

  const renderLoginOption = (
    <Stack justifyContent="center" spacing={2.5}>
      <AuthButton iconName="logos:meta-icon" handleAuthFunc={handleFacebookLogin}>
        Login with Meta
      </AuthButton>

      <AuthButton iconName="flat-color-icons:google" handleAuthFunc={handleGoogleLogin}>
        Login with Google
      </AuthButton>

      <AuthButton iconName="logos:microsoft-icon" handleAuthFunc={handleMicrosoftLogin}>
        Login with Microsoft
      </AuthButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {renderLoginOption}
    </>
  );
}
