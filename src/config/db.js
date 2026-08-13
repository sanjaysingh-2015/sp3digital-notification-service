const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'sp3digital_notification',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Set to console.log to see raw SQL queries
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connection established successfully via Sequelize.');
    
    // Automatically creates or alters tables matching models
    await sequelize.sync({ alter: true });
    console.log('Sequelize Models synchronized with Database.');
  } catch (error) {
    console.error('Unable to connect to MySQL database:', error.message);
  }
}

module.exports = { sequelize, initDB };

// async function initDB() {
//   const connection = await pool.getConnection();
//   try {
//     // Create Table for MySQL
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS social_analyses (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         platform VARCHAR(50) NOT NULL,
//         message_id VARCHAR(100),
//         sender VARCHAR(255),
//         content TEXT,
//         sentiment VARCHAR(20),
//         keywords VARCHAR(255),
//         analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS industries (
//         id BIGINT PRIMARY KEY AUTO_INCREMENT,
//         code VARCHAR(20) NOT NULL,
//         name VARCHAR(100) NOT NULL,
//         status VARCHAR(20),
//         created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
//         created_by VARCHAR(255),
//         modified_on DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         modified_by VARCHAR(255)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS leads_messages (
//         id BIGINT PRIMARY KEY AUTO_INCREMENT,
//         industry_id BIGINT,
//         company VARCHAR(200),
//         expected_timeline VARCHAR(100),
//         first_name VARCHAR(60),
//         last_name VARCHAR(60),
//         email VARCHAR(256),
//         phone_number VARCHAR(20),
//         current_challenge VARCHAR(200),
//         additional_info TEXT,
//         status VARCHAR(20),
//         created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
//         created_by VARCHAR(255),
//         modified_on DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         modified_by VARCHAR(255),
//         CONSTRAINT fk_leads_industry FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE SET NULL
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
//     `);
//     console.log("MySQL Database Initialized & Schema Ready.");
//   } finally {
//     connection.release();
//   }
// }

// module.exports = { pool, initDB };
