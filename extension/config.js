const CONFIG = {
    DEBUG: true, 
    API_URL_DEV: "http://localhost:5000",
    API_URL_PROD: "https://dein-echter-server-oder-cloud-dienst.com"
};

export const API_URL = CONFIG.DEBUG ? CONFIG.API_URL_DEV : CONFIG.API_URL_PROD;