import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { createUser } from '../../api/users';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

export const CreateUserModal = ({
  isOpen,
  setIsOpen,
  callback,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  callback: () => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const onSubmit = async () => {
    if (!email.length || password.length < 10) {
      setError(true);
      enqueueSnackbar('Некорректные данные', { variant: 'error' });
      return;
    }

    try {
      await createUser({
        email,
        password,
        name,
      });
      setError(false);
      callback();
      setIsOpen(false);
      enqueueSnackbar('Пользователь создан успешно', { variant: 'success' });
    } catch (err) {
      setError(true);
      enqueueSnackbar('Некорректные данные', { variant: 'error' });
    }
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Создать пользователя
          </Typography>
          <TextField
            error={error}
            id="outlined-basic"
            label="Почта"
            variant="outlined"
            placeholder="Почта должна быть уникальная"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            error={error}
            id="outlined-basic"
            label="Имя"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            error={error}
            id="outlined-basic"
            label="Пароль"
            variant="outlined"
            placeholder="Минимум 10 символов"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={onSubmit}>
            Создать
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
