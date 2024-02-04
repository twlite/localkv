# LocalKV

LocalKV is a simple, type-safe key-value data store to pass data or context between different parts of your application without propagating it through the whole application.

## Installation

```bash
$ npm install localkv
```

## Usage

### Example with Express web server

```javascript
import { randomUUID } from 'node:crypto';
import express from 'express';
import { KV } from 'localkv';

const app = express();

// create a new instance of KV
const kv = new KV();

// middleware to generate a new request id
app.use((req, res, next) => {
  // generate new id for each request
  const id = randomUUID();

  console.log(`Request ID Generated: ${id}`);
  // ^ "Request ID Generated: e4ce829d-7f67-453a-bc5a-a9db8e4edeef"

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
```

#### Testing

```bash
$ curl http://localhost:3000
# {"id":"e4ce829d-7f67-453a-bc5a-a9db8e4edeef"}
```
