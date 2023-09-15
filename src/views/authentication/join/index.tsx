import Box from '@mui/material/Box';
import { Alert, AlertColor, Button, Snackbar, TextField, Typography } from '@mui/material';

import Card from '@mui/material/Card';

import React, { useState } from 'react';
import AlertDialog from '../../../components/dialog/AlertDialog';
import { AuthViewProps } from '..';
import { joinApi } from '../../../apis';

export default function Join({ setAuthView }: AuthViewProps) {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordCheck, setUserPasswordCheck] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userAddressDetail, setUserAddressDetail] = useState('');

  const [snackbarType, setSnackbarType] = useState<AlertColor>('warning');
  const [snackbar, setSnackbar] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const [show, setShow] = useState(false);

  const showSnackBar = (message: string, type: AlertColor = 'warning') => {
    setWarningMessage(message);
    setSnackbarType(type);
    setSnackbar(true);
  };

  // 필수입력 데이터 검증
  const isExistedVerify = () => {
    if (!userId) {
      showSnackBar('아이디는 필수입력사항입니다.');
      return false;
    }
    if (!userPassword) {
      showSnackBar('비밀번호는 필수입력사항입니다.');
      return false;
    }
    if (!userPassword) {
      showSnackBar('비밀번호는 필수입력사항입니다.');
      return false;
    }
    if (!userPasswordCheck) {
      showSnackBar('비밀번호 확인은 필수입력사항입니다.');
      return false;
    }
    if (!userName) {
      showSnackBar('이름은 필수입력사항입니다.');
      return false;
    }
    if (!userPhoneNumber) {
      showSnackBar('휴대폰번호는 필수입력사항입니다.');
      return false;
    }
    if (!userAddress || !userAddressDetail) {
      showSnackBar('주소는 필수입력사항입니다.');
      return false;
    }
    return true;
  };

  //비밀번호 검증
  const verifyPassword = () => {
    if (userPassword !== userPasswordCheck) {
      showSnackBar('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleJoin = async () => {
    try {
      if (!isExistedVerify()) return;

      if (!verifyPassword()) return;

      const params = {
        userId,
        userPassword,
        userPasswordCheck,
        userName,
        userEmail,
        userPhoneNumber,
        userAddress,
        userAddressDetail,
      };

      // 회원가입 진행
      const resultJoinApi = await joinApi(params);

      const { result, message, data } = resultJoinApi;
      //에러 result = null || false
      if (!result) {
        showSnackBar(message, 'error');
        return;
      }

      setShow(true);
    } catch (err) {
      console.log('fail: ', err);
    }
  };

  const handleSnackBarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar(false);
  };

  return (
    <Card sx={{ minWidth: 378, maxWidth: '26vw', padding: 5 }}>
      <Box>
        <Typography variant='h5'>회원가입</Typography>
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
        <TextField
          fullWidth
          required
          label='비밀번호 확인'
          type='password'
          variant='standard'
          inputProps={{ maxLength: 15 }}
          value={userPasswordCheck}
          onChange={(e) => setUserPasswordCheck(e.target.value)}
        />
        <TextField
          fullWidth
          required
          label='이름'
          variant='standard'
          inputProps={{ maxLength: 30 }}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          fullWidth
          required
          label='이메일'
          type='email'
          variant='standard'
          inputProps={{ maxLength: 50 }}
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <TextField
          fullWidth
          required
          label='휴대폰'
          type='tel'
          variant='standard'
          inputProps={{ maxLength: 11 }}
          value={userPhoneNumber}
          onChange={(e) => setUserPhoneNumber(e.target.value)}
        />
        <TextField
          fullWidth
          required
          label='주소'
          variant='standard'
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <TextField
          fullWidth
          required
          label='상세주소'
          variant='standard'
          value={userAddressDetail}
          onChange={(e) => setUserAddressDetail(e.target.value)}
        />
      </Box>

      <Box>
        <Button fullWidth variant='contained' onClick={handleJoin}>
          회원 가입
        </Button>
      </Box>
      <Box component={'div'} display={'flex'} mt={2}>
        <Typography>이미 계정이 있으신가요?</Typography>
        <Typography fontWeight={800} ml={1} onClick={() => setAuthView(false)}>
          로그인
        </Typography>
      </Box>

      <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleSnackBarClose}>
        <Alert onClose={handleSnackBarClose} severity={snackbarType} sx={{ width: '100%' }}>
          {warningMessage}
        </Alert>
      </Snackbar>
      <AlertDialog show={show} message='회원가입이 완료되었습니다.' callback={() => setAuthView(false)} />
    </Card>
  );
}
