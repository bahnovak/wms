import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { ICustomProduct, ISupplier } from '../../interfaces';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { fetchSuppliers } from '../../api/suppliers';
import { ChooseProductsModal } from '../ChooseProductsModal/ChooseProductsModal';
import { createOrder } from '../../api/orders';

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

export const CreateOrderModal = ({
  isOpen,
  setIsOpen,
  callback,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  callback: () => void;
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState<ICustomProduct[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchSuppliers().then((res) => setSuppliers(res[0]));
  }, []);

  const onSubmit = async () => {
    if (!supplierId || !address.length) {
      setError(true);
      enqueueSnackbar('Некорректные данные', { variant: 'error' });
      return;
    }

    if (!products.length) {
      enqueueSnackbar('Заказ должен содержать минимум один продукт', {
        variant: 'error',
      });
    }

    try {
      await createOrder({
        supplierId,
        address,
        products: products.map((p) => ({
          productId: p.id as number,
          quantity: p.quantity as number,
          salesPrice: p.salesPrice as number,
        })),
      });
      setError(false);
      callback();
      setIsOpen(false);
      enqueueSnackbar('Заказ создан успешно', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Некорректные данные продуктов', { variant: 'error' });
    }
  };

  return (
    <div>
      {modalIsOpen && (
        <ChooseProductsModal
          isOpen={modalIsOpen}
          setIsOpen={setModalIsOpen}
          callback={setProducts}
          initialData={products}
        />
      )}
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Создать заказ
          </Typography>
          <TextField
            error={error}
            id="outlined-basic"
            label="Адрес доставки"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Перевозчик</InputLabel>
            <Select
              error={error}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={supplierId}
              label="Перевозчик"
              onChange={(e) => setSupplierId(e.target.value as number | '')}
            >
              {suppliers.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => setModalIsOpen(true)}>
            Добавить продукты
          </Button>
          <Button variant="contained" onClick={onSubmit}>
            Создать
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
