// Importing necessary dependencies
import { ReactElement, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useLottie } from "lottie-react";
import signInAnimation from '../../assets/SignInPage.json';
import { setUserAndToken } from "../../store/slices/signIn-slice";
import * as userAuthService from '../../services/userAuth-service';
import { Button, TextField, Typography,Container, CssBaseline, Box, Avatar, Grid,Slide, Snackbar, InputAdornment, IconButton} from "@mui/material";
import { Visibility, VisibilityOff, VpnKeyOutlined } from "@mui/icons-material";
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { Link } from "react-router-dom";
import backgroundImg from '../../assets/background.jpg';
import NavbarSign from "../NavBar/NavBarBeforeSignUp";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// SignIn component
const SignIn: React.FC = (): ReactElement => {
    // Hooks and state management
    const {t} = useTranslation('common');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const[open, setOpen] = useState<boolean>(true);
    const[email, setEmail] = useState<string>('');
    const[password, setPassword] = useState<string>('');
    const[passwordError, setPasswordError] = useState<string>('');
    const[emailError, setEmailError] = useState<string>('');
    const[isSignInButtonDisabled, setIsSignInButtonDisabled] = useState<boolean>(true);
    const[showPassword, setshowPassword] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    // Lottie animation options
    const lottieOptions = {
        loop: false,
        autoplay: true,
        animationData: signInAnimation,
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
     // Function to handle snackbar close
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }
    // Function to validate email format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // Function to validate form fields
    const validateField = (field: string, value: string): void => {
        if(!value){
            if(field === 'email'){
                setEmailError(t('card.email.required'));
            }
            else if(field === 'password'){
                setPasswordError(t('card.password.required'));
            }
                   
        } else if(field === 'email' && !validateEmail(value)){
            setEmailError(t('card.email.invalid'));
        } 
        else{
            setEmailError('');
            setPasswordError('');
        }
    }
    // Effect to reset errors and update button disabled state
    useEffect(() => {
        setPasswordError('');
        setEmailError('');
        const isFormComplete = email && password;
        setIsSignInButtonDisabled(!isFormComplete);
    },[email,password]);

    // Function to handle sign-in
    const handleSignIn = async () => {
        try{
            //Validate email and password
            validateField('email', email);
            validateField('password',password);

            // If no errors hit the login error service
            if(!emailError && !passwordError){
                //Store the user data consisting of email and password
                const userData = {email, password};
                const response = await userAuthService.loginUser(userData);
                const{user, tokens} = response; //Parse the user and tokens
                // If response sucess and user is present set the user and tokens in redux state and localstorage
                if(response.success && user){
                    dispatch(
                        setUserAndToken({
                            user:{_id: user._id, userName: user.userName, email: user.email},
                            accessToken: tokens.accessToken,
                            refereshToken: tokens.refereshToken
                        })
                    )
                    showSnackbar('card.signin.success', 'success');
                    console.log('User signed in successfully', response);
                    navigate('/upcomingEvents');
                }
                else{
                    showSnackbar(`Error signing in: ${response.message}`, 'error');
                    console.error('Error signing in: ', response.message);
                }
            }
        }
        catch(err){
            showSnackbar('card.server.error', 'error');
            console.error('Unexpected error during sign-in:',err);
        }
    };

  // JSX structure of the login component
    return (
        <>
        {/* Styling for body background */}
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
            {/* Main container for sign-in */}
        <Container maxWidth='xl' sx={{ display: 'flex' }}>
            {/* Lottie animation container */}
            <Container maxWidth="lg" sx={{ marginLeft: "auto", marginRight: 20, marginTop: 5 }}>
            { View }
            </Container>
        {/* Sign-in form container */}
        <Container maxWidth="xs" sx={{ marginLeft: 'auto', marginRight: 0 }} >
            <CssBaseline/>
            {/* Slide animation for sign-in form */}
            <Slide direction="right" in={open} mountOnEnter unmountOnExit>
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
                    {/* Avatar for the login icon */}
                    <Avatar sx={{ m: 1, bgcolor: "rgba(1, 181, 98, 0.8)"}}>
                        <VpnKeyOutlined/>
                    </Avatar>
                    {/*Login Title */}
                    <Typography variant="h5">{t('card.login')}</Typography>
                    <Box sx={{mt: 1}}>
                        {/* Email TextField */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={t('card.login.emailLbl')}
                            autoFocus={!open}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => validateField('email',email)}
                            error={!!emailError}
                            helperText={emailError}
                            InputLabelProps={{
                                style: {
                                    color: 'black', 
                                },
                            }}
                            />
                        {/* Password TextField */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            label={t('card.login.passLbl')}
                            autoFocus={!open}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => validateField('password',password)}
                            error={!!passwordError}
                            helperText={passwordError}
                            InputLabelProps={{
                                style: {
                                    color: 'black', // Label color
                                },
                            }}
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
                            {/* Forgot Password link */}
                            <Grid container justifyContent="flex-start">
                                <Grid item>
                                    <Link to="/forgotpassword">{t('card.login.link.forgotpass')}</Link>
                                </Grid>
                            </Grid>
                        {/* Sign-in Button */}
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, 
                                mb: 2,
                                bgcolor: 'rgba(1, 181, 98, 0.8)',
                                '&:hover': {
                                    backgroundColor: 'rgba(29, 211, 126, 0.8)', 
                                },
                                transition: 'background-color 0.3s',
                            }}
                            onClick={handleSignIn}
                            disabled={isSignInButtonDisabled}
                            >
                                {t('card.login.button.submit')}
                            </Button>
                            {/* Sign-up link */}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                            <Link to="/signup">{t('card.login.link.signup')}</Link>
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
}
// Exporting the SignIn component as the default export
export default SignIn;