import React from 'react'
import 'jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, fireEvent, render, wait } from 'react-testing-library'

import { LanguageContext } from '../utilities/context/LanguageContext'
import Explore from '../pages/explore/Explore'
import { getData } from '../utilities/fetch/Fetch'
import { TABLE, UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'

jest.mock('../utilities/fetch/Fetch', () => ({ getData: jest.fn() }))

// Removes HTMLCanvasElement errors in console while running tests - https://github.com/jerairrest/react-chartjs-2/issues/155
jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Doughnut: () => null,
  Pie: () => null
}))

afterEach(() => {
  getData.mockReset()
  cleanup()
})

const setup = () => {
  const props = {
    domains: [{
      name: 'Agent',
      path: '/ns/Agent?schema',
      route: '/gsim/Agent'
    }],
    lds: {
      namespace: 'ns',
      producer: 'gsim',
      url: 'http://localhost:9090',
      user: 'Test user'
    }
  }

  const { getByTestId, getByText, queryAllByText } = render(
    <MemoryRouter>
      <LanguageContext.Provider value={{ value: 'nb' }}>
        <Explore {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { getByTestId, getByText, queryAllByText }
}

test('Explore renders correctly when good response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve([AgentSchema]))
    .mockImplementationOnce(() => Promise.resolve(AgentData))

  const { queryAllByText } = setup()

  await wait(() => {
    expect(queryAllByText(UI.EXPLORE.nb)).toHaveLength(1)
    TABLE.EXPLORE_HEADERS.nb.forEach(header => {
      expect(queryAllByText(header)).toHaveLength(1)
    })
    expect(queryAllByText('Agent')).toHaveLength(1)
    expect(queryAllByText(UI.INSTANCE_COUNT.nb)).toHaveLength(1)
    expect(queryAllByText(UI.UNUSED_COUNT.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns?schema=embed')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent')
})

test('Toggle show all button works', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve([AgentSchema]))
    .mockImplementationOnce(() => Promise.resolve([]))

  const { getByTestId, getByText } = setup()

  await wait(() => {
    expect(getByText('Agent')).not.toBeVisible()

    fireEvent.click(getByTestId('exploreShowAll').firstChild)

    expect(getByText('Agent')).toBeVisible()
  })
})

test('Explore renders correctly when bad response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject('Error'))

  const { queryAllByText } = setup()

  await wait(() => {
    expect(queryAllByText('Error')).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith('http://localhost:9090/ns?schema=embed')
})
