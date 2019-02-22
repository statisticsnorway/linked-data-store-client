import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'

import App from '../App'

describe('App', () => {
  it('Renders without crashing', () => {
    const component = mount(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(component.find(App)).toHaveLength(1)
  })
})
