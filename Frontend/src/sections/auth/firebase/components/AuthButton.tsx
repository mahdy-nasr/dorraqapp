import React from 'react'

import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

type Props = {
  children: React.ReactNode;
  iconName: string;
  handleAuthFunc: () => Promise<void>;
}

const AuthButton = ({children, iconName, handleAuthFunc}: Props) => {
  const theme = useTheme();
  return (
    <Button
        onClick={handleAuthFunc}
        variant="soft"
        color="inherit"
        size="large"
        startIcon={<Iconify icon={iconName} />}
        sx={{ gap: theme.spacing(1) }}
      >
        <Typography variant="button" flex={1}>
          {children}
        </Typography>
      </Button>
  )
}

export default AuthButton