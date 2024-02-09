module.exports = {
    development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: 'pegXm5T46sH1',
      database: 'ps-store'
    },
    migrations: {
      tableName: 'migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
