import React from 'react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { render, waitFor } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { Explore } from '../pages'
import { getData } from '../utilities'
import { API, BASE_TEST_URL, ERRORS, LDS_TEST_PROPERTIES, TABLE, TEST_DOMAINS, TEST_URLS, UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'

jest.mock('../utilities/fetch/Fetch', () => ({ getData: jest.fn() }))

afterEach(() => {
  getData.mockReset()
})

const TEST_ID = 'exploreShowAll'

const setup = () => {
  const props = {
    domains: [{
      name: TEST_DOMAINS.AGENT,
      route: `/${API.DEFAULT_PRODUCER}/${TEST_DOMAINS.AGENT}`
    }],
    lds: LDS_TEST_PROPERTIES
  }

  const { getByTestId, getByText, queryAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
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

  await waitFor(() => {
    expect(queryAllByText(UI.EXPLORE.nb)).toHaveLength(1)
    TABLE.EXPLORE_HEADERS.nb.forEach(header => {
      expect(queryAllByText(header)).toHaveLength(1)
    })
    expect(queryAllByText(TEST_DOMAINS.AGENT)).toHaveLength(1)
    expect(queryAllByText(UI.INSTANCE_COUNT.nb)).toHaveLength(1)
    expect(queryAllByText(UI.UNUSED_COUNT.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, `${BASE_TEST_URL}/${LDS_TEST_PROPERTIES.namespace}${API.SCHEMA_QUERY_EMBED}`)
  expect(getData).toHaveBeenNthCalledWith(2, TEST_URLS.AGENT_BASE_URL)
})

test('Toggle show all button works', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve([AgentSchema]))
    .mockImplementationOnce(() => Promise.resolve([]))

  const { getByTestId, getByText } = setup()

  await waitFor(() => {
    expect(getByText(TEST_DOMAINS.AGENT)).not.toBeVisible()

    userEvent.click(getByTestId(TEST_ID))

    expect(getByText(TEST_DOMAINS.AGENT)).toBeVisible()
  })
})

test('Explore renders correctly when bad response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject(ERRORS.ERROR.en))

  const { queryAllByText } = setup()

  await waitFor(() => {
    expect(queryAllByText(ERRORS.ERROR.en)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith(`${BASE_TEST_URL}/${LDS_TEST_PROPERTIES.namespace}${API.SCHEMA_QUERY_EMBED}`)
})
