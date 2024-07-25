import { request, response } from 'express';
import * as savePaymentService from '../services/save-payment-service.js';
import { setErrorResponse, setResponse } from './response-handler.js';

export const saveNewPayment = async (request,response) => {
    try {
    const newCardDetails = { ...request.body }; // Taking in the request bod
    console.log(newCardDetails);
    const savePayment =  await savePaymentService.savePaymentMethod(newCardDetails);
    console.log(savePayment);
    setResponse(savePayment, response); // Setting the response
} catch (err) {
   setErrorResponse(err, response); // If error occurs set the error details
   //response.status(500).json({message: err.message});
}
}
export const findSavedPayments = async (request,response) => {
    try {
    const savePayment =  await savePaymentService.getAllCards();
    setResponse(savePayment, response); // Setting the response
} catch (err) {
    setErrorResponse(err, response); // If error occurs set the error details
}
}

//method to delete a blog post
export const deleteCard = async(request,response) => {
    try {
        const savePayment =  await savePaymentService.deleteCard(request.params._id);
        setResponse(blog, response); // Setting the response
    } catch (err) {
        //setErrorResponse(err, response); // If error occurs set the error details
        response.status(500).json({message: err.message});
    }
}
//method to update a blog post
// export const updateCard = async(request,response) => {
//     try {
//         const cardNumber = {...request.body.cardNumber};
//         const newCardDetails = {...request.body}
//         const savePayment = new savePaymentService.updateCard(cardNumber,updatedDetails);
//         setResponse(blog, response); // Setting the response
//     } catch (err) {
//         setErrorResponse(err, response); // If error occurs set the error details
//     }
// }