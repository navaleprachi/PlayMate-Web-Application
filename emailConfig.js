import nodemailer from 'nodemailer'; //Importing the nodemailer library for sending emails

//Creating a transporter object using the nodemailer library
const transporter = nodemailer.createTransport({
    //Configuring the transporter to use the Gmail services
    service: 'gmail',
    auth: {
        //Providing the email account credentials for authentication
        user: 'nilrajmayekar@gmail.com',
        pass: 'zudm zjfw mazd wtok',
    }
});

export default transporter;