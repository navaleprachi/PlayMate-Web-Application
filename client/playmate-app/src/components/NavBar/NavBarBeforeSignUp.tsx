import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import backgroundImage from '../../assets/bg.avif';

// Creating a different navigation bar 
const NavbarSign: React.FC = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <AppBar position="fixed" sx={{ background: 'green' }}>
      <Toolbar>
      <img src={`${process.env.PUBLIC_URL}/logo512.png`} alt="Your Image" style={{ width: '30px', marginRight: '4px' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('playmate')}
        </Typography>
        <Button color="inherit" href='/signin'>
          {t('signupSignin')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarSign;
