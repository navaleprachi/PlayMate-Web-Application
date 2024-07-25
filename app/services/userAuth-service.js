import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../../emailConfig.js';

//Sign Up: Create and save a new user
export const saveUser = async (newUser) => {
    try{
        console.log('Received login request:', { newUser }); //Done for testing purpose
        //Creating a new User instance with the provided data
        const user = new User(newUser);
        //Save the user to the database
        await user.save();

        await sendRegisterEmail(user.email, user.userName);
        return user;
    }
    catch(err){
        throw new Error(err.message);
    }


}

//Sign In: Authenticate user credentials and return the user object
export const loginUser = async(email, password) => {
    console.log('Received login request:', { email, password }); //Done for testing purpose
    // Find the user by email and include the password in the selection
    const user = await User.findOne({ email }).select('+password');

    // If no user is found, throw an error
    if(!user){
        throw new Error("Invalid email or password");
    }

    //Check if the user entered password matches the stored hashed password
    const isPasswordMatch = await user.comparePasswords(password);

    //If password does not match throw an error
    if(!isPasswordMatch){
        throw new Error("Invalid email or password")
    }

    //Return the authenticated user
    return user;
}

//Function to find User by Email
export const findUserByEmail = async(email) => {
    return await User.findOne({ email });
}

//Function to genarate resetToken
export const generateResetToken = (userId) => {
    const resetToken = jwt.sign({userId: userId}, process.env.RESET_SECRET_TOKEN,{ expiresIn: '15m' });
    return resetToken;
    // return crypto.randomBytes(32).toString('hex');
}

//Function to Update the reset token and expiration date in the database
export const updateResetToken = async (userId, resetToken, resetExpireDate) => {
    await User.findByIdAndUpdate(userId, {
        resetPasswordToken: resetToken,
        resetPasswordExpireDt: resetExpireDate,
    });
}

//Function to verufy the reset token and get the userId
export const verifyResetToken = (resetToken) => {
    try{
        // console.log(' Reset Token:', resetToken);
        // console.log('Reset Secret Token:', process.env.RESET_SECRET_TOKEN);
        const decoded = jwt.verify(resetToken, process.env.RESET_SECRET_TOKEN);
        // console.log('Decoded Reset Token:', decoded);
        return decoded.userId;
    }
    catch(err){
        throw new Error('Invalid reset token')
    }
}

//Function to update the users password in the database
export const updatePassword = async (userId, newPassword) => {
    //Generating the salt and hashing the new password
    const salt =  await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    //Updating the newpassword into the database.
    await User.findByIdAndUpdate(userId, {
        password: hashedPass,
        resetPasswordToken: null,
        resetPasswordExpireDt: null,
    });
}

//Function to get the reset password - (for testing purpose)
export const sendResetPassword = async(email, resetToken) => {
    console.log(`Reset password email sent to ${email}, Reset Token: ${resetToken}`);
}
//Function to handle the forgot password service
export const forgotPassword = async (email) => {
    try{
        //Find the user by email
        const user = await findUserByEmail(email);
        //If the user is not found, return err object.
        if(!user){
            return {success: false};
        }

        //Generate a reset token for the user and set the expiration date
        const resetToken = generateResetToken(user._id);
        const resetExpireDate = new Date();
        resetExpireDate.setMinutes(resetExpireDate.getMinutes() + 15);

        //Update the user's reset token in the database
        await updateResetToken(user._id,resetToken, resetExpireDate);

        //Send the reset password token to users email address
        await sendResetPasswordLink(email, resetToken);

        //Return the success object
        return {succes: true};
    }
    catch(err){
        throw new Error(err.message);
    }
}

//Funcrtion to send welcome email to newly registered user
export const sendRegisterEmail = async (email, userName) => {
    try{
        // Define the content of the welcome email
        const mail = {
            from: 'nilrajmayekar@gmail.com',
            to: email,
            subject: 'Welcome to PlayMate',
            html: `<html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to PlayMate</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 8px 32px 0 rgba(0, 0, 0, 0.37);">
            
                <h2 style="color: #008000;">Welcome to PlayMate!</h2>
            
                <p style="font-size: 16px;">Dear ${userName},</p>
                
                <p style="font-size: 16px;">Thank you for signing up to PlayMate App! We are excited to have you on board.</p>
            
                <p style="font-size: 16px;">If you have any questions or need assistance, feel free to contact us.</p>
            
                <p style="font-size: 16px;">Best regards,<br>PlayMate Team</p>
            
              </div>
            
            </body>
            </html>`,
        };

        //Send the welcome email using the configured transporter
        await transporter.sendMail(mail);
        //Return true after successfully sending the email
        return true;
    }
    catch(err){
        throw new Error(err.message);
    }
}
//Function to send a reset password email to the user's email address
export const sendResetPasswordLink = async (email, resetToken) => {
    try{
        //Construct the reset link using the reset token - (To be done in the future)
        const resetLink = `http://localhost:3001/resetpassword/${resetToken}`;
        //Define the content for the reset password email link
        const mail = {
            from: 'nilrajmayekar@gmail.com',
            to: email,
            subject: 'Reset password request',
            html: `<p>You have requested to reset your password. Please click on the following link:</p>
            <a href="${resetLink}" target="_blank">${resetLink}</a>`,
        };
        //Send the reset email using the configured transporter
        await transporter.sendMail(mail);
        //Return true after successfully sending the email
        return true;
    }
    catch(err){
        throw new Error(err.message);
    }
}


//Generate access and referesh token
export const generateTokens = (userId) => {
    //Sign an access token with some expiration time and referesh token with no expiration time
    const accessToken = jwt.sign({userId}, process.env.ACCESS_SECRET_TOKEN, {expiresIn: '30m'});
    const refereshToken = jwt.sign({userId}, process.env.REFERESH_SECRET_TOKEN);

    //Return both access and referesh token
    return {accessToken, refereshToken};
}

//For getting the accessToken on providing refereshToken
export const getRefereshAccessToken = (refereshToken) => {
    try{
        //Verify the referesh token and decode the userId
        const decoded = jwt.verify(refereshToken, process.env.REFERESH_SECRET_TOKEN);
        //Sign a new access token with the decode userId
        const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_SECRET_TOKEN, {expiresIn: '15m'});
        //Return the new access token
        return accessToken;
    }
    catch(err){
        throw new Error('Invalid referesh Token');
    }
};

//function to flag the user as logged in
export const flagUserLoggedIn = async (userId) => {
    //Updating the user's loggedin status
    await User.findByIdAndUpdate(userId, { isLoggedIn: true });
}

//Function to flag a user as logged out
export const flagUserLoggedOut = async (userId) => {
    //Update the user's loggedin status
    await User.findByIdAndUpdate(userId, {isLoggedIn: false });
}



