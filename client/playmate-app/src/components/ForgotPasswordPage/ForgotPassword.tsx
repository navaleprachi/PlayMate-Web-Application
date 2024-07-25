// Importing necessary dependencies and assets
import { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Box, Snackbar,Container, CssBaseline,Slide, Avatar, Typography, Grid, TextField, Button, SnackbarCloseReason} from "@mui/material";
import * as userAuthService from '../../services/userAuth-service';
import { QuestionMarkOutlined } from "@mui/icons-material";
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { Link } from "react-router-dom";
import { clearEmailSent,setEmailSent } from "../../store/slices/forgotPassword-slice";
import backgroundImg from '../../assets/background.jpg';
import forgotPassAnimation from '../../assets/ForgotPasswordPage.json';
import { useLottie } from "lottie-react";
import NavbarSign from "../NavBar/NavBarBeforeSignUp";
import { useTranslation } from "react-i18next";


// React functional component for the Forgot Password page
const ForgotPassword: React.FC = (): ReactElement => {
     // Hooks and redux state management
    const {t} = useTranslation('common');
    const dispatch = useDispatch();
    const isEmailSent = useSelector((state: any) => state.forgotPassword.isEmailSent);
    const[open, setOpen] =  useState<boolean>(true);
    const[email, setEmail] = useState<string>('');
    const[snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const[snackbarMessage, setSnackbarMessage] = useState<string>('');
    const[snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(30);
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: forgotPassAnimation ,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      };
    
    const { View } = useLottie(lottieOptions);

    // Function to show a Snackbar with translated message and severity
    const showSnackbar = (messageKey: string, severity: AlertColor) => {
        const translatedMessage = t(messageKey);
        setSnackbarMessage(translatedMessage);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }
    // Function to close the Snackbar
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }
    // Function to handle the "Forgot Password" action
    const handleForgotPassword = async () => {
        try{
            setIsButtonDisabled(true);
            const response = await userAuthService.forgotPassword(email);

            if(response.success){
                dispatch(setEmailSent());
                showSnackbar('card.forgotpass.success', 'success');
            }
            else{
                showSnackbar('card.forgotpass.error', 'error');
            }
        }
        catch(err){
            showSnackbar('card.forgotpass.unerror', 'error');
        }finally {
            // Enable the button after 30 seconds
            setTimeout(() => {
                setIsButtonDisabled(false);
                setCountdown(30); // Reset the countdown
            }, 30000);
        }
    }

    // useEffect for cleanup and countdown logic
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        // Countdown logic
        if (isButtonDisabled) {
            intervalId = setInterval(() => {
                setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
            }, 1000);
        }
        // Cleanup on unmount
        return () => {
            // Clear the interval when the component is unmounted
            clearInterval(intervalId);
    
            // Additional cleanup logic
            dispatch(clearEmailSent());
        };
    }, [isButtonDisabled, dispatch]);

    // Rendering the JSX for the Forgot Password component
    return(
        <>
        {/* Custom styling for the background image */}
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
            {/* Navbar component */}
            <NavbarSign/>
            {/* Main container with Lottie animation, form, and Snackbar */}
            <Container maxWidth='xl' sx={{ display: 'flex'}}>
            {/* Container for Lottie animation */}
            <Container maxWidth="lg" sx={{ marginLeft: "auto", marginRight: 20, marginTop:20}}>
                    {View} 
                </Container>
            {/* Container for the form */}
        <Container maxWidth="md" sx={{ marginLeft: 'auto', marginRight: 0,marginTop:5}}>
            <CssBaseline/>
            <Slide direction="up" in={open} mountOnEnter unmountOnExit>
                {/* Inner container with the form components */}
                <Box 
                    sx={{
                        mt: 20,
                        display: 'flex',
                        flexDirection:'column',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1),rgba(255,255,255,0))',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.18)',
                            boxShadow: '0px 8px 32px 0 rgba(0,0,0,0.37)',
                            padding: '20px',
                    }}
                    >
                         <Box 
                            sx={{
                            display: 'flex',
                            flexDirection:'column',
                            alignItems: 'center'
                        }}>
                            {/* Avatar and title for forgot password page */}
                            <Avatar sx={{ m: 1, bgcolor: "rgba(1, 181, 98, 0.8)"}}>
                                <QuestionMarkOutlined/>
                            </Avatar>
                            <Typography variant="h5">{t('card.forgotpass')}</Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
                            {t('card.forgotpass.info')}
                            </Typography>
                        </Box>
                        {/* Email input and reset password button */}
                        <Box sx={{ mt: 2, width: '100%'}}>
                            <Grid item xs={12}>
                            <TextField
                                name="email"
                                required
                                fullWidth
                                id="email"
                                label={t('card.login.emailLbl')}
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            </Grid>
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
                                pointerEvents: isButtonDisabled ? 'none' : 'auto',
                            }}
                            onClick={handleForgotPassword}
                            >
                            {/* Display countdown or button label */}
                            {isButtonDisabled ? `Reset password in (${countdown}s)` : t('card.forgotpass.submit')}
                            </Button>
                            {/* Link to Sign In and SnackBar for messages */}
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link to="/signin">{t('card.forgotpass.signinlink')}</Link>
                                </Grid>
                            </Grid>
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
};
// Exporting the ForgotPassword component as the default export
export default ForgotPassword;