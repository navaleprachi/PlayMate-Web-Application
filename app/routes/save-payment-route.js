import express from "express";

import * as savePaymentController from '../controllers/save-payment-controller.js';

const router = express.Router();

// Routes for saving and fetching the blogs
router.route('/')
    .post(savePaymentController.saveNewPayment)
    .get(savePaymentController.findSavedPayments);

router.route('/:cardID')
    .delete(savePaymentController.deleteCard);

export default router;