import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? (Constants.manifest as any)?.extra ?? {};

const API_BASE_URL =
  process.env.API_BASE_URL ||
  extra.API_BASE_URL ||
  'http://172.31.144.1/api';

export default {
  API_BASE_URL,
};
