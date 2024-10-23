In this project we have developed a backend for a simple API to handle CRUD for tasks.

## Decisions

We made a few decisions:

- We used Koa to handle routing, just to simulate a more complete project
- We included a middleware that doesn't do anything, but again to simulate what a more complete project would look like
- We used a dictionary to simulate a DB, and even though the operations don't need to be asynchronous, they are declared as such to emulate real use cases
- The testing was done at the controller layer, because the business logic barely has anything of substance to test, and the service layer is just a dictionary access. The dictionary was mocked to better reflect how unit tests should work
- There's a factory as requested to instantiate Tasks. Tasks are instantiated without ids because the database is the one who should generate them. Depending on which DB the createdAt and updatedAt would also be handled at the service layer

## How to configure

```
yarn
```

## How to test

```
yarn test
```

This runs the unit tests, and if everything is correctly set up, they should all pass

## How to run

```
yarn start
```

After this, the project can be tested with postman. The default port is 3001, so use urls with the form:
http://127.0.0.1:3001/tasks

## Where to see the documentation

Run the backend and open this url in a browser: http://127.0.0.1:3001/docs

This is a documentation generated using swagger. I could not finish adding the body to the 'try it out', but the gets and the remove functions should work as they are
