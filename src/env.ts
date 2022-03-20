export default {
  BASE_URL: process.env.REACT_APP_ENVIRONMENT == 'production' ? 'http://www.transmeetpitt.com' 
  : process.env.REACT_APP_ENVIRONMENT == 'production' ? 'http://10.215.23.201:3000' : 'http://localhost:3000',
}