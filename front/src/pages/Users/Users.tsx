import { useEffect, useState } from 'react';
import { ActiveUserData } from '../../interfaces';
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
import { fetchUsers } from '../../api/users';
import { Role } from '../../enums';
import { CreateUserModal } from '../../modals/CreateUserModal/CreateUserModal';

const roleMap = {
  [Role.Admin]: 'Администратор',
  [Role.Regular]: 'Работник',
};

export const Users = () => {
  const [users, setUsers] = useState<ActiveUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUsers({
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((res) => {
      setUsers(res[0]);
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
      <CreateUserModal
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        callback={updateCallback}
      />
      <TableContainer component={Paper} sx={{ maxHeight: '80%' }}>
        <Table aria-label="collapsible table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">Id</TableCell>
              <TableCell>Почта</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Роль</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                sx={{ '& > *': { borderBottom: 'unset' } }}
                key={user.id}
              >
                <TableCell component="th" scope="row" align="left">
                  {user.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.email}
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {roleMap[user.role]}
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
