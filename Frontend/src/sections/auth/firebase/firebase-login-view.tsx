import { useState } from 'react';
// import * as Yup from 'yup';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import LoadingButton from '@mui/lab/LoadingButton';
// import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// import { useRouter, useSearchParams } from 'src/routes/hooks';

// import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
// import { PATH_AFTER_LOGIN } from 'src/config-global';

import AuthButton from './components/AuthButton';
// import Iconify from 'src/components/iconify';
// import FormProvider, { RHFTextField } from 'src/components/hook-form';


// ----------------------------------------------------------------------

export default function FirebaseLoginView() {
  const theme = useTheme();
  const { loginWithGoogle, loginWithFacebook, loginWithMicrosoft } = useAuthContext();

  // const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  // const searchParams = useSearchParams();

  // const returnTo = searchParams.get('returnTo');

  // const password = useBoolean();

  // const LoginSchema = Yup.object().shape({
  //   email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  //   password: Yup.string().required('Password is required'),
  // });

  // const defaultValues = {
  //   email: '',
  //   password: '',
  // };

  // const methods = useForm({
  //   resolver: yupResolver(LoginSchema),
  //   defaultValues,
  // });

  // const {
  //   reset,
  //   handleSubmit,
  //   formState: { isSubmitting },
  // } = methods;

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     await login?.(data.email, data.password);

  //     router.push(returnTo || PATH_AFTER_LOGIN);
  //   } catch (error) {
  //     console.error(error);
  //     reset();
  //     setErrorMsg(typeof error === 'string' ? error : error.message);
  //   }
  // });

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

  // const renderForm = (
  //   <Stack spacing={2.5}>
  //     <RHFTextField name="email" label="Email address" />

  //     <RHFTextField
  //       name="password"
  //       label="Password"
  //       type={password.value ? 'text' : 'password'}
  //       InputProps={{
  //         endAdornment: (
  //           <InputAdornment position="end">
  //             <IconButton onClick={password.onToggle} edge="end">
  //               <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
  //             </IconButton>
  //           </InputAdornment>
  //         ),
  //       }}
  //     />

  //     <LoadingButton
  //       fullWidth
  //       color="inherit"
  //       size="large"
  //       type="submit"
  //       variant="contained"
  //       loading={isSubmitting}
  //     >
  //       Login
  //     </LoadingButton>
  //   </Stack>
  // );logos:meta-icon

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

      {/* <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider> */}

      {renderLoginOption}
    </>
  );
}
