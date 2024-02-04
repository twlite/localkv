import express from 'express';
import { KV } from '../../src/mod';

const app = express();

// user structure
interface User {
  id: string;
  name: string;
  email: string;
}

const localKV = new KV<string, User>();

// mock database
const database = new Map<string, User>([
  ['1', { id: '1', name: 'John Doe', email: 'john@example.com' }],
  ['2', { id: '2', name: 'Jane Doe', email: 'jane@example.com' }],
]);

app.use((req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // in real world, you should use jsonwebtoken or other lib
  const user = Buffer.from(token, 'base64').toString('utf-8');
  const userFromDB = database.get(user);

  if (!userFromDB) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // we execute rest of the code inside localKV's context
  localKV.with(() => {
    // we store current user in localKV
    localKV.set('user::current', userFromDB);
    next();
  });
});

app.get('/whoami', (req, res) => {
  // we get current user from localKV
  const user = localKV.get('user::current');
  res.json(user);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
