import React, { useEffect, useState } from 'react';
import Navigation from '../../Navigation';
import Authentication from '../../authentication';
import BookList from '../../book';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useUserStore } from '../../../stores';

export default function MainLayOut() {
  // const navigate = useNavigate();
  // const [cookies] = useCookies();
  const { user } = useUserStore();

  // const [bookList, setBookList] = useState<string>('');

  // const getBook = async (token: string) => {
  //   try {
  //     const requestOptions = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };

  //     const res = await axios.get('http://localhost:4040/api/book/list', requestOptions);

  //     setBookList(res.data);
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       if (error.response?.status === 403) navigate('/');
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const token = cookies.token;
  //   if (token) getBook(token);
  //   else setBookList('');
  // }, [cookies.token]);

  return (
    <>
      {/* <Navigation /> */}
      {user ? (
        <>
          <Navigation />
          <BookList />
        </>
      ) : (
        <Authentication />
      )}
    </>
  );
}
