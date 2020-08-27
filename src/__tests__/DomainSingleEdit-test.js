import React from 'react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { render, waitFor } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { DomainSingle } from '../pages'
import { deleteData, getData, putData } from '../utilities'
import { API, ERRORS, LDS_TEST_PROPERTIES, MESSAGES, TEST_DOMAINS, TEST_URLS, UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'
import ProcessStepSchema from './test-data/ProcessStepSchema'
import ProcessStepData from './test-data/ProcessStepData'
import ProcessStepInstanceSchema from './test-data/ProcessStepInstanceSchema'
import ProcessStepInstanceData from './test-data/ProcessStepInstanceData'

jest.mock('../utilities/fetch/Fetch', () => ({ deleteData: jest.fn(), getData: jest.fn(), putData: jest.fn() }))

afterEach(() => {
  deleteData.mockReset()
  getData.mockReset()
  putData.mockReset()
})

const setup = (domain, id) => {
  const props = {
    lds: LDS_TEST_PROPERTIES,
    params: {
      domain: domain,
      id: id,
      view: API.VIEWS.EDIT
    }
  }

  const { container, getByText, queryAllByPlaceholderText, queryAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
        <DomainSingle {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { container, getByText, queryAllByPlaceholderText, queryAllByText }
}

describe('Correct behaviour when good respone with data', () => {
  beforeEach(() => {
    getData
      .mockImplementationOnce(() => Promise.resolve(AgentSchema))
      .mockImplementationOnce(() => Promise.resolve(AgentData))
      .mockImplementationOnce(() => Promise.resolve([])) // _link_property_agentInRoles resolve
      .mockImplementationOnce(() => Promise.resolve([])) // _link_property_parentAgents resolve
  })

  test('DomainSingle renders edit correctly when good response from LDS', async () => {
    const { queryAllByText } = setup(TEST_DOMAINS.AGENT, AgentData.id)

    await waitFor(() => {
      expect(queryAllByText(TEST_DOMAINS.AGENT)).toHaveLength(1)
      expect(queryAllByText(AgentData.id)).toHaveLength(1)
      expect(queryAllByText(UI.SAVE.nb)).toHaveLength(1)
      expect(queryAllByText(UI.DOWNLOAD_JSON.nb)).toHaveLength(1)
      expect(queryAllByText(UI.DELETE.nb)).toHaveLength(1)
    })

    expect(getData).toHaveBeenCalledTimes(4)
    expect(getData).toHaveBeenNthCalledWith(1, TEST_URLS.AGENT_SCHEMA_URL)
    expect(getData).toHaveBeenNthCalledWith(2, `${TEST_URLS.AGENT_BASE_URL}/${AgentData.id}`)
  })

  test('SaveData is triggeres correctly', async () => {
    putData.mockImplementation(() => Promise.resolve())

    const { getByText, queryAllByText } = setup(TEST_DOMAINS.AGENT, AgentData.id)

    await waitFor(() => {
      expect(queryAllByText(TEST_DOMAINS.AGENT)).toHaveLength(1)
      expect(queryAllByText(AgentData.id)).toHaveLength(1)
      expect(queryAllByText(UI.SAVE.nb)).toHaveLength(1)

      userEvent.click(queryAllByText('DRAFT')[0])
      userEvent.click(getByText(UI.SAVE.nb))
    })

    expect(putData).toHaveBeenCalledTimes(2)
  })
})

test('DomainSingle renders code block input for single code block correctly', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(ProcessStepInstanceSchema))
    .mockImplementationOnce(() => Promise.resolve(ProcessStepInstanceData))
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_agentInRoles resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_parameterInputs resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_processExecutionLog resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_processMetrics resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_transformableInputs resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_processSupportInputs resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_transformedOutputs resolve

  const { container } = setup(TEST_DOMAINS.PROCESS_STEP_INSTANCE, ProcessStepInstanceData.id)

  await waitFor(() => {
    expect(container.querySelector('.ace-editor')).toBeDefined()
  })
})

test('DomainSingle renders a button for multi code block input correctly', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(ProcessStepSchema))
    .mockImplementationOnce(() => Promise.resolve(ProcessStepData))
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_agentInRoles resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_processStepInstances resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_processControl resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_parentProcessStep resolve

  const { queryAllByText } = setup(TEST_DOMAINS.PROCESS_STEP, ProcessStepData.id)

  await waitFor(() => {
    expect(queryAllByText(UI.HANDLE_CODE_BLOCK.nb)).toHaveLength(1)
  })
})

// test('DomainSingle renders edit on fresh object correctly when good response from LDS', () => {
//   getData
//     .mockImplementationOnce(() => Promise.resolve(StatisticalProgramSchema))
//     .mockImplementationOnce(() => Promise.resolve([])) // _link_property_agentInRoles resolve
//     .mockImplementationOnce(() => Promise.resolve([])) // _link_property_parentStatisticalPrograms resolve
//     .mockImplementationOnce(() => Promise.resolve([])) // _link_property_statisticalProgramDesign resolve
//     .mockImplementationOnce(() => Promise.resolve([])) // _link_property_statisticalProgramCycles resolve
//
//   const { getByText } = setup(TEST_DOMAINS.STATISTICAL_PROGRAM, API.VIEWS.NEW)
//
//   expect(getByText(UI.SAVE.nb)).toBeDisabled()
//   expect(getByText(UI.DELETE.nb)).toBeDisabled()
//   expect(getData).toHaveBeenCalledTimes(5)
//   expect(getData).toHaveBeenNthCalledWith(1, TEST_URLS.STATISTICAL_PROGRAM_SCHEMA_URL)
// })

test('DomainSingle renders edit correctly when empty response from LDS', async () => {
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

test('DomainSingle renders edit correctly when bad schema response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject(ERRORS.ERROR.en))

  const { queryAllByText } = setup(TEST_DOMAINS.AGENT, AgentData.id)

  await waitFor(() => {
    expect(queryAllByText(ERRORS.ERROR.nb)).toHaveLength(1)
    expect(queryAllByText(ERRORS.ERROR.en)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith(TEST_URLS.AGENT_SCHEMA_URL)
})

test('DomainSingle renders edit correctly when bad data response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.reject(ERRORS.ERROR.en))

  const { queryAllByText } = setup(TEST_DOMAINS.AGENT, AgentData.id)

  await waitFor(() => {
    expect(queryAllByText(ERRORS.ERROR.nb)).toHaveLength(1)
    expect(queryAllByText(ERRORS.ERROR.en)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, TEST_URLS.AGENT_SCHEMA_URL)
  expect(getData).toHaveBeenNthCalledWith(2, `${TEST_URLS.AGENT_BASE_URL}/${AgentData.id}`)
})
