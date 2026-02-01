import * as sql from 'mssql';

// Configuração do Azure SQL Database
const config: sql.config = {
  server: process.env.SQL_SERVER || '',
  database: process.env.SQL_DATABASE || 'NatureQuestDB',
  authentication: {
    type: 'azure-active-directory-default',
    options: {
      clientId: process.env.AZURE_CLIENT_ID,
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Connection pool
let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
    console.log('Connected to Azure SQL Database');
  }
  return pool;
}

export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Disconnected from Azure SQL Database');
  }
}

// Helper para executar queries
export async function query<T>(sqlQuery: string, params?: sql.ParameterOptions[]): Promise<T[]> {
  const conn = await getConnection();
  const request = conn.request();
  
  if (params) {
    params.forEach((param, index) => {
      request.input(`param${index}`, param);
    });
  }
  
  const result = await request.query<T>(sqlQuery);
  return result.recordset;
}

// Helper para executar stored procedures
export async function executeProcedure<T>(
  procedureName: string,
  params?: { name: string; value: unknown; type?: sql.ISqlType }[]
): Promise<T[]> {
  const conn = await getConnection();
  const request = conn.request();
  
  if (params) {
    params.forEach((param) => {
      request.input(param.name, param.type || sql.NVarChar, param.value);
    });
  }
  
  const result = await request.execute<T>(procedureName);
  return result.recordset;
}
