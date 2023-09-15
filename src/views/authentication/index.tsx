import React, { useState } from 'react';
import Join from './join';
import { Box, Typography } from '@mui/material';
import Login from './login';
// import image from '../../assets/images/main.jpg';
import image from '../../assets/images/conifers.jpg';

export interface AuthViewProps {
  setAuthView: (authView: boolean) => void;
}

export default function Authentication() {
  // authView : true -> loginView
  // authView : false -> joinView
  const [authView, setAuthView] = useState<boolean>(false);
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <Box display='flex' height={'100vh'}>
          <Box flex={1} display='flex' justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
            <Box>
              <Typography fontWeight={600} variant='h1' color={'white'}>
                도서관리 시스템
              </Typography>
            </Box>
            <Box marginBottom={50}>
              <Typography fontWeight={400} variant='h2' color={'white'}>
                Solution1
              </Typography>
            </Box>
          </Box>
          <Box flex={1} display='flex' justifyContent={'center'} alignItems={'center'}>
            {authView ? <Join setAuthView={setAuthView} /> : <Login setAuthView={setAuthView} />}
          </Box>
        </Box>
      </div>
    </>
  );
}
