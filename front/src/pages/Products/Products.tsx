import { useEffect, useState } from 'react';
import { fetchProducts } from '../../api/products';
import { IProduct } from '../../interfaces';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@mui/material';

import { AddButton } from '../../components/AddButton/AddButton';
import { Loader } from '../../components/Loader/Loader';
import { CreateProductModal } from '../../modals/CreateProductModal/CreateProductModal';

export const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProducts({
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((res) => {
      setProducts(res[0]);
      setTotalCount(res[1]);
      setIsLoading(false);
    });
  }, [updateFlag, rowsPerPage, page]);

  const updateCallback = () => setUpdateFlag(!updateFlag);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <CreateProductModal
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        callback={updateCallback}
      />
      <TableContainer component={Paper} sx={{ maxHeight: '80%' }}>
        <Table aria-label="collapsible table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">Идентификатор</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Хранилище</TableCell>
              <TableCell align="right">Цена</TableCell>
              <TableCell align="right">Резерв</TableCell>
              <TableCell align="right">Количество</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                sx={{ '& > *': { borderBottom: 'unset' } }}
                key={product.id}
              >
                <TableCell component="th" scope="row" align="left">
                  {product.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.storageProduct?.storage.name || '-'}
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  {product.purchasePrice}
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  {product.storageProduct?.reserved || 0}
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  {product.storageProduct?.stock || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage="Строк на странице"
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AddButton onClick={() => setModalIsOpen(true)} />
    </>
  );
};
