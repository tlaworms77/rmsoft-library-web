import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({
  show,
  message,
  callback,
}: {
  show: boolean;
  message: string;
  callback?: () => void;
}) {
  const [open, setOpen] = React.useState(show);

  React.useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleClose = () => {
    if (callback) {
      callback();
    }
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{message}</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleClose()}>로그인</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
