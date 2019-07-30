import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import DomainList from '../pages/domain/list/DomainList'
import { getData } from '../utilities/fetch/Fetch'
import { MESSAGES, UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'

jest.mock('../utilities/fetch/Fetch', () => ({ getData: jest.fn() }))

afterEach(() => {
  getData.mockReset()
  cleanup()
})

const setup = () => {
  const props = {
    lds: {
      namespace: 'ns',
      producer: 'gsim',
      url: 'http://localhost:9090',
      user: 'Test user'
    },
    params: {
      domain: 'Agent'
    }
  }

  const { container, getAllByPlaceholderText, queryAllByText } = render(
    <MemoryRouter>
      <LanguageContext.Provider value={{ value: 'nb' }}>
        <DomainList {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { container, getAllByPlaceholderText, queryAllByText }
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
    expect(queryAllByText('An agent specifically designed for testing')).toHaveLength(1)
    expect(link).toBeVisible()
    expect(link).toHaveTextContent(/^903c45b1-7f69-4ee4-b6f3-d95aba633297$/)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent')
})

test('DomainList renders correctly when empty response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve([]))

  const { queryAllByText } = setup()

  await wait(() => {
    expect(queryAllByText(MESSAGES.NOTHING_FOUND.nb)).toHaveLength(1)
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

test('DomainList filters columns correctly', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve(AgentData))

  const { getAllByPlaceholderText, queryAllByText } = setup()

  await wait(() => {
    fireEvent.change(getAllByPlaceholderText(UI.SEARCH.nb)[0], { target: { value: 'Not an Agent' } })
    expect(queryAllByText('Test Agent')).toHaveLength(0)
    expect(queryAllByText('An agent specifically designed for testing')).toHaveLength(0)
  })
})
