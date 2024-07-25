import mongoose from "mongoose";
import { DateTime } from "luxon";

const Schema = mongoose.Schema;

// Event Schema with all the required fiields
const EventSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    placeId: {
        type: String,
        required: true
    },
    dateOfBooking: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    playerCount: {
        type: Number,
        required: true
    },
    sport: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        required: false,
        default: false
    },
    isPrimaryUser: {
        type: Boolean,
        required: false,
        default: false
    },
    city: {
        type: String,
        required: true
    },
    parentEventId: {
        type: String,
        required: false,
        default: ""
    }
},
    {
        versionKey: false
    });

// Exporting the model created
const EventModel = mongoose.model('event', EventSchema);
export default EventModel;