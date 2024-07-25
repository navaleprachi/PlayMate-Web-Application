import express from "express";

import * as eventController from '../controllers/event-controller.js';

const router = express.Router();

// Route to save a new event
router.route('/')
    .post(eventController.saveNewEvent);

// Route to update & delete the event by providing the event id
router.route('/:id')
    .put(eventController.updateEvent)
    .delete(eventController.deleteEvent);
    
// Route to update the main event & child events by providing the event id
router.route('/multiple/:id')
    .put(eventController.updateMultipleEvents);

router.route('/upcomingEvents/:sport/:city').get(eventController.fetchAllEvents);

router.route('/eventHistory/:userId').get(eventController.fetchUserEvents);

export default router;