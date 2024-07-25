import React, { ReactElement, useState } from 'react';
import { styled } from '@mui/system';
import {
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Box,
} from '@mui/material';
import backgroundImage from '../../assets/bg.avif';
import playmateIcon from '../../../public/logo512.png';

import LogOutModal from '../LogOutModalPage/LogOutModel';
import { LogoutOutlined } from '@mui/icons-material';
import { AccountCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = (): ReactElement => {
  const userId = localStorage.getItem('userId');
  const { t } = useTranslation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: 'green' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* adding logo */}
            <img src={`${process.env.PUBLIC_URL}/logo512.png`} alt="Your Image" style={{ width: '30px', marginRight: '4px' }} />
            <Button color="inherit" href="/upcomingEvents" sx={{ marginLeft: 1 }}>
              {t('playmate')}
            </Button>
          </Box>
          <Box>
            <Button color="inherit" href="/userBookings">
              {t('yourGames')}
            </Button>
            <Button color="inherit" href="/allBlogs">
              {t('blogs')}
            </Button>
            <Button color="inherit" href="/arenaSearch">
              {t('play')}
            </Button>
            <IconButton color="inherit" href={`/myProfile/${userId}`}>
              <AccountCircle />
            </IconButton>
            <Button color="inherit" onClick={handleOpenLogoutModal}>
              <LogoutOutlined />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <LogOutModal isOpen={isLogoutModalOpen} onClose={handleCloseLogoutModal} />
    </>
  );
};

export default Navbar;
