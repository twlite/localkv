const id = (v: string) => Buffer.from(v).toString('base64');

function get(id: string, name: string) {
  fetch('http://localhost:3000/whoami', {
    headers: {
      Authorization: id,
    },
  })
    .then((res) => res.json())
    .then((user) => {
      console.log(user.name, user.name === name);
    })
    .catch(console.error);
}

const john = id('1');
const jane = id('2');

get(john, 'John Doe');
get(jane, 'Jane Doe');
