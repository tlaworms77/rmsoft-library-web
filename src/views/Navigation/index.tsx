import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Person } from '@mui/icons-material';
import { useUserStore } from '../../stores';
import { useCookies } from 'react-cookie';

export default function Navigation() {
  const [cookies, setCookies] = useCookies();
  const { user, removeUser } = useUserStore();

  const handleLogout = () => {
    setCookies('token', '', { expires: new Date() });
    removeUser();
    localStorage.removeItem('userStore');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            도서관리 시스템
          </Typography>
          {user ? (
            <IconButton color='inherit' onClick={handleLogout}>
              <Person /> {user?.userName}
            </IconButton>
          ) : (
            <Button color='inherit'>Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
