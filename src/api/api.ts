import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://compra-eficiente-api-production.up.railway.app/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@compra_eficiente_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@compra_eficiente_token');
    }
    return Promise.reject(error);
  },
);

export default api;

// Auth
export const authApi = {
  login: (firebaseToken: string) =>
    api.post('/auth/login', { firebaseToken }),
};

// Users
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: object) => api.put('/users/profile', data),
  getSettings: () => api.get('/users/settings'),
  updateSettings: (data: object) => api.put('/users/settings', data),
};

// Products
export const productsApi = {
  searchByBarcode: (barcode: string) => api.get('/products/barcode/' + barcode),
  search: (query: string, category?: string) =>
    api.get('/products/search', { params: { q: query, category } }),
  getById: (id: string) => api.get('/products/' + id),
};

// Markets
export const marketsApi = {
  getAll: (lat?: number, lng?: number) =>
    api.get('/markets', { params: { lat, lng } }),
  getById: (id: string) => api.get('/markets/' + id),
  search: (query: string) => api.get('/markets/search', { params: { q: query } }),
  create: (data: object) => api.post('/markets', data),
};

// Purchases
export const purchasesApi = {
  getAll: () => api.get('/purchases'),
  getById: (id: string) => api.get('/purchases/' + id),
  create: (data: object) => api.post('/purchases', data),
  getInflationReport: () => api.get('/purchases/inflation'),
};

// Community
export const communityApi = {
  getPrices: (params?: {
    productId?: string;
    marketId?: string;
    city?: string;
  }) => api.get('/community/prices', { params }),
  reportPrice: (data: {
    productId: string;
    marketId?: string;
    price: number;
    shareAnonymously: boolean;
  }) => api.post('/community/prices', data),
  getAveragePrices: (productId: string) =>
    api.get('/community/prices/' + productId + '/average'),
  getPriceHistory: (productId: string, marketId?: string) =>
    api.get('/community/prices/' + productId + '/history', { params: { marketId } }),
};
