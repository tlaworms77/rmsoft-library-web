import React, { useEffect, useState } from 'react';
import { Alert, AlertColor, Box, Button, Modal, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useUserStore } from '../../stores';
import {
  callApiAddBook,
  callApiBookList,
  callApiBorrowBook,
  callApiBorrowBookList,
  callApiReturnBook,
  callApiUpdateBook,
} from '../../apis';
import { BASE_URL } from '../../constants';

const columns: GridColDef[] = [
  { field: 'bookNo', headerName: '도서번호', width: 80 },
  {
    field: 'bookTitle',
    headerName: '도서제목',
    width: 150,
    // editable: true,
  },
  {
    field: 'bookAuthor',
    headerName: '저자',
    width: 100,
    // editable: true,
  },
  {
    field: 'bookPublish',
    headerName: '출판사',
    width: 110,
    // editable: true,
  },
  {
    field: 'bookPublishDt',
    headerName: '출판일',
    width: 80,
  },
  {
    field: 'bookPrice',
    headerName: '가격',
    type: 'number',
    width: 80,
  },
  {
    field: 'bookLocation',
    headerName: '도서위치',
    type: 'number',
    width: 80,
  },
  {
    field: 'borrowYn',
    headerName: '대출가능유무',
    type: 'number',
    width: 100,
  },
];

const borrowListColumns: GridColDef[] = [
  { field: 'bookNo', headerName: '도서번호', type: 'number', width: 60 },
  { field: 'historySq', headerName: '이력번호', type: 'number', width: 60 },
  { field: 'borrowUserId', headerName: '대출자ID', width: 100 },
  { field: 'borrowUserName', headerName: '대출자', width: 100 },
  {
    field: 'borrowDt',
    headerName: '대출일자',
    width: 100,
    valueFormatter: ({ value }) => StringToDate(new Date(value)),
  },
  {
    field: 'returnDt',
    headerName: '반납일자',
    width: 100,
    valueFormatter: ({ value }) => (value ? StringToDate(new Date(value)) : ''),
  },
];

const StringToDate = (dt: Date) => {
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const date = dt.getDate();

  return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
};

