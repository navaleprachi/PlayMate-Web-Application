import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SavePaymentSchema = new Schema({
    nameOnCard: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    createdDate: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: String,
        required: true
    },
    CVV: {
        type: String,
        required: true
    }
    ,
    userID: {
        type: String,
        required: true,
    }
},
{
    versionKey: false
});

const SavePayment = mongoose.model('savePayment', SavePaymentSchema);
export default SavePayment;