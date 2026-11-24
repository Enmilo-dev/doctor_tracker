import { connectDb, disconnectDb } from '../db/connect.js';
import { syncAllIndexes } from '../db/indexes.js';

try {
  await connectDb();
  await syncAllIndexes();
  console.log('Indexes are in sync');
} finally {
  await disconnectDb();
}
