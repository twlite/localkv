import { Context } from '../../src/mod';

const ctx = new Context<{
  id: number;
  value: string;
}>();

function printValue(id: number) {
  const data = ctx.get();
  console.log(data, 'is equal', data?.id === id);
}

// synchronous mode
for (let i = 0; i < 5; i++) {
  ctx.set({
    id: i,
    value: `value-${i}`,
  });

  printValue(i);
}

console.log(`---Async Mode---`);

// asynchronous mode
Promise.all(
  [1, 2, 3, 4, 5].map(async (e) => {
    ctx.with({ id: e, value: `async-value-${e}` }, () => printValue(e));
  })
);
