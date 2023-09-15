import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, CircularProgress } from '@mui/material';

export default function LoadingDialog({ showLoading, message }: { showLoading: boolean; message: string }) {
  return (
    <div>
      <Dialog open={showLoading} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
            {message}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
