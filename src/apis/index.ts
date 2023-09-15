import axios from 'axios';

export const loginApi = async (params: any) => {
  try {
    const response = await axios.post('http://localhost:4040/api/auth/login', params);
    return response.data;
  } catch (error) {
    console.error('loginApi Error: ', error);
    return null;
  }
};

export const joinApi = async (params: any) => {
  try {
    const response = await axios.post('http://localhost:4040/api/auth/join', params);
    return response.data;
  } catch (error) {
    console.error('joinApi Error: ', error);
    return null;
  }
};
