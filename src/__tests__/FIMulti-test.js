import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { DomainSingle } from '../pages'
import { getData } from '../utilities'
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
})

// const ADD_DATE_TEST_ID = 'add-date-item'
// const REMOVE_DATE_TEST_ID = 'remove-date-item'
// const PLACEHOLDER_TEXT_DATE = AssessmentSchema.definitions[TEST_DOMAINS.ASSESSMENT].properties.datesAssessed.displayName
// const ADD_ITEM_TEST_ID = 'add-input-item'
// const REMOVE_ITEM_TEST_ID = 'remove-input-item'
// const PLACEHOLDER_TEXT_ITEM = AssessmentSchema.definitions[TEST_DOMAINS.MULTILINGUAL_TEXT].properties.languageText.displayName
// const ADD_VALUE_TEST_ID = 'add-input-value'
// const REMOVE_VALUE_TEST_ID = 'remove-input-value'
// const PLACEHOLDER_TEXT_VALUE = AssessmentSchema.definitions[TEST_DOMAINS.ADMINISTRATIVE_DETAILS].properties.values.displayName

const setup = () => {
  const props = {
    lds: LDS_TEST_PROPERTIES,
    params: {
      domain: TEST_DOMAINS.ASSESSMENT,
      id: API.VIEWS.NEW,
      view: API.VIEWS.EDIT
    }
  }

  const { getAllByTestId, getByTestId, queryAllByPlaceholderText } = render(
    <MemoryRouter initialEntries={['/gsim/Assesment/new/edit']}>
      <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
        <DomainSingle {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { getAllByTestId, getByTestId, queryAllByPlaceholderText }
}

test('Dummy test', () => {
  setup()
})

// test('Clicking the add-date-item link adds a date input field', async () => {
//   const { getByTestId, queryAllByPlaceholderText } = setup()
//
//   userEvent.click(getByTestId(ADD_DATE_TEST_ID))
//
//   await waitFor(() => {
//     expect(queryAllByPlaceholderText(PLACEHOLDER_TEXT_DATE)).toHaveLength(2)
//   })
// })
//
// test('Clicking the remove-date-item link removes a date input field', async () => {
//   const { getByTestId, queryAllByPlaceholderText } = setup()
//
//   userEvent.click(getByTestId(REMOVE_DATE_TEST_ID))
//
//   await waitFor(() => {
//     expect(queryAllByPlaceholderText(PLACEHOLDER_TEXT_DATE)).toHaveLength(0)
//   })
// })
//
// test('Clicking the add-input-item link adds a input field to the form field', async () => {
//   const { getAllByTestId, queryAllByPlaceholderText } = setup()
//
//   userEvent.click(getAllByTestId(ADD_ITEM_TEST_ID)[0])
//
//   await waitFor(() => {
//     expect(queryAllByPlaceholderText(PLACEHOLDER_TEXT_ITEM)).toHaveLength(7)
//   })
// })
//
// test('Clicking the remove-input-item link removes a input field from the form field', async () => {
//   const { getAllByTestId, queryAllByPlaceholderText } = setup()
//
//   userEvent.click(getAllByTestId(REMOVE_ITEM_TEST_ID)[0])
//
//   await waitFor(() => {
//     expect(queryAllByPlaceholderText(PLACEHOLDER_TEXT_ITEM)).toHaveLength(5)
//   })
// })
//
// test('Clicking the add-input-value link adds a value input field to the form field', async () => {
//   const { getByTestId, queryAllByPlaceholderText } = setup()
//
//   userEvent.click(getByTestId(ADD_VALUE_TEST_ID))
//
//   await waitFor(() => {
//     expect(queryAllByPlaceholderText(PLACEHOLDER_TEXT_VALUE)).toHaveLength(2)
//   })
// })
//
// test('Clicking the remove-input-value link removes a value input field from the form field', async () => {
//   const { getByTestId, queryAllByPlaceholderText } = setup()
//
//   userEvent.click(getByTestId(REMOVE_VALUE_TEST_ID))
//
//   await waitFor(() => {
//     expect(queryAllByPlaceholderText(PLACEHOLDER_TEXT_VALUE)).toHaveLength(0)
//   })
// })
