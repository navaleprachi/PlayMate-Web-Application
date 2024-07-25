import jwt from 'jsonwebtoken';
import User from '../models/user.js';


const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

    if(!token) {
        res.status(401).json({
            succes: false,
            message: 'Unauthorized access: Token is missing',
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        const user = await User.findById(decoded.userId);

        if(!user){
            res.status(401).json({
                success: false,
                message: 'Unauthorized access: Inavlid token',
            });
        }

        req.user = user;
        next();
    }
    catch(err){
        res.status(401).json({
            success: false,
            message: 'Unauthorized access: Inavlid token',
        })
    }
}

export default authenticateUser;