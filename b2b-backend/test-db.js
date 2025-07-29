const mysql = require('mysql2/promise');

async function testConnection() {
  let connection;
  
  try {
    console.log('Attempting to connect to MySQL...');
    
    // Try different connection options
    const connectionOptions = [
      // Option 1: No password
      {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mysql'
      },
      // Option 2: With password
      {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'mysql'
      },
      // Option 3: Default MySQL user
      {
        host: 'localhost',
        user: 'mysql',
        password: '',
        database: 'mysql'
      }
    ];
    
    for (const options of connectionOptions) {
      try {
        console.log(`Trying connection with user: ${options.user}, password: ${options.password ? 'YES' : 'NO'}`);
        connection = await mysql.createConnection(options);
        console.log('Connection successful with options:', options);
        await connection.end();
        return;
      } catch (error) {
        console.log(`Connection failed: ${error.message}`);
      }
    }
    
    console.log('All connection attempts failed.');
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testConnection(); 