# linked-data-store-client
A React application to browse the object-model stored in [LDS](https://github.com/statisticsnorway/linked-data-store-documentation).

### How it works
This application is fairly small and its only function is to import and use 
[dc-react-components-library](https://github.com/statisticsnorway/dc-react-components-library) and then add some small 
features like the ability to directly import objects into **LDS** via file-uploads and the ability to download 
data-objects as JSON-files.

**dc-react-components-library** builds forms and tables from JSONSchemas exposed by **LDS**. This library needs a producer 
to be able to decode the structure of the stored objects, handle and show them correctly in the UI. Currently a default 
producer for simple object structures is supported and already loaded in. Producers are located in the dc-react-components-library 
code but might find their way to a separate repository later.

### Test it yourself
The first time you clone the repository, remember to run `yarn install`

Run `REACT_APP_LDS="LDS_url_here" yarn start` and navigate to `http://localhost:3000/`

If you leave out `REACT_APP_LDS` it defaults to `http://localhost:9090/`

##### Alternatively use a more optimized production build:
1. Run `REACT_APP_LDS="LDS_url_here" yarn build`
2. Optionally run `yarn global add serve` (if you do not have [serve](https://github.com/zeit/serve/))
3. Run `serve -s build`
4. Navigate to `http://localhost:5000/`

### Note:
At the moment this application imports **dc-react-components-library** directly from GitHub which means that you need read
access to the repository in order to fetch the dependency. This will change later when we get to upload React libraries
to Nexus or go public. This also means that updates to dependencies **will not be** reflected unless you run `yarn upgrade`.
