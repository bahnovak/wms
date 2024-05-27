import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { ICustomProduct, IProduct } from '../../interfaces';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableContainer,
  Paper,
  Checkbox,
} from '@mui/material';
import { fetchProducts } from '../../api/products';
import { useSnackbar } from 'notistack';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxHeight: '80%',
};

export const ChooseProductsModal = ({
  isOpen,
  setIsOpen,
  callback,
  initialData,
  isPurchase = false,
}: {
  isOpen: boolean;
  isPurchase?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  callback: (products: ICustomProduct[]) => void;
  initialData: ICustomProduct[];
}) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ICustomProduct[]>(
    [],
  );
  const [errorIds, setErrorIds] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setSelectedProducts([...initialData]);
  }, [initialData]);

  useEffect(() => {
    fetchProducts({
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((res) => {
      setProducts(res[0]);
      setTotalCount(res[1]);
    });
  }, [page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onCheckboxClick = (id: number) => {
    if (selectedProducts.find((p) => p.id === id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
    } else {
      const product = products.find((p) => p.id === id);
      if (product) {
        setSelectedProducts([
          ...selectedProducts,
          {
            ...product,
            salesPrice: '',
            quantity: '',
          },
        ]);
      }
    }
  };

  const onInputChange = ({
    id,
    type,
    value,
  }: {
    id: number;
    type: 'salesPrice' | 'quantity';
    value: string;
  }) => {
    const product = selectedProducts.find((p) => p.id === id);
    if (product) {
      product[type] = value === '' ? '' : Number(value);
      setSelectedProducts([...selectedProducts]);
    }
  };

  const onAddProducts = () => {
    const errorProducts = selectedProducts.filter((sp) =>
      isPurchase ? !sp.quantity : !sp.salesPrice || !sp.quantity,
    );
    if (errorProducts.length) {
      setErrorIds(errorProducts.map((ep) => ep.id));
      enqueueSnackbar('Некорректные данные', { variant: 'error' });
      return;
    }

    setErrorIds([]);
    callback(selectedProducts);
    enqueueSnackbar('Продукты добавлены успешно', { variant: 'success' });
    setIsOpen(false);
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
            Выбор продуктов
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
            <Table size="small" aria-label="purchases" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Id</TableCell>
                  <TableCell>Название</TableCell>
                  {!isPurchase && <TableCell>Цена продажи</TableCell>}
                  <TableCell>Количество</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => {
                  const isChecked = !!selectedProducts.find(
                    (sp) => sp.id === product.id,
                  );
                  const isError = !!errorIds.find((e) => e === product.id);
                  const selectedProduct = selectedProducts.find(
                    (sp) => sp.id === product.id,
                  );
                  return (
                    <TableRow key={product.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={() => onCheckboxClick(product.id)}
                          color="primary"
                          checked={isChecked}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {product.id}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      {!isPurchase && (
                        <TableCell>
                          <TextField
                            error={isError}
                            disabled={!isChecked}
                            id="outlined-number"
                            type="number"
                            size="small"
                            value={selectedProduct?.salesPrice}
                            onChange={(e) =>
                              onInputChange({
                                id: product.id,
                                type: 'salesPrice',
                                value: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <TextField
                          error={isError}
                          disabled={!isChecked}
                          id="outlined-number"
                          type="number"
                          size="small"
                          value={selectedProduct?.quantity}
                          onChange={(e) =>
                            onInputChange({
                              id: product.id,
                              type: 'quantity',
                              value: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            labelRowsPerPage="Строк на странице"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Button variant="contained" onClick={onAddProducts}>
            Добавить
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
