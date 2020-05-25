# linked-data-store-client
[![Build Status](https://dev.azure.com/statisticsnorway/Dapla/_apis/build/status/Frontends/statisticsnorway.linked-data-store-client?branchName=master)](https://dev.azure.com/statisticsnorway/Dapla/_build/latest?definitionId=11&branchName=master)

A React application that works as an interface against the object-models stored in 
[LDS](https://github.com/statisticsnorway/linked-data-store-documentation).

Follows React application setup from [react-reference-app](https://github.com/statisticsnorway/fe-react-reference-app) 
although it has not been converted to only use React Hooks yet.

### Try it
The first time you clone the repository, remember to run `yarn` or `yarn install`.

Run `yarn start` and navigate to `http://localhost:3000/`.

### Run tests
`yarn test` runs all tests and `yarn coverage` calculates (rather unreliably) test coverage.

### Docker locally
* `yarn build`
* `docker build -t linked-data-store-client .`
* `docker run -p 8000:80 linked-data-store-client:latest`
* Navigate to `http://localhost:8000/`
