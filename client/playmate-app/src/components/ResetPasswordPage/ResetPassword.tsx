// Importing necessary dependencies
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { LockResetOutlined } from '@mui/icons-material';
import * as userAuthService from '../../services/userAuth-service';
import backgroundImg from '../../assets/background.jpg';
import { Button, TextField, Typography, Container, CssBaseline, Box, Avatar, Slide, Snackbar, InputAdornment, IconButton } from '@mui/material';
import { clearPasswordReset, setPasswordReset } from "../../store/slices/resetPassword-slice";
import resetPassAnimation from '../../assets/ResetPasswordPage.json';
import { useLottie } from "lottie-react";
import { useTranslation } from "react-i18next";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// ResetPassword component
const ResetPassword: React.FC = () => {
  // Hooks and state management
  const {t} = useTranslation('common');
  const dispatch = useDispatch();
  const[open, setOpen] = useState<boolean>(true);
  const isPasswordReset = useSelector((state: any) => state.resetPassword.isPasswordReset);
    const {resetToken} = useParams<{resetToken: string}>();
    const[newPassword, setNewPassword] = useState<string>('');
    const[confirmPassword, setConfirmPassword] = useState<string>('');
    const[newPasswordError, setNewPasswordError] = useState<string>('');
    const[confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    const[isResetButtonDisabled, setIsResetButtonDisabled] = useState<boolean>(true);
    const[showPassword, setshowPassword] = useState<boolean>(false);
    const[showCPassword, setshowCPassword] = useState<boolean>(false);
    const[snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const[snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    // Lottie animation options
    const lottieOptions = {
      loop: true,
      autoplay: true,
      animationData: resetPassAnimation ,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };
  
    const { View } = useLottie(lottieOptions);

    // Function to show snackbar with translated message and severity
    const showSnackbar = (messageKey: string, severity: AlertColor) => {
      const translatedMessage = t(messageKey);
        setSnackbarMessage(translatedMessage);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }
    
    // Function to handle snackbar close and clear password reset state
      const handleCloseSnackbar = () => {
        setSnackbarOpen(false);

        dispatch(clearPasswordReset());
    }

    // Function to validate password using regex
    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!#*`~]).{8,}$/;
        return passwordRegex.test(password);
    }

    // Function to validate form fields for new password and confirm password
    const validateField = (field: string, value: string): void => {
        if (!value) {
          if (field === 'newPassword') {
            setNewPasswordError(t('card.newpass.req'));
          } else if (field === 'confirmPassword') {
            setConfirmPasswordError(t('card.confirmpass.req'));
          }
        } 
        else if(field === 'newPassword' && !validatePassword(value)){
            if(!(/[!@#$%^&*(),.?":{}|<>]/.test(value))){
                setNewPasswordError(t('card.pass.sp.error'))
            }
            else if(!(/\d/.test(value))){
                setNewPasswordError(t('card.pass.nm.error'))
            }
            else if(!(/[A-Z]/.test(value))){
                setNewPasswordError(t('card.pass.up.error'))
            }
            else if(!(/[a-z]/.test(value))){
                setNewPasswordError(t('card.pass.lw.error'))
            }
        }
        else if(field === 'confirmPassword' && newPassword !== confirmPassword){
            setConfirmPasswordError(t('card.passmatch'));
        }
        else {
          setNewPasswordError('');
          setConfirmPasswordError('');
        }
      }

      // Effect to reset errors and update button disabled state
      useEffect(() => {
        setNewPasswordError('');
        setConfirmPasswordError('');
        const isFormComplete = newPassword && confirmPassword;
        setIsResetButtonDisabled(!isFormComplete);
      }, [newPassword, confirmPassword]);

      // Function to handle password reset
      const handleResetPassword = async () => {
        try {
          // Validate new password and confirm password
          validateField('newPassword', newPassword);
          validateField('confirmPassword', confirmPassword);

          //If both are not empty call the resetpasswoprd service
          if(!newPasswordError && !confirmPasswordError){
            const resetData = {resetToken,newPassword};
            const response = await userAuthService.resetPassword(resetData);
            if(response.success){
              dispatch(setPasswordReset());
                showSnackbar('card.reset.success','success');
                console.log('Password reset successfully', response);
            }
            else{
                showSnackbar(`Error resetting password: ${response.message}`, 'error');
                console.error('Error resetting password: ', response.message);
            }
          }

        } catch (err) {
          showSnackbar('card.reset.unerror', 'error');
          console.error('Unexpected error during password reset:', err);
        }
      };

      // JSX for rendering the ResetPassword component
      return(
        <>
        {/* Global styling for background image*/}
         <style>
                {`
                    body {
                        margin: 0;
                        padding: 0;
                        display: flex;
                        min-height: 100vh;
                        background-image: url(${backgroundImg});
                        background-size: cover;
                        background-repeat: no-repeat;
                    }
                `}
            </style>
            {/* Container for the component */}
            <Container maxWidth='xl' sx={{ display: 'flex' }}>
            <Container maxWidth="lg" sx={{ marginLeft: "auto", marginRight: 20, marginTop:20}}>
                    {View} 
                </Container>
      {/* Main container for the ResetPassword component */}
      <Container maxWidth="xs" sx={{ marginLeft: 'auto', marginRight: 0}}>
        <CssBaseline />
        {/* Slide animation for entrance effect */}
        <Slide direction="right" in mountOnEnter unmountOnExit>
          <Box
            sx={{
              mt: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1),rgba(255,255,255,0))',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.18)',
                            boxShadow: '0px 8px 32px 0 rgba(0,0,0,0.37)',
                            padding: '20px',
            }}
          >
            {/* Avatar for the reset password icon */}
            <Avatar sx={{ m: 1, bgcolor: "rgba(1, 181, 98, 0.8)",width: 40, height: 40 }}>
              <LockResetOutlined />
            </Avatar>
            {/* Reset passsword Title */}
            <Typography variant="h5">{t('card.reset.title')}</Typography>
            <Box sx={{ mt: 1 }}>
              {/* New Password TextField */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                label={t('card.newpass')}
                autoFocus={!open}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => validateField('newPassword', newPassword)}
                error={!!newPasswordError}
                helperText={newPasswordError}
                InputProps = {{
                  // Password visibility toggle
                  endAdornment: (
                      <InputAdornment position="end">
                          <IconButton onClick= {() => setshowPassword(!showPassword)} edge="end">
                              {showPassword ? <Visibility/>: <VisibilityOff/>}
                          </IconButton>
                      </InputAdornment>
                  ),
              }}
              />
              {/* Confirm Password TextField */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                type={showCPassword ? 'text' : 'password'}
                label={t('card.confirmpass')}
                autoFocus={!open}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => validateField('confirmPassword', confirmPassword)}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                InputProps = {{
                  // Confirm Password visibility toggle
                  endAdornment: (
                      <InputAdornment position="end">
                          <IconButton onClick= {() => setshowCPassword(!showCPassword)} edge="end">
                              {showCPassword ? <Visibility/>: <VisibilityOff/>}
                          </IconButton>
                      </InputAdornment>
                  ),
              }}
              />
              {/* Reset Password Button */}
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: 'rgba(1, 181, 98, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(29, 211, 126, 0.8)',
                  },
                  transition: 'background-color 0.3s',
                }}
                onClick={handleResetPassword}
                disabled={isResetButtonDisabled}
              >
                {t('card.reset.button')}
              </Button>
            </Box>
          </Box>
        </Slide>
        {/* Snackbar for displaying messages */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', maxWidth: '600px' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Container>
      </Container>
    </>
      )
}

// Exporting the ResetPassword component as the default export
export default ResetPassword;