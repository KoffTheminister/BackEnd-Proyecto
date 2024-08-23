import mysql from 'mysql2/promise'

export const pool = mysql.createPool({  /* mantener varias conecciones al mismo tiempo en espera de que se vayan a utilizar */
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'nachin',
    password: process.env.DB_PASSWORD || 'ik12345ik',
    database: process.env.DB_NAME || 'libertant',  //estas cuatro lineas son la info minima para establecer la conexion
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
})
