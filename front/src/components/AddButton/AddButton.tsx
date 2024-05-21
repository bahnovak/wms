import AddIcon from '@mui/icons-material/Add';
import styles from './AddButton.module.scss';

export const AddButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <AddIcon className={styles.icon} sx={{ width: '50px', height: '50px' }} />
    </div>
  );
};
