const sql = import('mssql');

const dbConfig = {
  user: 'your-username',
  password: 'your-password',
  server: 'localhost', // replace with your SQL Server address
  database: 'RewardLoyaltySystem',
  options: {
    encrypt: true, // Use this option if you're connecting to Azure
    trustServerCertificate: true, // Change to true for local dev servers
  },
};

const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

module.exports = { sql, connectDB };
