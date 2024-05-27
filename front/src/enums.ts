export enum Routes {
  INBOUND_STOCK = 'inbound-stock',
  ORDERS = 'orders',
  PRODUCTS = 'products',
  PURCHASES = 'purchases',
  STORAGES = 'storages',
  USERS = 'users',
  SUPPLIERS = 'suppliers',
  HISTORY = 'history',
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

export enum OperationReason {
  Order = 'order',
  Reserve = 'reserve',
  OrderClose = 'order-close',
  Purchase = 'purchase',
}

export enum OperationStockType {
  Stock = 'stock',
  Reserve = 'reserve',
}

export enum PurchaseStatus {
  Open = 'open',
  Delivered = 'delivered',
}
