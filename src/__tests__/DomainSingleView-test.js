import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, render, wait } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import DomainSingle from '../pages/domain/single/DomainSingle'
import { getData } from '../utilities/fetch/Fetch'
import { ERRORS, MESSAGES, UI } from '../enum'

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
    },
    params: {
      id: '903c45b1-7f69-4ee4-b6f3-d95aba633297',
      view: 'view'
    }
  }

  const { queryAllByText } = render(
    <MemoryRouter>
      <LanguageContext.Provider value={{ value: 'nb' }}>
        <DomainSingle {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { queryAllByText }
}

test('DomainSingle renders view correctly when good response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve(AgentData))

  const { queryAllByText } = setup()

  await wait(() => {
    expect(queryAllByText('903c45b1-7f69-4ee4-b6f3-d95aba633297')).toHaveLength(1)
    expect(queryAllByText(UI.EDIT.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent/903c45b1-7f69-4ee4-b6f3-d95aba633297')
})

test('DomainSingle renders view correctly when empty response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve([]))

  const { queryAllByText } = setup()

  await wait(() => {
    expect(queryAllByText(MESSAGES.NOTHING_FOUND.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent/903c45b1-7f69-4ee4-b6f3-d95aba633297')
})

test('DomainSingle renders view correctly when bad response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject('Error'))

  const { queryAllByText } = setup()

  await wait(() => {
    expect(queryAllByText(ERRORS.ERROR.nb)).toHaveLength(1)
    expect(queryAllByText('Error')).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith('http://localhost:9090/ns/Agent?schema')
})
