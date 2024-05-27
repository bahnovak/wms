import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { IStorage } from '../../interfaces';
import { fetchStorages } from '../../api/storages';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { createProduct } from '../../api/products';
import { useSnackbar } from 'notistack';
import { customizeStorageName } from '../../utils/storages';

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

export const CreateProductModal = ({
  isOpen,
  setIsOpen,
  callback,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  callback: () => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [storages, setStorages] = useState<IStorage[]>([]);
  const [storageId, setStorageId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStorages().then((res) => setStorages(res[0]));
  }, [setStorages]);

  const onSubmit = async () => {
    if (!name.length || !storageId || !(Number(price) > 0)) {
      setError(true);
      enqueueSnackbar('Некорректные данные', { variant: 'error' });
      return;
    }

    try {
      await createProduct({
        name,
        storageId,
        price: Number(price),
      });
      setError(false);
      callback();
      setIsOpen(false);
      enqueueSnackbar('Продукт создан успешно', { variant: 'success' });
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
            Создать продукт
          </Typography>
          <TextField
            error={error}
            id="outlined-basic"
            label="Имя продукта"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            error={error}
            type="number"
            id="outlined-basic"
            label="Цена закупки"
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Хранилище</InputLabel>
            <Select
              error={error}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={storageId}
              label="Хранилище"
              onChange={(e) => setStorageId(e.target.value as number | '')}
            >
              {storages.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {customizeStorageName(s)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={onSubmit}>
            Создать
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
