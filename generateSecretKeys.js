import crypto from 'crypto'; //Importing the crypto library for cryptographic functionalities

const resetSecretTokenLen = 32; // Length of the secret token for resetting the passwords
//Generating a random secret token for resetting passwords
const resetSecretToken = crypto.randomBytes(resetSecretTokenLen).toString('hex');

//Function to generate a random secret of a sepcified length
function generateRandomSecret(len){
    return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len);
}

//Genrating random secret for access and referesh tokens
const accessTokenSecret = generateRandomSecret(64);
const refereshTokenSecret = generateRandomSecret(64);

console.log("Access Token Secret ", accessTokenSecret);
console.log("Referesh Token Secret ", refereshTokenSecret);
console.log("Reset Token Secret ", resetSecretToken);