import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import AuthButton from './components/AuthButton';

// ----------------------------------------------------------------------

export default function FirebaseRegisterView() {
  const theme = useTheme();
  const {
    register,
    loginWithGoogle,
    loginWithFacebook,
    loginWithMicrosoft,
    isRegistered,
    authenticated,
  } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.(data.firstName, data.lastName);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle?.();
    } catch (error) {
      console.error(error);
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
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      {authenticated && !isRegistered ? (
        <Typography variant="h4">Finalize the registration procedure.</Typography>
      ) : (
        <>
          <Typography variant="h4">Sign up to Dorraq platform</Typography>

          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2"> Already have an account? </Typography>

            <Link
              href={paths.auth.firebase.login}
              component={RouterLink}
              variant="subtitle2"
              underline="none"
              color={theme.palette.primary.main}
            >
              Login
            </Link>
          </Stack>
        </>
      )}
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField
        name="firstName"
        label="First name"
        helperText={
          <Typography
            variant="caption"
            sx={{ display: 'flex', gap: theme.spacing(0.5) }}
            alignItems="center"
          >
            <Iconify icon="material-symbols:info" />
            First name is required.
          </Typography>
        }
      />
      <RHFTextField
        name="lastName"
        label="Last name"
        helperText={
          <Typography
            variant="caption"
            sx={{ display: 'flex', gap: theme.spacing(0.5) }}
            alignItems="center"
          >
            <Iconify icon="material-symbols:info" />
            Last name is required.
          </Typography>
        }
      />

      <LoadingButton
        fullWidth
        color="secondary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Continue Registering
      </LoadingButton>
    </Stack>
  );

  const renderLoginOption = (
    <Stack justifyContent="center" spacing={2.5}>
      <AuthButton iconName="logos:meta-icon" handleAuthFunc={handleFacebookLogin}>
        Register with Meta
      </AuthButton>

      <AuthButton iconName="flat-color-icons:google" handleAuthFunc={handleGoogleLogin}>
        Register with Google
      </AuthButton>

      <AuthButton iconName="logos:microsoft-icon" handleAuthFunc={handleMicrosoftLogin}>
        Register with Microsoft
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
      {authenticated && !isRegistered ? (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </FormProvider>
      ) : (
        renderLoginOption
      )}

      {renderTerms}
    </>
  );
}
