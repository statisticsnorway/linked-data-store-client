# linked-data-store-client
A React application that works as an interface against the object-models stored in 
[LDS](https://github.com/statisticsnorway/linked-data-store-documentation).

### Try it
The first time you clone the repository remember to run `yarn install`.

Run `yarn start` and navigate to `http://localhost:3000`.

##### Alternatively try a more optimized production build:
1. Run `yarn build`
    * Run `yarn global add serve` (if you do not have [serve](https://github.com/zeit/serve/))
3. Run `serve -s build`
4. Navigate to `http://localhost:5000`

### Run tests
`yarn test` runs all tests and `yarn coverage` calculates (rather unreliably) test coverage.

[Jest](https://jestjs.io/docs/en/tutorial-react) and 
[react-testing-library](https://github.com/kentcdodds/react-testing-library) is used for testing.
