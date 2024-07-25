import SavePayment from '../models/save-payments.js';

// Method to save a payment option
export const savePaymentMethod = async (newCard) => {
    const savePayment = new SavePayment(newCard);
    console.log(newCard, "from service");
    console.log(savePayment,"fromserv");
    return await savePayment.save();
}

//method to delete a blog post
export const deleteCard = async(cardNumber) => {
    return await SavePayment.findByIdAndDelete(cardNumber).exec();
}
//method to update a blog post
// export const updateCard = async(cardNumber,updatedDetails) => {
//     const savePayment = await SavePayment.findByIdAndUpdate(cardNumber , updatedDetails, { new: true }).exec();
//     return savePayment;
//}
export const getAllCards = async () => {
    const cards = await SavePayment.find().exec();
    console.log(cards);
    return cards;
}
