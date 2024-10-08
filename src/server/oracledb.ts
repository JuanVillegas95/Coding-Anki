import oracledb from 'oracledb';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

let pool: oracledb.Pool | undefined; // Keep track of the connection pool

// Create the connection pool (only if it hasn't been created yet)
async function createPool(): Promise<void> {
  if (!pool) {
    try {
      pool = await oracledb.createPool({
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        connectString: process.env.CONNECT_STRING as string,
        walletPassword: process.env.WALLET_PASSWORD || undefined, // Optional
        walletLocation: process.env.WALLET_LOCATION || undefined, // Optional
        httpsProxy: process.env.HTTPS_PROXY || undefined, // Optional
        httpsProxyPort: process.env.HTTPS_PROXY_PORT
          ? Number.parseInt(process.env.HTTPS_PROXY_PORT)
          : undefined, // Optional
        poolMax: 10,
        poolMin: 0,
      });
      console.log('Connection pool created successfully.');
    } catch (error) {
      console.error('Error creating connection pool:', error);
      throw error;
    }
  }
}

// Get a connection from the pool
async function getConnection(
  options: any = {}
): Promise<oracledb.Connection> {
  await createPool();
  try {
    const connection = await pool!.getConnection({
      ...options,
    });
    return connection;
  } catch (error) {
    console.error('Error getting connection:', error);
    throw error;
  }
}

// Export the functions for use in other files
export { getConnection, createPool };
