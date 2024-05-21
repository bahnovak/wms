import { useEffect, useState } from 'react';
import { identify } from '../../api/authentication';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import logo from '../../assets/logo.png';
import { Routes } from '../../enums';
import clsx from 'clsx';

const menuItemsData = [
  {
    link: Routes.PRODUCTS,
    text: 'Продукты',
  },
  {
    link: Routes.ORDERS,
    text: 'Заказы',
  },
  {
    link: Routes.INBOUND_STOCK,
    text: 'Входящий запас',
  },
  {
    link: Routes.PURCHASES,
    text: 'Закупка',
  },
  {
    link: Routes.STORAGES,
    text: 'Хранилища',
  },
  {
    link: Routes.SUPPLIERS,
    text: 'Перевозчики',
  },
  {
    link: Routes.USERS,
    text: 'Пользователи',
  },
];

export const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    identify()
      .then((res) => {
        if (res) {
          setIsLoaded(true);
        }
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  useEffect(() => {
    if (isLoaded && location.pathname === '/') navigate('/products');
  }, [location, isLoaded, navigate]);

  return (
    isLoaded && (
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <img src={logo} className={styles.item} />
        </div>
        <div className={styles.navigation}>
          {menuItemsData.map((item) => (
            <NavLink
              key={item.link}
              to={item.link}
              className={({ isActive }) =>
                isActive
                  ? clsx(styles.menuItem, styles.activeMenuItem)
                  : styles.menuItem
              }
            >
              {item.text}
            </NavLink>
          ))}
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    )
  );
};
