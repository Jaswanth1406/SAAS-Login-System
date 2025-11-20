import jwt from 'jsonwebtoken';
import pool from '../db.js';

export default async function auth(req , res , next){

    const header = req.headers.authorization;
    if(!header) return res.status(401).json({message: "Authorization header missing"});

    const token = header.split(" ")[1];
    if(!token) return res.status(401).json({message: "Token missing"});

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        // Check if token has been revoked
        const revoked = await pool.query('SELECT 1 FROM revoked_tokens WHERE token = $1 LIMIT 1', [token]);
        if(revoked.rows.length){
            return res.status(401).json({message: "Token revoked"});
        }

        req.user = decoded;
        next();
    }catch(err){
        console.error('Auth middleware error:', err);
        return res.status(401).json({message: "Invalid token"});
    }
}