import { useEffect, useState } from 'react';
import { ISupplier } from '../../interfaces';
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
import { fetchSuppliers } from '../../api/suppliers';
import { CreateSupplierModal } from '../../modals/CreateSupplierModal/CreateSupplierModal';

export const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchSuppliers({
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((res) => {
      setSuppliers(res[0]);
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
      <CreateSupplierModal
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
              <TableCell>Компания</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow
                sx={{ '& > *': { borderBottom: 'unset' } }}
                key={supplier.id}
              >
                <TableCell component="th" scope="row" align="left">
                  {supplier.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {supplier.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {supplier.company}
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
        labelRowsPerPage="Строк на странице"
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AddButton onClick={() => setModalIsOpen(true)} />
    </>
  );
};
