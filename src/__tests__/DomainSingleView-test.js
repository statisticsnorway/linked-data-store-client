import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { request } from 'graphql-request'
import { render, waitFor } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { DomainSingle } from '../pages'
import { getData } from '../utilities'
import { API, ERRORS, LDS_TEST_PROPERTIES, MESSAGES, TEST_DOMAINS, TEST_URLS, UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'
import ProcessStepSchema from './test-data/ProcessStepSchema'
import ProcessStepData from './test-data/ProcessStepData'
import StatisticalProgramSchema from './test-data/StatisticalProgramSchema'
import StatisticalProgramData from './test-data/StatisticalProgramData'
import StatisticalProgramQueryResponse from './test-data/StatisticalProgramQueryResponse'

jest.mock('../utilities/fetch/Fetch', () => ({ getData: jest.fn() }))

afterEach(() => {
  getData.mockReset()
  request.mockReset()
})

const setup = (domain, id = null) => {
  const props = {
    lds: LDS_TEST_PROPERTIES,
    params: {
      domain: domain,
      id: id,
      view: API.VIEWS.VIEW
    }
  }

  const { queryAllByTestId, queryAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
        <DomainSingle {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { queryAllByTestId, queryAllByText }
}

test('DomainSingle renders view correctly when good response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve(AgentData))

  const { queryAllByText } = setup(TEST_DOMAINS.AGENT, AgentData.id)

  await waitFor(() => {
    expect(queryAllByText(AgentData.id)).toHaveLength(1)
    expect(queryAllByText(UI.EDIT.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, TEST_URLS.AGENT_SCHEMA_URL)
  expect(getData).toHaveBeenNthCalledWith(2, `${TEST_URLS.AGENT_BASE_URL}/${AgentData.id}`)
})

test('DomainSingle renders code block button in view correctly', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(ProcessStepSchema))
    .mockImplementationOnce(() => Promise.resolve(ProcessStepData))

  const { queryAllByText } = setup(TEST_DOMAINS.PROCESS_STEP, ProcessStepData.id)

  await waitFor(() => {
    expect(queryAllByText(ProcessStepData.id)).toHaveLength(1)
    expect(queryAllByText(UI.VIEW_CODE_BLOCK.nb)).toHaveLength(1)
  })
})

test('DomainSingle renders view correctly when empty response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve([]))

  const { queryAllByText } = setup(TEST_DOMAINS.AGENT, AgentData.id)

  await waitFor(() => {
    expect(queryAllByText(MESSAGES.NOTHING_FOUND.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, TEST_URLS.AGENT_SCHEMA_URL)
  expect(getData).toHaveBeenNthCalledWith(2, `${TEST_URLS.AGENT_BASE_URL}/${AgentData.id}`)
})

test('DomainSingle renders view correctly when bad response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject(ERRORS.ERROR.en))

  const { queryAllByText } = setup(TEST_DOMAINS.AGENT)

  await waitFor(() => {
    expect(queryAllByText(ERRORS.ERROR.nb)).toHaveLength(1)
    expect(queryAllByText(ERRORS.ERROR.en)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith(TEST_URLS.AGENT_SCHEMA_URL)
})

test('DomainSingle renders DomainLinks if query exists', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(StatisticalProgramSchema))
    .mockImplementationOnce(() => Promise.resolve(StatisticalProgramData))

  request.mockImplementation(() => Promise.resolve(StatisticalProgramQueryResponse))

  const { queryAllByTestId } = setup(TEST_DOMAINS.STATISTICAL_PROGRAM, StatisticalProgramData.id)

  await waitFor(() => {
    expect(queryAllByTestId('queryInfo')).toHaveLength(1)
  })
})
