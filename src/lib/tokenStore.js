const ACCESS_KEY = "access_token";
const REFRESH_KEY = "rf_token";

export const TokenStore = {
  getAccessToken() {
    return sessionStorage.getItem(ACCESS_KEY);
  },

  setAccessToken(token) {
    sessionStorage.setItem(ACCESS_KEY, token);
  },

  getRefreshToken() {
    return sessionStorage.getItem(REFRESH_KEY);
  },

  setRefreshToken(token) {
    sessionStorage.setItem(REFRESH_KEY, token);
  },

  clear() {
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
  },

  isLoggedIn() {
    return !!this.getRefreshToken();
  },
};