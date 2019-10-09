import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { DomainSingle } from '../pages'
import { getData } from '../utilities/fetch/Fetch'
import { API, LDS_TEST_PROPERTIES, TEST_DOMAINS } from '../enum'

import AssessmentSchema from './test-data/AssessmentSchema'

jest.mock('../utilities/fetch/Fetch', () => ({ getData: jest.fn() }))

beforeEach(() => {
  getData
    .mockImplementationOnce(() => Promise.resolve(AssessmentSchema))
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_AgentInRoles resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_statisticalNeeds #1 resolve
    .mockImplementationOnce(() => Promise.resolve([])) // _link_property_statisticalNeeds #2 resolve
})

afterEach(() => {
  getData.mockReset()
  cleanup()
})

const ADD_TEST_ID = 'add-date-item'
const REMOVE_TEST_ID = 'remove-date-item'
const PLACEHOLDER_TEXT = AssessmentSchema.definitions[TEST_DOMAINS.ASSESSMENT].properties.datesAssessed.displayName

const setup = () => {
  const props = {
    lds: LDS_TEST_PROPERTIES,
    params: {
      domain: TEST_DOMAINS.ASSESSMENT,
      id: API.VIEWS.NEW,
      view: API.VIEWS.EDIT
    }
  }

  const { getByTestId, queryAllByPlaceholderText } = render(
    <MemoryRouter>
      <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
        <DomainSingle {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { getByTestId, queryAllByPlaceholderText }
}

test('Clicking the add-date-item link adds a date input field', async () => {
  const { getByTestId, queryAllByPlaceholderText } = setup()

  await wait(() => {
    fireEvent.click(getByTestId(ADD_TEST_ID))

    expect(queryAllByPlaceholderText(PLACEHOLDER_TEXT)).toHaveLength(2)
  })
})

test('Clicking the remove-date-item link removes a date input field', async () => {
  const { getByTestId, queryAllByPlaceholderText } = setup()

  await wait(() => {
    fireEvent.click(getByTestId(REMOVE_TEST_ID))

    expect(queryAllByPlaceholderText(PLACEHOLDER_TEXT)).toHaveLength(0)
  })
})
