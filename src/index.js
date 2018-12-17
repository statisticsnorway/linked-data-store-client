import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import 'semantic-ui-css/semantic.min.css'
import 'react-table/react-table.css'
import 'react-datepicker/dist/react-datepicker.css'

let endpoint

if (process.env.REACT_APP_LDS === undefined) {
  endpoint = 'http://localhost:9090/'
} else {
  endpoint = process.env.REACT_APP_LDS

  if (!endpoint.endsWith('/')) {
    endpoint = process.env.REACT_APP_LDS + '/'
  }
}

const properties = {
  name: 'LDS',
  producer: '', // A producer is required to browse objects
  endpoint: endpoint,
  route: '/lds/',
  languageCode: 'en',
  specialFeatures: true,
  user: 'Test user'
}

ReactDOM.render(
  <BrowserRouter>
    <App {...properties} />
  </BrowserRouter>,
  document.getElementById('root')
)
