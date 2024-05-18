import { createBrowserRouter } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Home } from './pages/Home/Home';
import { InboundStock } from './pages/InboundStock/InboundStock';
import { Orders } from './pages/Orders/Orders';
import { Products } from './pages/Products/Products';
import { Purchases } from './pages/Purchases/Purchases';
import { Storages } from './pages/Storages/Storages';
import { Users } from './pages/Users/Users';
import { Routes } from './enums';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: Routes.INBOUND_STOCK,
        element: <InboundStock />,
      },
      {
        path: Routes.ORDERS,
        element: <Orders />,
      },
      {
        index: true,
        path: Routes.PRODUCTS,
        element: <Products />,
      },
      {
        path: Routes.PURCHASES,
        element: <Purchases />,
      },
      {
        path: Routes.STORAGES,
        element: <Storages />,
      },
      {
        path: Routes.USERS,
        element: <Users />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
