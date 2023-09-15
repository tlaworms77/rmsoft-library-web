import { Alert, AlertColor, Box, Button, Card, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../stores';
import { AuthViewProps } from '..';
import { loginApi } from '../../../apis';

export default function Login({ setAuthView }: AuthViewProps) {
  const navigage = useNavigate();

  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const [cookies, setCookies] = useCookies();

  const { user, setUser } = useUserStore();

  const [snackbarType, setSnackbarType] = useState<AlertColor>('warning');
  const [snackbar, setSnackbar] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const showSnackBar = (message: string, type: AlertColor = 'warning') => {
    setWarningMessage(message);
    setSnackbarType(type);
    setSnackbar(true);
  };

  const handleLogin = async () => {
    try {
      if (userId.length === 0 || userPassword.length === 0) {
        showSnackBar('이메일과 비밀번호를 입력해주십시오.', 'warning');
        return;
      }

      const params = {
        userId,
        userPassword,
      };

      const resultLoginApi = await loginApi(params);

      const { result, message, data } = resultLoginApi;

      //에러 result = null || false
      if (!result) {
        // 로그인 실패
        showSnackBar(message, 'error');
        return;
      }

      // 가져온 jwt 토큰 쿠키에 저장
      // 쿠키에 만료시간 저장
      const { token, exprTime, user } = data;
      const expires = new Date();
      expires.setMilliseconds(expires.getMilliseconds() + exprTime);
      setCookies('token', token, { expires });
      //user 를 store에 저장 // 외부에서 관리
      setUser(user);

      // navigage('/bookList');
    } catch (err) {
      showSnackBar('로그인에 실패하였습니다.', 'error');
    }
  };

  const handleSnackBarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar(false);
  };

  return (
    <>
      <Card sx={{ minWidth: 313, maxWidth: '50vw', padding: 5 }}>
        <Box>
          <Typography variant='h5'>로그인</Typography>
        </Box>
        <Box height={'54vh'}>
          <TextField
            fullWidth
            required
            label='아이디'
            variant='standard'
            inputProps={{ maxLength: 20 }}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <TextField
            fullWidth
            required
            label='비밀번호'
            type='password'
            variant='standard'
            inputProps={{ maxLength: 15 }}
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </Box>

        <Box width={'100%'}>
          <Button fullWidth variant='contained' onClick={() => handleLogin()}>
            로그인
          </Button>
        </Box>
        <Box component={'div'} display={'flex'} mt={2}>
          <Typography>신규 사용자 이신가요?</Typography>
          <Typography fontWeight={800} ml={1} onClick={() => setAuthView(true)}>
            회원가입
          </Typography>
        </Box>

        <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleSnackBarClose}>
          <Alert onClose={handleSnackBarClose} severity={snackbarType} sx={{ width: '100%' }}>
            {warningMessage}
          </Alert>
        </Snackbar>
      </Card>
    </>
  );
}
