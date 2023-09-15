import React, { useEffect, useState } from 'react';
import Navigation from '../../Navigation';
import BookList from '../../book';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { callApiBookList } from '../../../apis';

export default function BookMain() {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [bookList, setBookList] = useState<string>('');

  const getBook = async (token: string) => {
    try {
      const res = await callApiBookList();
      setBookList(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) navigate('/');
      }
    }
  };

  useEffect(() => {
    const token = cookies.token;
    if (token) getBook(token);
    else setBookList('');
  }, [cookies.token]);

  return (
    <>
      <Navigation />
      {bookList && <BookList />}
    </>
  );
}
