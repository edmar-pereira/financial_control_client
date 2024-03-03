/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useAPI } from '../context/mainContext';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackComponent() {
  const { message } = useAPI();
  const [msg, setMsg] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState('');

  React.useEffect(() => {
    setMsg(message.content);
    setOpen(message.show);
    setSeverity(message.severity);
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
