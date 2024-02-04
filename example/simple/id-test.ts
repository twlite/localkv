import { randomUUID } from 'node:crypto';
import express from 'express';
import { KV } from '../../src/mod';

const app = express();

// create a new KV instance
const kv = new KV();

// middleware to generate request id
app.use((req, res, next) => {
  // generate new id for each request
  const id = randomUUID();

  console.log(`Request ID Generated: ${id}`);

  // create a new context for this request
  kv.with(() => {
    // set the request-id key to the generated id in this context
    kv.set('request-id', id);

    // execute the next middleware.
    next();
  });
});

app.get('/', (req, res) => {
  // get the request-id from the context. Correct data will be automatically available without passing it through the whole application or mutating the request object.
  const id = kv.get('request-id');

  // send the id as response
  res.json({ id });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
