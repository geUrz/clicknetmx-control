import mysql from 'mysql2/promise'

// Configura la conexión a la base de datos
const connection = mysql.createPool({
  host: 'autorack.proxy.rlwy.net',   
  port: 14849,   
  user: 'root',           
  password: 'QaVxvYyAGSZVoAbfcHTpTQJzBMqBnNtf',    
  database: 'railway',  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default connection   

/* import mysql from 'mysql2/promise';

// Configura la conexión a la base de datos
const connection  = mysql.createPool({
  host: 'localhost',   
  user: 'root',           
  password: 'root',  
  database: 'clicknetmxcontrol', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection   */ 

