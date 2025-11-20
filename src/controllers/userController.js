import pool from '../db.js';

export async function getMe(req , res){
    try{
        const result = await pool.query(
            "SELECT id , name , email , created_at FROM users WHERE id = $1" ,
            [req.user.id]
        );
        res.json(result.rows[0]); 
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
}

export async function getLogs(req , res) {
    try{
        const logs = await pool.query(
            "SELECT login_at FROM audit_logs WHERE user_id = $1 ORDER BY login_at DESC LIMIT 5" ,
            [req.user.id]
        );
        res.json(logs.rows);
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
}