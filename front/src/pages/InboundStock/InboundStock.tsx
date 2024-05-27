import { useEffect, useState } from 'react';
import { IPurchasePosition, IStorage } from '../../interfaces';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import { AddButton } from '../../components/AddButton/AddButton';
import { Loader } from '../../components/Loader/Loader';
import { PurchaseStatus } from '../../enums';
import {
  bookPurchasePositions,
  fetchPurchasePositions,
} from '../../api/purchase-positions';
import { customizeStorageName } from '../../utils/storages';
import { fetchStorages } from '../../api/storages';
import { useSnackbar } from 'notistack';

type colors =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

export const InboundStock = () => {
  const [purchasePositions, setPurchasePositions] = useState<
    IPurchasePosition[]
  >([]);
  const [filteredPurchasePositions, setFilteredPurchasePositions] = useState<
    IPurchasePosition[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [storages, setStorages] = useState<IStorage[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<
    { quantity: number | ''; positionId: number }[]
  >([]);
  const [storageId, setStorageId] = useState<number | ''>('');
  const [error, setError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchStorages().then((res) => setStorages(res[0]));
  }, [setStorages]);

  useEffect(() => {
    fetchPurchasePositions().then((res) => {
      setPurchasePositions(res[0]);
      setFilteredPurchasePositions(res[0]);
      setIsLoading(false);
    });
  }, [updateFlag]);

  const onCheckboxClick = (id: number, purchaseId: number) => {
    if (selectedPositions.find((p) => p.positionId === id)) {
      const sps = selectedPositions.filter((p) => p.positionId !== id);
      setSelectedPositions(sps);
      if (!sps.length) setFilteredPurchasePositions(purchasePositions);
    } else {
      if (!selectedPositions.length) {
        setFilteredPurchasePositions(
          purchasePositions.filter((pp) => pp.purchase.id === purchaseId),
        );
      }

      setSelectedPositions([
        ...selectedPositions,
        {
          positionId: id,
          quantity: '',
        },
      ]);
    }
  };

  const onInputChange = ({
    id,
    value,
    min,
    max,
  }: {
    id: number;
    value: string;
    min: string;
    max: string;
  }) => {
    const position = selectedPositions.find((p) => p.positionId === id);
    if (position) {
      let checkedValue = value;
      if (Number(value) > Number(max)) checkedValue = max;
      if (Number(value) < Number(min)) checkedValue = min;

      position.quantity = value === '' ? '' : Number(checkedValue);
      setSelectedPositions([...selectedPositions]);
    }
  };

  const onSubmit = async () => {
    if (!selectedPositions.length || !storageId) {
      setError(true);
      enqueueSnackbar('Некорректные данные', { variant: 'error' });
      return;
    }

    try {
      await bookPurchasePositions({
        positions: selectedPositions.map((sp) => ({
          quantity: Number(sp.quantity),
          positionId: Number(sp.positionId),
        })),
        storageId,
      });
      setError(false);
      setUpdateFlag(!updateFlag);
      enqueueSnackbar('Упешно', { variant: 'success' });
      setSelectedPositions([]);
    } catch (err) {
      setError(true);
      enqueueSnackbar('Некорректные данные', { variant: 'error' });
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: '80%' }}>
        <Table aria-label="collapsible table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Id</TableCell>
              <TableCell>Номер закупки</TableCell>
              <TableCell>Номер продукта</TableCell>
              <TableCell>Количество</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPurchasePositions.map((purchasePosition) => {
              const selectedPosition = selectedPositions.find(
                (sp) => sp.positionId === purchasePosition.id,
              );
              const isChecked = !!selectedPositions.find(
                (sp) => sp.positionId === purchasePosition.id,
              );
              return (
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      onClick={() =>
                        onCheckboxClick(
                          purchasePosition.id,
                          purchasePosition.purchase.id,
                        )
                      }
                      color="primary"
                      checked={isChecked}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {purchasePosition.id}
                  </TableCell>
                  <TableCell>{purchasePosition.purchase.number}</TableCell>
                  <TableCell>{purchasePosition.product.name}</TableCell>
                  <TableCell>
                    <TextField
                      disabled={!isChecked}
                      id="outlined-number"
                      type="number"
                      size="small"
                      fullWidth
                      placeholder={`Мин: 1, Макс: ${
                        purchasePosition.expected - purchasePosition.delivered
                      }`}
                      value={selectedPosition?.quantity || ''}
                      onChange={(e) => {
                        const target = e.target as EventTarget &
                          (HTMLInputElement | HTMLTextAreaElement) & {
                            min: string;
                            max: string;
                          };
                        onInputChange({
                          id: purchasePosition.id,
                          value: target.value,
                          min: target.min,
                          max: target.max,
                        });
                      }}
                      inputProps={{
                        min: 1,
                        max:
                          purchasePosition.expected -
                          purchasePosition.delivered,
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Paper sx={{ padding: 2 }}>
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
        </Paper>
      </TableContainer>
      <AddButton onClick={onSubmit} />
    </>
  );
};
