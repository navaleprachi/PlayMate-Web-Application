import * as userAuthService from '../services/userAuth-service.js'; //Import the user authentication service.


export const registerUser = async (req, res) => {
    // res.send("Register User route") For testing purpose
    try{
        //Extracting new User data from the request body.
        const newUser = {...req.body};
        //Save the new User in the document
        const user = await userAuthService.saveUser(newUser);
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (err){
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const login = async (req, res) => {
    // res.send("Login User route") For testing purpose 
    try{
        //Extract email and password from the request body
        const {email,  password} = req.body;
        //Authenticate the user credentials.
        const user = await userAuthService.loginUser(email, password);

        if(!user){
            //If access fails respond with unauthorized error
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        await userAuthService.flagUserLoggedIn(user._id);

        //Generate access and referesh tokens
        const tokens = userAuthService.generateTokens(user._id);

        //Set authentication header with access token
        res.header('Authorization', `Bearer ${tokens.accessToken}`);

        //Set the referesh token as cookie 
        res.cookie('refereshToken', tokens.refereshToken, { httpOnly: true});

        //Respond with the success message and the tokens
        res.status(200).json({
            success: true,
            tokens,
            user
        });

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const logout = async (req, res) => {
    try {
        //Extract userId from the request body
        const userId = req.user._id;
        //Calling the function to flag the user as logged out
        await userAuthService.flagUserLoggedOut(userId);
        //Clear the referesh token cookie in the response
        res.clearCookie('refereshToken');
        //Respond with the success message
        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const forgotPassword = async (req, res) => {
    try{
        //Extract email from the request body
        const { email } = req.body;

        //Check if the email is provided in the request
        if(!email){
            res.status(400).json({
                succes: false,
                message: 'Email is required'
            });
        }
        //Call the forgotPassword method from the service layer
        const resResult = await userAuthService.forgotPassword(email);
        //Check the result object if it return true and handle the success object
        if(resResult.succes){
            res.status(200).json({
                success: true,
                message: 'Reset Link sent successfully',
            });
        }
        else{
            res.status(404).json({
                success: false,
                message: 'User does not exist with this email address',
            })
        }
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

export const resetPassword = async (req, res) => {
    try{
        const { resetToken, newPassword} = req.body;

        //Verify the reset token and get the userId
        const userId = await userAuthService.verifyResetToken(resetToken);

        console.log("User Id: ", userId);

        //Update the user's password in the database
        await userAuthService.updatePassword(userId, newPassword);

        res.status(200).json({
            success: true,
            message: "Password reset successful",
        })
    }
    catch(err){
        res.status(401).json({
            success: false,
            message: err.message,
        })
    }
}


export const refereshAccessToken = async(req, res) => {
    try{
        //Extract the refereshtoken from the request body
        const {refereshToken} = req.body;
        //Generate new access token based on the refereshtoken provided
        const newAccessToken = userAuthService.getRefereshAccessToken(refereshToken);

        //Respond with success message and the new access token
        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        })
    }
    catch(err){
        res.status(401).json({
            success: false,
            message: err.message
        });
    }
}