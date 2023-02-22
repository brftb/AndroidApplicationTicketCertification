const port = 3000;

const dbConfig = {
  host: 'db-container',
  user: 'root',
  password: 'password',
  database: 'sk31'
};

module.exports = {
  port,
  dbConfig
};