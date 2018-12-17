import React from 'react'
import { shallow } from 'enzyme'

import App from '../App'

describe('App', () => {
  it('Renders itself without error and only once', () => {
    const properties = {
      name: 'LDS',
      producer: '',
      endpoint: 'http://localhost:9090/',
      route: '/lds/',
      languageCode: 'en',
      specialFeatures: true,
      user: 'Test'
    }

    const component = shallow(<App {...properties} />)

    expect(component.length).toEqual(1)
    expect(component).toMatchSnapshot()
  })
})
