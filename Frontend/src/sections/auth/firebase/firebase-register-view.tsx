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
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// import { useRouter } from 'src/routes/hooks';

// import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';

// import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import AuthButton from './components/AuthButton';

// ----------------------------------------------------------------------

export default function FirebaseRegisterView() {
  const theme = useTheme();
  const { register, loginWithGoogle, loginWithFacebook, loginWithMicrosoft, authenticated } =
    useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  // const router = useRouter();

  // const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    // email: '',
    // password: '',
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
      // await register?.(
      //   data.email,
      //   data.password,
      //    data.firstName,
      //     data.lastName);
      // const searchParams = new URLSearchParams({
      //   email: data.email,
      // }).toString();
      // const href = `${paths.auth.firebase.verify}?${searchParams}`;
      // router.push(href);
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
      <RHFTextField name="firstName" label="First name" />
      <RHFTextField name="lastName" label="Last name" />

      {/* <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      /> */}

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
      {authenticated ? (
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
