import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { createSupplier } from '../../api/suppliers';

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

export const CreateSupplierModal = ({
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
  const [company, setCompany] = useState('');
  const [error, setError] = useState(false);

  const onSubmit = () => {
    if (!name.length || !company.length) {
      setError(true);
      enqueueSnackbar('Некорректные данные', { variant: 'error' });
      return;
    }

    try {
      createSupplier({
        name,
        company,
      }).then(() => {
        setError(false);
        callback();
        setIsOpen(false);
        enqueueSnackbar('Перевозчик создан успешно', { variant: 'success' });
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
            Создать перевозчика
          </Typography>
          <TextField
            error={error}
            id="outlined-basic"
            label="Имя перевозчика"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            error={error}
            id="outlined-basic"
            label="Компания"
            variant="outlined"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Button variant="contained" onClick={onSubmit}>
            Создать
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
