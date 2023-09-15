import axios from 'axios';
import {
  BASE_URL,
  LIST_BOOK_URL,
  JOIN_URL,
  LOGIN_URL,
  ADD_BOOK_URL,
  UPDATE_BOOK_URL,
  BORROW_URL,
  RETURN_URL,
  BORROW_LIST_URL,
} from '../constants';

//쿠키 값 가져오는 함수
function get_cookie(name = 'token') {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  console.log(value);
  return value ? value[2] : null;
}

const AuthorizationJWT = {
  Authorization: `Bearer ${get_cookie()}`,
};

const client = axios.create({
  baseURL: BASE_URL,
  headers: { ...AuthorizationJWT },
});

const clientMultipart = axios.create({
  baseURL: BASE_URL,
  headers: { ...AuthorizationJWT, ContentType: 'multipart/form-data;' },
});

export const callApiBookList = async (params?: any) => {
  try {
    const response = await client.get(LIST_BOOK_URL, params);
    return response.data;
  } catch (error) {
    console.error('loginApi Error: ', error);
    return null;
  }
};

export const callApiAddBook = async (params: any) => {
  try {
    const response = await clientMultipart.post(ADD_BOOK_URL, params);
    return response.data;
  } catch (error) {
    console.error('loginApi Error: ', error);
    return null;
  }
};

export const callApiUpdateBook = async (params: any) => {
  try {
    const response = await clientMultipart.post(UPDATE_BOOK_URL, params);
    return response.data;
  } catch (error) {
    console.error('loginApi Error: ', error);
    return null;
  }
};

export const callApiBorrowBookList = async (params: any) => {
  try {
    const response = await client.post(BORROW_LIST_URL, params);
    return response.data;
  } catch (error) {
    console.error('loginApi Error: ', error);
    return null;
  }
};
export const callApiBorrowBook = async (params: any) => {
  try {
    const response = await client.post(BORROW_URL, params);
    return response.data;
  } catch (error) {
    console.error('loginApi Error: ', error);
    return null;
  }
};
export const callApiReturnBook = async (params: any) => {
  try {
    const response = await client.post(RETURN_URL, params);
    return response.data;
  } catch (error) {
    console.error('loginApi Error: ', error);
    return null;
  }
};

export const loginApi = async (params: any) => {
  try {
    const response = await client.post(LOGIN_URL, params);
    return response.data;
  } catch (error) {
    console.error('loginApi Error: ', error);
    return null;
  }
};

export const joinApi = async (params: any) => {
  try {
    const response = await client.post(JOIN_URL, params);
    return response.data;
  } catch (error) {
    console.error('joinApi Error: ', error);
    return null;
  }
};
