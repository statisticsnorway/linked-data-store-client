# linked-data-store-client
A React application that works as an interface against the object-models stored in 
[LDS](https://github.com/statisticsnorway/linked-data-store-documentation).

### Try it
The first time you clone the repository remember to run `yarn install`.

Run `yarn start` and navigate to `http://localhost:3000`.

### Run tests
`yarn test` runs all tests and `yarn coverage` calculates (rather unreliably) test coverage.

[Jest](https://jestjs.io/docs/en/tutorial-react) and 
[react-testing-library](https://github.com/kentcdodds/react-testing-library) is used for testing.

### Docker locally
* `docker build . -t linked-data-store-client:0.1`
* `docker run -p 8000:80 linked-data-store-client:0.1`
* Navigate to `http://localhost:8000/`
