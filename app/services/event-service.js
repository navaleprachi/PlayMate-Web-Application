import transporter from '../../emailConfig.js';
import Event from '../models/event.js';
import User from '../models/user.js';
// Method to save a new event
export const saveEvent = async (newEvent) => {
    const event = new Event(newEvent);
    await event.save();
    await sendBookingEmail(event);
    return event;
}

// Method to update event details like time slot, date etc.
export const updateEvent = async (id, updatedEvent) => {
    const event = await Event.findByIdAndUpdate(id, updatedEvent, { new: true }).exec();
    return event;
}

//Method to get all events
export const getAllEvents = async (sport, city) => {

    const events = await Event.find({ sport, city }).exec();
    // const formattedEvents = events.map(ev => ev.toObject({ getters: true }));

    // console.log(formattedEvents);
    return events;
}

export const sendBookingEmail = async (eventInfo) => {
    try {
        const user = await User.findById(eventInfo.userId);
        console.log(user);
        const mail = {
            from: 'nilrajmayekar@gmail.com',
            to: user.email,
            subject: 'Booking Confirmation',
            html: `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Event Booking Confirmation</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                    }
                    header {
                        background-color: #4CAF50;
                        color: #fff;
                        text-align: center;
                        padding: 1em;
                    }
                    section {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        background-color: #fff;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    li {
                        margin-bottom: 10px;
                    }
                    footer {
                        text-align: center;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h1>Event Booking</h1>
                </header>
                <section>
                    <p>Hello ${user.userName},</p>
                    <p>Your booking for the  event at ${eventInfo.name} has been confirmed. Here are the details:</p>
            
                    <ul>
                        <li><strong>Date:</strong> ${eventInfo.dateOfBooking}</li>
                        <li><strong>Time Slot:</strong>${eventInfo.timeSlot} </li>
                        <li><strong>Number of Players:</strong> ${eventInfo.playerCount}</li>
                        <li><strong>Sport:</strong> ${eventInfo.sport}</li>
                        <li><strong>Location:</strong> ${eventInfo.location}</li>
                        <li><strong>City:</strong> ${eventInfo.city}</li>
                    </ul>
            
                    <p>Thank you for choosing ${eventInfo.name} for your ${eventInfo.sport} event. We look forward to more bookings from you!</p>
            
                    <p>Best Regards,<br>Playmate Team</p>
                </section>
            </body>
            </html>`
        };

        await transporter.sendMail(mail);
        return true;
    }
    catch (err) {
        throw new Error(err.message);
    }
}

export const getUserEvents = async (userId) => {
    console.log(userId);
    const events = await Event.find({ userId: userId }).exec();
    console.log(events);
    return events;
}

// Method to update Multiple event details like time slot, date, etc.
export const updateMultipleEvents = async (id, updatedEvent) => {
    // Constructing a query to find events with the given ID or parentEventId
    const query = {
        $or: [
            { _id: id },
            { parentEventId: id }
        ]
    };

    // Updating multiple events that match the query with the provided details
    const events = await Event.updateMany(
        query,
        { $set: updatedEvent }
    );

    return "Events updated successfully";
}

export const deleteEvent = async (id) => {
    // Constructing a query to find events with the given ID or parentEventId
    const query = {
        $or: [
            { _id: id },
            { parentEventId: id }
        ]
    };

    // Deleting multiple events (and their children) that match the query
    const res = await Event.deleteMany(query);

    return "Events deleted successfully";
}
