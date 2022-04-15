export default {
  SERVER_URL: process.env.REACT_APP_ENVIRONMENT == 'production'
    ? 'http://www.transmeetpitt.com'
    : (process.env.REACT_APP_ENVIRONMENT == 'local'
      ? 'https://10.0.0.154:3000'
      : 'http://localhost:3000'
    ),
  
}