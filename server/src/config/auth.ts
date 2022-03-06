export enum role {
  HOME_CUSTOMER = 1,
  BUSINESS_CUSTOMER = 2,
  ADMIN = 99
}

/**
 * users except admins: LOG_IN_MAIN, BROWSE_PRODUCTS, READ_COMMENTS, BUY_PRODUCTS, MAKE_COMMENTS
 * admins: all except BUY_PRODUCTS, MAKE_COMMENTS
 */
export enum access {
  LOG_IN_MAIN = 1, // log in main page
  BROWSE_PRODUCTS = 2,
  READ_COMMENTS = 3,
  BUY_PRODUCTS = 4,
  MAKE_COMMENTS = 5,
  // admin access below
  LOG_IN_ADMIN = 11, // log in admin system 
  ACCESS_BUSSINESS_DATA = 12,
  ACCESS_REGION_DATA = 13,
  ACCESS_STORE_DATA = 14,
  BROWSE_PRODUCTS_ADMIN = 15,
  BROWSE_USERS_ADMIN = 16,
  BROWSE_ORDERS_ADMIN = 17,
  BROWSE_TRANSACTIONS_ADMIN = 18,
  ADD_USER = 19,
  UPDATE_USER = 20,
}

export enum auth {
  DIPPER_ID = 1,
}