import { Button, Paper, TextField } from '@mui/material';
import styles from './Login.module.scss';
import logo from '../../assets/logo.png';
import { useEffect, useState } from 'react';
import { identify, signIn } from '../../api/authentication';
import { setSession } from '../../services/authentication';
import { useNavigate } from 'react-router-dom';

enum eventType {
  password = 'password',
  email = 'email',
}

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onChange = (
    type: eventType,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    switch (type) {
      case eventType.email:
        setEmail(value);
        break;
      case eventType.password:
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = async () => {
    try {
      const tokens = await signIn({
        email,
        password,
      });
      setSession(tokens);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    identify().then((res) => {
      if (res) navigate('/');
    });
  }, [navigate]);

  return (
    <Paper elevation={3} className={styles.main}>
      <img src={logo} className={styles.item} />
      <TextField
        id="email"
        label="Эл. почта"
        variant="outlined"
        className={styles.item}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(eventType.email, e)
        }
        value={email}
      />
      <TextField
        id="password"
        label="Пароль"
        type="password"
        variant="outlined"
        className={styles.item}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(eventType.password, e)
        }
        value={password}
      />
      <Button variant="contained" className={styles.item} onClick={onSubmit}>
        Войти
      </Button>
    </Paper>
  );
};
