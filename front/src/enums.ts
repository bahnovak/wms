export enum Routes {
  INBOUND_STOCK = 'inbound-stock',
  ORDERS = 'orders',
  PRODUCTS = 'products',
  PURCHASES = 'purchases',
  STORAGES = 'storages',
  USERS = 'users',
  SUPPLIERS = 'suppliers',
}

export enum Role {
  Regular = 'regular',
  Admin = 'admin',
}

export enum OrderStatus {
  InProcessing = 'in_processing',
  Open = 'open',
  Closed = 'closed',
  Completed = 'completed',
}
