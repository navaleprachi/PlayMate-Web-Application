// Importing necessary dependencies
import { ReactElement, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useLottie } from "lottie-react";
import signUpAnimation from '../../assets/SignUpPage.json';
import { setUser } from "../../store/slices/signUp-slice";
import * as userAuthService from '../../services/userAuth-service';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Slide, TextField, Typography, Snackbar,InputAdornment, IconButton} from "@mui/material";
import { HowToRegOutlined} from "@mui/icons-material";
import { Link } from "react-router-dom";
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import backgroundImg from '../../assets/background.jpg';
import NavbarSign from "../NavBar/NavBarBeforeSignUp";
import { useTranslation } from "react-i18next";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setUserAndToken } from "../../store/slices/signIn-slice";
import { useNavigate } from "react-router-dom";

// SignUp component
const SignUp: React.FC = (): ReactElement => {
    // Hooks and state management
    const {t} = useTranslation('common');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const[open, setOpen] = useState<boolean>(true);
    const[userName, setUsername] = useState<string>('');
    const[email, setEmail] = useState<string>('');
    const[password, setPassword] = useState<string>('');
    const[passwordError, setPasswordError] = useState<string>('');
    const[emailError, setEmailError] = useState<string>('');
    const[isSignUpButtonDisabled, setIsSignUpButtonDisabled] = useState<boolean>(true);
    const[showPassword, setshowPassword] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    // Lottie animation options
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: signUpAnimation,
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
    // Function to validate password format
    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!#*`~]).{8,}$/;
        return passwordRegex.test(password);
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
        }
        else if(field === 'email' && !validateEmail(value)){
            setEmailError(t('card.email.invalid'))
        }
        else if(field === 'password' && !validatePassword(value)){
            if(!(/[!@#$%^&*(),.?":{}|<>]/.test(value))){
                setPasswordError(t('card.pass.sp.error'))
            }
            else if(!(/\d/.test(value))){
                setPasswordError(t('card.pass.nm.error'))
            }
            else if(!(/[A-Z]/.test(value))){
                setPasswordError(t('card.pass.up.error'))
            }
            else if(!(/[a-z]/.test(value))){
                setPasswordError(t('card.pass.lw.error'))
            }
        }
        else if(field === 'email' && !validateEmail(value)){
            setEmailError(t('card.email.invalid'));
        }
        else{
            setEmailError('');
            setPasswordError('');
        }
    }

    // Effect to reset errors and update button disabled state
    useEffect(() => {
        setEmailError("");
        setPasswordError("")
        const isFormComplete = userName && email && password;
        setIsSignUpButtonDisabled(!isFormComplete);   
    },[userName, email, password]);

     // Function to handle sign-up
    const handleSignUp = async () => {
        try{
            //Validate email and password
            validateField('email', email);
            validateField('password',password);
            console.log(email);
            console.log(userName);
            console.log(password);

            // If no errors create a userData and hit the register user service and set the user in redux state
            if(!emailError && !passwordError){
                const userData = {userName, email,password};

                const response = await userAuthService.registerUser(userData);

                dispatch(setUser(response.user));

                //If response is success after registeration, login and redirect to create profil page for profile creation
                if(response.success){
                    const userCredentials = {email, password}
                    const signInResponse = await userAuthService.loginUser(userCredentials);
                    showSnackbar('card.signup.success', 'success');
                    console.log('User registered successfully: ', response.user);
                    //If the signin response is successful and user object is present then set the user and tokens in redux state and localstorage
                    if(signInResponse.success && signInResponse.user){
                        dispatch(
                            setUserAndToken({
                                user: { _id: signInResponse.user._id, userName: signInResponse.user.userName, email: signInResponse.user.email },
                                accessToken: signInResponse.tokens.accessToken,
                                refereshToken: signInResponse.tokens.refereshToken,
                            })
                        )    
                        navigate(`/profile/${signInResponse.user._id}`);   
                    }
                    else{
                        showSnackbar(`Error signing in after registration: ${signInResponse.message}`, 'error');
                        console.error('Error signing in after registration: ', signInResponse.error);
                    }
                    
                }
                else{
                    showSnackbar(`Error registering the user: ${response.message}`, 'error');
                    console.error('Error registering the user: ', response.error);
                }
            }
        }
        catch(err){
            showSnackbar('card.server.error.signup', 'error');
            console.error('Unexpected error during registration:', err);
        };
    }
        // JSX structure of the Sign Up component
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
                        // background: linear-gradient(to right, #00cc66, #99ffcc);
                        background-image: url(${backgroundImg});
                        background-size: cover;
                        background-repeat: no-repeat;
                    }
                `}
            </style>
            {/* Navbar component  */}
            <NavbarSign/>
            {/* Main container for sign-up */}
            <Container maxWidth='xl' sx={{ display: 'flex'}}>
                {/* Lottie animation container */}
                <Container maxWidth="lg" sx={{ marginLeft: "auto", marginRight: 20}}>
                    {View} 
                </Container>
                {/* Sign-up form container */}
                <Container maxWidth="xs" sx={{ marginLeft: 'auto', marginRight: 0 }}>
                    <CssBaseline/>
                    {/* Slide animation for sign-up form */}
                    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                    {/* Box container for sign-up form */}
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
                            {/* Avatar for the Registration icon */}
                            <Avatar sx={{m: 1, bgcolor: "rgba(1, 181, 98, 0.8)"}}>
                                <HowToRegOutlined/>
                            </Avatar>
                            {/* Registration Title */}
                            <Typography variant="h5">{t('card.signup')}</Typography>                           
                            <Box sx={{mt: 3, width: "100%"}}>
                                <Grid item xs={12}>
                                    {/* UserName TextField */}
                                    <TextField
                                        name="userName"
                                        required
                                        fullWidth
                                        id="userName"
                                        label={t('card.userName')}
                                        autoFocus={!open}
                                        value={userName}
                                        onChange={(e) => setUsername(e.target.value)}
                                        sx={{ mb: 2 }}
                                        InputLabelProps={{
                                            style: {
                                                color: 'black', // Label color
                                            },
                                        }}
                                        />
                                </Grid>
                                <Grid item xs={12}>
                                     {/* Email TextField */}
                                    <TextField
                                        name="email"
                                        required
                                        fullWidth
                                        id="email"
                                        label={t('card.login.emailLbl')}
                                        autoFocus={!open}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => validateField('email', email)}
                                        error={!!emailError}
                                        helperText={emailError}
                                        sx={{ mb: 2 }}
                                        InputLabelProps={{
                                            style: {
                                                color: 'black', // Label color
                                            },
                                        }}
                                        />
                                </Grid>
                                <Grid item xs={12}>
                                    {/* Password TextField */}
                                    <TextField
                                        name="password"
                                        required
                                        fullWidth
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        label={t('card.login.passLbl')}
                                        autoFocus={!open}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => validateField('password', password)}
                                        error={!!passwordError}
                                        helperText={passwordError}
                                        sx={{ mb: 2 }}
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
                                </Grid>
                                {/* Sign-up Button */}
                                <Button 
                                    fullWidth
                                    variant="contained"
                                    sx={{mt:3, 
                                        mb: 2,
                                        bgcolor: 'rgba(1, 181, 98, 0.8)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(29, 211, 126, 0.8)', 
                                        },
                                        transition: 'background-color 0.3s', 
                                    }}
                                    onClick={handleSignUp}
                                    disabled={isSignUpButtonDisabled}
                                    >
                                    {t('card.signup.button.submit')}
                                </Button>
                                {/* Sign-in link */}
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link to="/signin">{t('card.signin.link')}</Link>
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
        );
    }
// Exporting the SignUp component as the default export
export default SignUp;