import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { createStorage } from '../../api/storages';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';

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

export const CreateStorageModal = ({
  isOpen,
  setIsOpen,
  callback,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  callback: () => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const [floor, setFloor] = useState<number | ''>('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState(false);

  const onSubmit = () => {
    if (!name.length || !room.length || !Number(floor)) {
      setError(true);
      enqueueSnackbar('Некорректные данные', { variant: 'error' });
      return;
    }

    try {
      createStorage({
        name,
        floor: Number(floor),
        room: room,
      }).then(() => {
        setError(false);
        callback();
        setIsOpen(false);
        enqueueSnackbar('Хранилище создано успешно', { variant: 'success' });
      });
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
            Создать хранилище
          </Typography>
          <TextField
            error={error}
            id="outlined-basic"
            label="Имя хранилища"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            error={error}
            type="number"
            id="outlined-basic"
            label="Этаж"
            variant="outlined"
            value={floor}
            onChange={(e) => setFloor(e.target.value as number | '')}
          />
          <TextField
            error={error}
            id="outlined-basic"
            label="Комната"
            variant="outlined"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <Button variant="contained" onClick={onSubmit}>
            Создать
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
