import sql from 'mssql';

let dbConfig = {
  user: 'Azriy',
  password: '12345678',
  server: '192.168.0.18', // Default IP address
  database: 'Pointly',
  options: {
    encrypt: true, // Enable for Azure or encrypted connections
    trustServerCertificate: true, // Necessary for self-signed certificates
  },
};

// Create a connection pool
let connectionPool;

const connectDB = async () => {
  try {
    console.log('Initial DB configuration:', dbConfig);

    // Ensure only one connection pool is created
    if (!connectionPool) {
      console.log('Initializing new connection pool...');
      connectionPool = await sql.connect(dbConfig);
      console.log('Connected to the database successfully');
    } else {
      console.log('Using existing connection pool');
    }

    return connectionPool;
  } catch (err) {
    console.error('Database connection error:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    throw err;
  }
};

// Function to dynamically change the server IP
const changeDbServer = (newIp) => {
  console.log('Changing database server to:', newIp);
  dbConfig = {
    ...dbConfig,
    server: newIp,
  };
  console.log('Updated DB configuration:', dbConfig);

  // Reset the connection pool to use the new server
  connectionPool = null;
};

// Export connection and helper functions
export { sql, connectDB, changeDbServer };
