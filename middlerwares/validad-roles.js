const { response } = require("express");
const pool = require('../database');

const adminRol = async (req, res=response, next)=>{
    const email = req.email;
    if(!req.email){
        return res.status(500).json({
            msg: 'se quiere verificar el rol sin generar el token'
        })
    }

    const query = 'SELECT * FROM administradores WHERE email = ?'
    const result = await pool.query(query, [email]);
    

    if(result[0].length < 0){
        return res.status(400).redirect('/')
    }
    
    next();

}


module.exports = adminRol;