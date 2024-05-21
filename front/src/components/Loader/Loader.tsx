import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Loader = () => {
  return (
    <Box sx={{ display: 'flex', width: '80px', height: '80px' }}>
      <CircularProgress />
    </Box>
  );
}