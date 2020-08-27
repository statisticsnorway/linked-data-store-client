import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, waitFor } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { DomainList } from '../pages'
import { getData } from '../utilities'
import { API, ERRORS, LDS_TEST_PROPERTIES, MESSAGES, TEST_DOMAINS, TEST_URLS, UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'

jest.mock('../utilities/fetch/Fetch', () => ({ getData: jest.fn() }))

afterEach(() => {
  getData.mockReset()
})

const setup = () => {
  const props = {
    lds: LDS_TEST_PROPERTIES,
    params: {
      domain: TEST_DOMAINS.AGENT
    }
  }

  const { container, getAllByPlaceholderText, queryAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
        <DomainList {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { container, getAllByPlaceholderText, queryAllByText }
}

describe('Correct behaviour when good respone with data', () => {
  beforeEach(() => {
    getData
      .mockImplementationOnce(() => Promise.resolve(AgentSchema))
      .mockImplementationOnce(() => Promise.resolve(AgentData))
  })

  test('DomainList renders correctly when good response from LDS', async () => {
    const { container, queryAllByText } = setup()
    const AgentId = new RegExp('^' + AgentData.id + '$')

    await waitFor(() => {
      const link = container.querySelector(`a[href="/gsim/${TEST_DOMAINS.AGENT}/${AgentData.id}/view"]`)

      expect(queryAllByText(`${UI.CREATE_NEW.nb} ${TEST_DOMAINS.AGENT}`)).toHaveLength(1)
      expect(queryAllByText(AgentData.name[0].languageText)).toHaveLength(1)
      expect(queryAllByText(AgentData.description[0].languageText)).toHaveLength(1)
      expect(link).toBeVisible()
      expect(link).toHaveTextContent(AgentId)
    })

    expect(getData).toHaveBeenCalledTimes(2)
    expect(getData).toHaveBeenNthCalledWith(1, TEST_URLS.AGENT_SCHEMA_URL)
    expect(getData).toHaveBeenNthCalledWith(2, TEST_URLS.AGENT_BASE_URL)
  })

  // test('DomainList filters columns correctly', async () => {
  //   const { getAllByPlaceholderText, queryAllByText } = setup()
  //
  //   await userEvent.type(getAllByPlaceholderText(UI.SEARCH.nb)[0], `Not an ${TEST_DOMAINS.AGENT}`)
  //
  //   await waitFor(() => {
  //     expect(queryAllByText(AgentData.name[0].languageText)).toHaveLength(0)
  //     expect(queryAllByText(AgentData.description[0].languageText)).toHaveLength(0)
  //   })
  // })
})

test('DomainList renders correctly when empty response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve([]))

  const { queryAllByText } = setup()

  await waitFor(() => {
    expect(queryAllByText(MESSAGES.NOTHING_FOUND.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, TEST_URLS.AGENT_SCHEMA_URL)
  expect(getData).toHaveBeenNthCalledWith(2, TEST_URLS.AGENT_BASE_URL)
})

test('DomainList renders correctly when bad response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject(ERRORS.ERROR.en))

  const { queryAllByText } = setup()

  await waitFor(() => {
    expect(queryAllByText(ERRORS.ERROR.en)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith(TEST_URLS.AGENT_SCHEMA_URL)
})
