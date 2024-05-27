import { IStorage } from '../interfaces';

export const customizeStorageName = (storage: IStorage) =>
  `${storage.name} / ${storage.floor} - ${storage.room}`;
