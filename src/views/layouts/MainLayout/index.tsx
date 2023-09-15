import React from 'react';
import Navigation from '../../Navigation';
import Authentication from '../../authentication';
import BookList from '../../book';
import { useUserStore } from '../../../stores';

export default function MainLayOut() {
  const { user } = useUserStore();

  return (
    <>
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
