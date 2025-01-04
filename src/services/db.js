import sql from 'mssql';

let dbConfig = {
  user: 'Dani',
  password: '12345678',
  server: '192.168.0.22', // ensure this IP is used
  database: 'Pointly',
  options: {
    encrypt: true,
    trustServerCertificate: true, // trust server for local dev
  },
};

const connectDB = async () => {
  try {
    console.log('Initial DB config:', dbConfig);
    
    // Log the server IP address before connecting
    console.log('Attempting to connect to IP:', dbConfig.server);

    await sql.connect(dbConfig);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection error:', err);
    if (err.code) {
      console.log('Error code:', err.code);
    }
    throw err;
  }
};

// Function to dynamically change the server IP (example of modification)
const changeDbServer = (newIp) => {
  console.log('Changing DB server to:', newIp);
  dbConfig = {
    ...dbConfig,
    server: newIp,
  };
  console.log('Updated DB config:', dbConfig);
};

export { sql, connectDB, changeDbServer };
