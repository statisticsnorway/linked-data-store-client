import React from 'react'
import 'jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, render, wait } from 'react-testing-library'

import { LanguageContext } from '../utilities/context/LanguageContext'
import DomainList from '../pages/domain/list/DomainList'
import { getData } from '../utilities/fetch/Fetch'
import { UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'

jest.mock('../utilities/fetch/Fetch', () => ({ getData: jest.fn() }))

afterEach(() => {
  getData.mockReset()
  cleanup()
})

const setup = () => {
  const props = {
    domain: {
      name: 'Agent',
      path: '/ns/Agent?schema',
      route: '/gsim/Agent'
    },
    lds: {
      namespace: 'ns',
      producer: 'gsim',
      url: 'http://localhost:9090',
      user: 'Test user'
    }
  }

  const { container, queryAllByText } = render(
    <MemoryRouter>
      <LanguageContext.Provider value={{ value: 'nb' }}>
        <DomainList {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { container, queryAllByText }
}

test('DomainList renders correctly when good response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve(AgentData))

  const { container, queryAllByText } = setup()

  await wait(() => {
    const link = container.querySelector('a[href="/gsim/Agent/903c45b1-7f69-4ee4-b6f3-d95aba633297/view"]')

    expect(queryAllByText(`${UI.CREATE_NEW.nb} Agent`)).toHaveLength(1)
    expect(queryAllByText('Test Agent')).toHaveLength(1)
    expect(queryAllByText('An agent spesifically designed for testing')).toHaveLength(1)
    expect(link).toBeVisible()
    expect(link).toHaveTextContent(/^903c45b1-7f69-4ee4-b6f3-d95aba633297$/)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent')
})

test('DomainList renders correctly when bad response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject('Error'))

  const { queryAllByText } = setup()

  await wait(() => {
    expect(queryAllByText('Error')).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith('http://localhost:9090/ns/Agent?schema')
})
