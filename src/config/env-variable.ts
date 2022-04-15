export default {
  SERVER_URL: process.env.REACT_APP_ENVIRONMENT == 'production'
    // ? 'http://www.transmeetpitt.com'
    ? 'https://3.16.38.107:3000'
    : (process.env.REACT_APP_ENVIRONMENT == 'local'
      ? 'https://10.0.0.154:3000'
      : 'http://localhost:3000'
    ),
  
}