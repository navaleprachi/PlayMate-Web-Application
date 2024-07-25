import eventRouter from './event-route.js';
import userAuthRouter from './userAuth-route.js';
import arenaRouter from './arena-route.js';
import blogRouter from './blog-route.js';
import personalizedProfileRouter from './peronalizedProfile-route.js';
import savePaymentRouter from './save-payment-route.js';
import chatRouter from './chat-route.js';
import messageRouter from './message-route.js';
import chatBotRouter from './chatBot-route.js';

// Configure the app the use the routes defined
export default (app) => {
    app.use('/events', eventRouter);
    app.use('/auth', userAuthRouter);
    app.use('/arenas', arenaRouter);
    app.use('/blogs', blogRouter);
    app.use('/personalizedProfile', personalizedProfileRouter);
    app.use('/savePayment',savePaymentRouter);
    app.use('/chats', chatRouter);
    app.use('/messages',messageRouter);
    app.use('/chatBot', chatBotRouter);
    app.use('/savePayment',savePaymentRouter);
   
}