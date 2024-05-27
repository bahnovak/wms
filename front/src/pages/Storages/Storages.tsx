import { useEffect, useState } from 'react';
import { IStorage } from '../../interfaces';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';

import { AddButton } from '../../components/AddButton/AddButton';
import { Loader } from '../../components/Loader/Loader';
import { fetchStorages } from '../../api/storages';
import { CreateStorageModal } from '../../modals/CreateStorageModal/CreateStorageModal';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';

const Row = ({ storage, key }: { storage: IStorage; key: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment key={key}>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {storage.id}
        </TableCell>
        <TableCell>{storage.name}</TableCell>
        <TableCell>{storage.floor}</TableCell>
        <TableCell>{storage.room}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Продукты
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell align="right">Резерв</TableCell>
                    <TableCell align="right">Количество</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storage.products.map((sp) => (
                    <TableRow key={sp.id}>
                      <TableCell component="th" scope="row">
                        {sp.id}
                      </TableCell>
                      <TableCell>{sp.product.name}</TableCell>
                      <TableCell align="right">{sp.reserved}</TableCell>
                      <TableCell align="right">{sp.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const Storages = () => {
  const [storages, setStorages] = useState<IStorage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchStorages({
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((res) => {
      setStorages(res[0]);
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
      <CreateStorageModal
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        callback={updateCallback}
      />
      <TableContainer component={Paper} sx={{ maxHeight: '80%' }}>
        <Table aria-label="collapsible table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Id</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Этаж</TableCell>
              <TableCell>Комната</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storages.map((storage) => (
              <Row storage={storage} key={storage.id} />
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