export default function BookList() {
  const { user, setUser } = useUserStore();
  const [cookies] = useCookies();
  const [openAddBook, setOpenAddBook] = useState<boolean>(false);
  const [bookList, setBookList] = useState([]);
  const [snackbarType, setSnackbarType] = useState<AlertColor>('warning');
  const [snackbar, setSnackbar] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [selectedRow, setSelectedRow] = useState<any>({});

  // Modal
  const [mode, setMode] = useState<string>();
  const [bookTitle, setBookTitle] = useState<string>();
  const [bookAuthor, setBookAuthor] = useState<string>();
  const [bookPublish, setBookPublish] = useState<string>();
  const [bookPublishDt, setBookPublishDt] = useState<string>();
  const [bookPrice, setBookPrice] = useState<number>();
  const [bookLocation, setBookLocation] = useState<string>();
  const [bookImg, setBookImg] = useState<string | Blob>('');
  const [bookImgBase64, setBookImgBase64] = useState<string>();
  //대출처리
  const [openBorrow, setOpenBorrow] = useState<boolean>(false);
  const [borrowUserId, setBorrowUserId] = useState<string>();
  //대출이력
  const [openBorrowList, setOpenBorrowList] = useState<boolean>(false);
  const [borrowList, setBorrowList] = useState([]);

  useEffect(() => {
    readBookList();
  }, []);

  const readBookList = async () => {
    try {
      if (!cookies.token) {
        setUser(null);
      }

      const res = await callApiBookList();
      setBookList(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        setUser(null);
      }
    }
  };

  const onRowsSelectionHandler = (ids: any) => {
    const selectedRowsData = ids.map((id: number) => bookList.find((row: any) => row.bookNo === id));
    if (selectedRowsData.length > 0) {
      setSelectedRow(selectedRowsData[0]);
      setBookImgBase64(selectedRowsData[0].fileImage);
      setBookImg('');
    }
  };
  const handleSearch = async () => {
    setBookList([]);
    setSelectedRow({});
    await readBookList();
  };

  const handleOpenAddBook = (mode: string) => {
    if (mode === 'update') {
      if (!selectedRow || !selectedRow?.bookNo) {
        showSnackBar('그리드 행을 선택해주세요', 'warning');
        return;
      }
    }
    setMode(mode);
    if (mode === 'update') {
      setBookTitle(selectedRow.bookTitle);
      setBookAuthor(selectedRow.bookAuthor);
      setBookPublish(selectedRow.bookPublish);
      setBookPublishDt(selectedRow.bookPublishDt);
      setBookPrice(selectedRow.bookPrice);
      setBookLocation(selectedRow.bookLocation);
      let path = '';
      if (selectedRow.filePath) {
        path = selectedRow.fileImage;
      }
      setBookImgBase64(path as any);
      setBookImg('');
    } else {
      setBookTitle('');
      setBookAuthor('');
      setBookPublish('');
      setBookPublishDt('');
      setBookPrice(0);
      setBookLocation('');
      setBookImgBase64('');
      setBookImg('');
    }
    setOpenAddBook(true);
  };
  const handleCloseAddBook = () => {
    setOpenAddBook(false);
  };

  const handleAddBook = async () => {
    try {
      if (!cookies.token) return;

      const formData = new FormData();
      formData.append('file', bookImg);
      formData.append('fileImage', bookImgBase64 as any);
      formData.append('bookTitle', bookTitle as any);
      formData.append('bookAuthor', bookAuthor as any);
      formData.append('bookPublish', bookPublish as any);
      formData.append('bookPublishDt', bookPublishDt as any);
      formData.append('bookPrice', bookPrice as any);
      formData.append('bookLocation', bookLocation as any);
      if (mode === 'update') {
        formData.append('bookNo', selectedRow.bookNo as any);
        formData.append('borrowYn', selectedRow.borrowYn as any);
      }

      const res = mode === 'add' ? await callApiAddBook(formData) : await callApiUpdateBook(formData);
      const { data, result, message } = res;

      if (!result) {
        showSnackBar(message, 'error');
        return;
      }

      readBookList();

      handleCloseAddBook();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        if (!cookies.token) {
          setUser(null);
        }
      }
    }
  };

  // 대출이력현황 모달
  const handleOpenBorrowList = async () => {
    try {
      if (!selectedRow || !selectedRow?.bookNo) {
        showSnackBar('그리드 행을 선택해주세요', 'warning');
        return;
      }

      if (!cookies.token) {
        setUser(null);
        return;
      }

      const params = { bookNo: selectedRow.bookNo };
      const res = await callApiBorrowBookList(params);
      const { data, result, message } = res;
      if (!result) {
        showSnackBar(message, 'error');
        return;
      }

      setBorrowList(data ?? []);
      setOpenBorrowList(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        if (!cookies.token) {
          setUser(null);
        }
      }
    }
  };

  // 대출처리 모달
  const handleOpenBorrowBook = () => {
    if (!selectedRow || !selectedRow?.bookNo) {
      showSnackBar('그리드 행을 선택해주세요', 'warning');
      return;
    }
    setOpenBorrow(true);
  };
  //대출처리
  const handleBorrow = async () => {
    try {
      if (!cookies.token) {
        setUser(null);
        return;
      }

      const params = {
        bookNo: selectedRow.bookNo,
        userId: borrowUserId,
      };
      const res = await callApiBorrowBook(params);
      const { data, result, message } = res;
      if (!result) {
        showSnackBar(message, 'error');
        return;
      }
      handleSearch();
      setOpenBorrow(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        if (!cookies.token) {
          setUser(null);
        }
      }
    }
  };

  //대출처리
  const handleReturnBook = async () => {
    try {
      if (!selectedRow || !selectedRow?.bookNo) {
        showSnackBar('그리드 행을 선택해주세요', 'warning');
        return;
      }

      if (!cookies.token) {
        setUser(null);
        return;
      }

      const params = {
        bookNo: selectedRow.bookNo,
        userId: borrowUserId,
      };

      const res = await callApiReturnBook(params);
      const { data, result, message } = res;
      if (!result) {
        showSnackBar(message, 'error');
        return;
      }
      handleSearch();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        if (!cookies.token) {
          setUser(null);
        }
      }
    }
  };

  const showSnackBar = (message: string, type: AlertColor = 'warning') => {
    setWarningMessage(message);
    setSnackbarType(type);
    setSnackbar(true);
  };
  const handleSnackBarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar(false);
  };

  const handleChangeFile = (e: any) => {
    if (e.target.files.length === 0) return;
    setBookImg(e.target.files[0]);
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      const base64 = reader.result; // 비트맵 데이터 리턴, 이 데이터를 통해 파일 미리보기가 가능함
      if (base64) {
        let base64Sub: string = base64.toString();
        setBookImgBase64(base64Sub);
      }
    };
  };

  return (
    <>
      <Box>
        <Stack direction='row' spacing={1} sx={{ mb: 1 }} position={'absolute'} right={0}>
          <Button size='medium' onClick={handleSearch}>
            도서조회
          </Button>
          <Button size='medium' onClick={() => handleOpenAddBook('add')}>
            도서등록
          </Button>
          <Button size='medium' onClick={() => handleOpenAddBook('update')}>
            도서수정
          </Button>
          <Button size='medium' onClick={handleOpenBorrowList}>
            대출이력
          </Button>
          <Button size='medium' onClick={handleOpenBorrowBook}>
            대출처리
          </Button>
          <Button size='medium' onClick={handleReturnBook}>
            반납처리
          </Button>
        </Stack>
        <Box>
          <Typography variant='h6'># 도서현황 (*참고: 그리드의 행 선택 후 진행부탁드립니다.)</Typography>
        </Box>
        <DataGrid
          autoHeight
          getRowId={(row: any) => row.bookNo}
          rows={bookList}
          columns={columns}
          rowSelection
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        />
      </Box>
      <Modal
        open={openAddBook}
        onClose={handleCloseAddBook}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ width: 1200, height: 600, margin: 15, background: 'white', position: 'relative' }}>
          <Box
            sx={{ position: 'absolute', width: 1000, height: 460, top: '10%', left: '10%', margin: '-25px 0 0 -25px' }}
          >
            <h2 id='parent-modal-title'>{mode === 'add' ? <>도서 등록</> : <>도서 수정</>}</h2>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1, border: 'solid 1px black', marginRight: '40px', padding: '10px' }}>
                <img src={bookImgBase64} width={'469px'} height={'350px'} alt='도서이미지' />
              </div>
              <div style={{ flex: 1.5 }}>
                <TextField
                  fullWidth
                  required
                  label='도서제목'
                  type='text'
                  variant='standard'
                  inputProps={{ maxLength: 12 }}
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                />
                <TextField
                  fullWidth
                  required
                  label='저자'
                  type='text'
                  variant='standard'
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                />
                <TextField
                  fullWidth
                  required
                  label='출판사'
                  type='text'
                  variant='standard'
                  value={bookPublish}
                  onChange={(e) => setBookPublish(e.target.value)}
                />
                <TextField
                  fullWidth
                  required
                  label='출판일자'
                  type='text'
                  variant='standard'
                  value={bookPublishDt}
                  onChange={(e) => setBookPublishDt(e.target.value)}
                />
                <TextField
                  fullWidth
                  required
                  label='도서가격'
                  type='number'
                  variant='standard'
                  value={bookPrice}
                  onChange={(e) => setBookPrice(Number(e.target.value))}
                />
                <TextField
                  fullWidth
                  required
                  label='도서위치'
                  type='text'
                  variant='standard'
                  value={bookLocation}
                  onChange={(e) => setBookLocation(e.target.value)}
                />
                <Button fullWidth variant='contained' component='label' style={{ marginTop: '10px' }}>
                  도서 업로드 파일
                  <input type='file' hidden onChange={handleChangeFile} />
                </Button>
              </div>
            </div>
            <br />
            <div style={{ textAlign: 'right' }}>
              <Button variant='contained' onClick={handleAddBook}>
                {mode === 'add' ? <>등록</> : <>수정</>}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openBorrow}
        onClose={() => setOpenBorrow(false)}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ width: 300, height: 200, margin: 25, background: 'white', position: 'relative', left: '20%' }}>
          <Box
            sx={{ position: 'absolute', width: 250, height: 250, top: '10%', left: '10%', margin: '-10px 0 0 -10px' }}
          >
            <h2 id='parent-modal-title'>대출 처리</h2>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <TextField
                  fullWidth
                  required
                  label='대출자의 아이디를 입력해주세요'
                  type='text'
                  variant='standard'
                  value={borrowUserId}
                  onChange={(e) => setBorrowUserId(e.target.value)}
                />
              </div>
            </div>
            <br />
            <div style={{ textAlign: 'right' }}>
              <Button variant='contained' onClick={handleBorrow}>
                대출처리
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openBorrowList}
        onClose={() => setOpenBorrowList(false)}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ width: 600, height: 500, margin: 15, background: 'white', position: 'relative', left: '20%' }}>
          <Box
            sx={{ position: 'absolute', width: 550, height: 460, top: '10%', left: '10%', margin: '-25px 0 0 -25px' }}
          >
            <h2 id='parent-modal-title'>대출이력현황 [ {selectedRow?.bookTitle} ]</h2>
            <DataGrid
              style={{ maxHeight: 380 }}
              getRowId={(row: any) => row.bookNo + '/' + row.historySq}
              rows={borrowList}
              columns={borrowListColumns}
              rowSelection
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
            />
          </Box>
        </Box>
      </Modal>
      <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleSnackBarClose}>
        <Alert onClose={handleSnackBarClose} severity={snackbarType} sx={{ width: '100%' }}>
          {warningMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
