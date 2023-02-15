import Alert from '@mui/material/Alert'

const AlertBox = ({ msg }) => {
  if (msg) {
    return <Alert severity='error'>{msg}</Alert>
  }
}

export default AlertBox