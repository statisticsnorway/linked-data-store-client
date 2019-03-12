import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import 'react-table/react-table.css'
import 'react-datepicker/dist/react-datepicker.css'

import App from './App'

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
)
