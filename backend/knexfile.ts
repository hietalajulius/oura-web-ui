    
const MIGRATIONS_PATH = 'src/db/migrations';
const SEEDS_PATH = 'src/db/seeds';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/health_app',
    migrations: {
      directory: MIGRATIONS_PATH
    },
    seeds: {
      directory: SEEDS_PATH
    }
  }
};