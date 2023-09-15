import React, { useLayoutEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './assets/css/index.css';
import MainLayOut from './views/layouts/MainLayout';
import { useCookies } from 'react-cookie';
import { useUserStore } from './stores';

function App() {
  const [cookies, setCookies] = useCookies();
  const { user, setUser } = useUserStore();

  useLayoutEffect(() => {
    if (cookies.token) {
      let user = localStorage.getItem('userStore') as string;
      if (user) {
        setUser(JSON.parse(JSON.parse(user).state.user));
      }
    } else {
      localStorage.removeItem('userStore');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayOut />} />
        {/* <Route path='/login' element={<Login />} />
        <Route path='/join' element={<Join />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
