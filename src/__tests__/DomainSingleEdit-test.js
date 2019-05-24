import React from 'react'
import 'jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, render, wait } from 'react-testing-library'

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

const setup = (id) => {
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
      id: id,
      view: 'edit'
    }
  }

  const { getByText, queryAllByText } = render(
    <MemoryRouter>
      <LanguageContext.Provider value={{ value: 'nb' }}>
        <DomainSingle {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { getByText, queryAllByText }
}

test('DomainSingle renders edit correctly when good response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve(AgentData))
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_agentInRoles resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_parentAgents resolve

  const { queryAllByText } = setup('903c45b1-7f69-4ee4-b6f3-d95aba633297')

  await wait(() => {
    expect(queryAllByText('Agent')).toHaveLength(1)
    expect(queryAllByText('903c45b1-7f69-4ee4-b6f3-d95aba633297')).toHaveLength(1)
    expect(queryAllByText(UI.SAVE.nb)).toHaveLength(1)
    expect(queryAllByText(UI.DOWNLOAD_JSON.nb)).toHaveLength(1)
    expect(queryAllByText(UI.DELETE.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(4)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent/903c45b1-7f69-4ee4-b6f3-d95aba633297')
})

test('DomainSingle renders edit on fresh object correctly when good response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_agentInRoles resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_parentAgents resolve

  const { getByText } = setup('new')

  await wait(() => {
    expect(getByText(UI.SAVE.nb)).toBeDisabled()
    expect(getByText(UI.DELETE.nb)).toBeDisabled()
  })

  expect(getData).toHaveBeenCalledTimes(3)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
})

test('DomainSingle renders edit correctly when empty response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve([]))

  const { queryAllByText } = setup('903c45b1-7f69-4ee4-b6f3-d95aba633297')

  await wait(() => {
    expect(queryAllByText(MESSAGES.NOTHING_FOUND.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent/903c45b1-7f69-4ee4-b6f3-d95aba633297')
})

test('DomainSingle renders edit correctly when bad schema response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject('Error'))

  const { queryAllByText } = setup('903c45b1-7f69-4ee4-b6f3-d95aba633297')

  await wait(() => {
    expect(queryAllByText(ERRORS.ERROR.nb)).toHaveLength(1)
    expect(queryAllByText('Error')).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith('http://localhost:9090/ns/Agent?schema')
})

test('DomainSingle renders edit correctly when bad data response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.reject('Error'))

  const { queryAllByText } = setup('903c45b1-7f69-4ee4-b6f3-d95aba633297')

  await wait(() => {
    expect(queryAllByText(ERRORS.ERROR.nb)).toHaveLength(1)
    expect(queryAllByText('Error')).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent/903c45b1-7f69-4ee4-b6f3-d95aba633297')
})
