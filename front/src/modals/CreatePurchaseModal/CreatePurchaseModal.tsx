import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { ICustomProduct } from '../../interfaces';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ChooseProductsModal } from '../ChooseProductsModal/ChooseProductsModal';
import { createPurchase } from '../../api/purchases';

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

export const CreatePurchaseModal = ({
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

  const onSubmit = async () => {
    if (!products.length) {
      enqueueSnackbar('Закупка должна содержать минимум один продукт', {
        variant: 'error',
      });
      return;
    }

    try {
      await createPurchase({
        products: products.map((p) => ({
          productId: p.id as number,
          quantity: p.quantity as number,
        })),
      });
      callback();
      setIsOpen(false);
      enqueueSnackbar('Закупка создана успешно', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Некорректные данные продуктов', { variant: 'error' });
    }
  };

  return (
    <div>
      {modalIsOpen && (
        <ChooseProductsModal
          isPurchase={true}
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
            Создать закупку
          </Typography>
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
