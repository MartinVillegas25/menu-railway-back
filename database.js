const mysql = require('mysql2/promise');


//equivalente a create connection, conecto a la base de datos


const config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
}

const pool = mysql.createPool(config, ()=>{
    console.log('base de datos conectada')
});


  

module.exports = pool;