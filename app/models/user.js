import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

//Define user schema with the required fields
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Provide a username']
    },
    email: {
        type: String,
        required: [true, 'Provide a email'],
        unique: true,
        //Use regex pattern to enforce a valid email format
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Provide a password'],
        minlength: 6,
        //Ensure that the password is not returned by default
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpireDt: Date,
    isLoggedIn: {
        type: Boolean,
        default: false,
    }
});

//Middleware to hash the password before saving it to the database
UserSchema.pre("save", async function(next){
    //Check if password is modified before hashing
    if(!this.isModified("password")){
        //If not move to the next middleware
        next();
    }

    //Generate salt and hash the password using bycrypt
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

//Method to compare the entered password with the stored hashed password
UserSchema.methods.comparePasswords = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//Creating the user model
const UserModel = mongoose.model('user', UserSchema );
export default UserModel;