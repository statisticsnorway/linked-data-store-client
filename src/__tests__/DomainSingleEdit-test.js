import React from 'react'
import { toBeDisabled } from '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import DomainSingle from '../pages/domain/single/DomainSingle'
import { deleteData, getData, putData } from '../utilities/fetch/Fetch'
import { ERRORS, MESSAGES, UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'
import StatisticalProgramSchema from './test-data/StatisticalProgramSchema'

expect.extend({ toBeDisabled })

jest.mock('../utilities/fetch/Fetch', () => ({ deleteData: jest.fn(), getData: jest.fn(), putData: jest.fn() }))

afterEach(() => {
  deleteData.mockReset()
  getData.mockReset()
  putData.mockReset()
  cleanup()
})

const setup = (domain, id) => {
  const props = {
    lds: {
      namespace: 'ns',
      producer: 'gsim',
      url: 'http://localhost:9090',
      user: 'Test user'
    },
    params: {
      domain: domain,
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

  const { queryAllByText } = setup('Agent', '903c45b1-7f69-4ee4-b6f3-d95aba633297')

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
    .mockImplementationOnce(() => Promise.resolve(StatisticalProgramSchema))
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_agentInRoles resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_parentStatisticalPrograms resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_statisticalProgramDesign resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_statisticalProgramCycles resolve

  const { getByText } = setup('StatisticalProgram', 'new')

  await wait(() => {
    expect(getByText(UI.SAVE.nb)).toBeDisabled()
    expect(getByText(UI.DELETE.nb)).toBeDisabled()
  })

  expect(getData).toHaveBeenCalledTimes(5)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/StatisticalProgram?schema')
})

test('DomainSingle renders edit correctly when empty response from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve([]))

  const { queryAllByText } = setup('Agent', '903c45b1-7f69-4ee4-b6f3-d95aba633297')

  await wait(() => {
    expect(queryAllByText(MESSAGES.NOTHING_FOUND.nb)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent/903c45b1-7f69-4ee4-b6f3-d95aba633297')
})

test('DomainSingle renders edit correctly when bad schema response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject('Error'))

  const { queryAllByText } = setup('Agent', '903c45b1-7f69-4ee4-b6f3-d95aba633297')

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

  const { queryAllByText } = setup('Agent', '903c45b1-7f69-4ee4-b6f3-d95aba633297')

  await wait(() => {
    expect(queryAllByText(ERRORS.ERROR.nb)).toHaveLength(1)
    expect(queryAllByText('Error')).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenNthCalledWith(1, 'http://localhost:9090/ns/Agent?schema')
  expect(getData).toHaveBeenNthCalledWith(2, 'http://localhost:9090/ns/Agent/903c45b1-7f69-4ee4-b6f3-d95aba633297')
})

test('SaveData is triggeres correctly', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AgentSchema))
    .mockImplementationOnce(() => Promise.resolve(AgentData))
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_agentInRoles resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_parentAgents resolve

  putData.mockImplementation(() => Promise.resolve())

  const { getByText, queryAllByText } = setup('Agent', '903c45b1-7f69-4ee4-b6f3-d95aba633297')

  await wait(() => {
    expect(queryAllByText('Agent')).toHaveLength(1)
    expect(queryAllByText('903c45b1-7f69-4ee4-b6f3-d95aba633297')).toHaveLength(1)
    expect(queryAllByText(UI.SAVE.nb)).toHaveLength(1)

    fireEvent.click(queryAllByText('DRAFT')[0])
    fireEvent.click(getByText(UI.SAVE.nb))
  })

  expect(putData).toHaveBeenCalledTimes(1)
})
