import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import { validateSignUp } from "../utils/validator.js";

export async function signUp(req , res){
    const {name , email , password} = req.body;

    const errors = validateSignUp({name , email , password});
    if(errors.length) return res.status(400).json({errors});

    try{
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1" , [email]);
        if(existingUser.rows.length) {
            return res.status(400).json({message: "Email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const newUser = await pool.query(
            "INSERT INTO users (name , email , password) VALUES ($1 , $2 , $3) RETURNING id , name , email" ,
            [name , email , hashedPassword]
        );

        res.status(201).json({message:"Signup success",user: newUser.rows[0]});
    }catch(err){
        console.error('Signup error:', err);
        res.status(500).json({message: "Server error"});
    }
}

export async function login(req , res){
    const {email , password} = req.body;

    try{
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1" , [email]);
        if(userResult.rows.length === 0){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const token = jwt.sign({id: user.id , email: user.email} , process.env.JWT_SECRET , {expiresIn: "1h"});

        await pool.query(
            "INSERT INTO audit_logs (user_id) VALUES ($1)" ,
            [user.id]
        );

        res.status(200).json({message: "Login success" , token
            , user: {id: user.id , name: user.name , email: user.email}});
    }catch(err){
        console.error('Login error:', err);
        res.status(500).json({message: "Server error"});
    }
}

export async function logout(req, res) {
    try{
        const header = req.headers.authorization;
        if(!header) return res.status(401).json({message: "Authorization header missing"});

        const token = header.split(' ')[1];
        if(!token) return res.status(401).json({message: "Token missing"});

        const decoded = jwt.decode(token);
        const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

        await pool.query(
            "INSERT INTO revoked_tokens (token, expires_at) VALUES ($1, $2) ON CONFLICT (token) DO NOTHING",
            [token, expiresAt]
        );

        res.status(200).json({message: "Logged out successfully"});
    }catch(err){
        console.error('Logout error:', err);
        res.status(500).json({message: "Server error"});
    }
}