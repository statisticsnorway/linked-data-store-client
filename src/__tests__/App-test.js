import React from 'react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { render, waitFor } from '@testing-library/react'

import App from '../App'
import { getData } from '../utilities'
import { API, ERRORS, TEST_DOMAINS, TEST_URLS, UI } from '../enum'

import AboutSchema from './test-data/AboutSchema.json'

jest.mock('../utilities/fetch/Fetch', () => ({ getData: jest.fn() }))

afterEach(() => {
  getData.mockReset()
})

const TEST_ID = 'health'

const setup = () => {
  const { container, getByPlaceholderText, getByTestId, getByText, queryAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

  return { container, getByPlaceholderText, getByTestId, getByText, queryAllByText }
}

test('App renders correctly when response good from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve([`/data/${TEST_DOMAINS.AGENT}${API.SCHEMA_QUERY}`]))
    .mockImplementationOnce(() => Promise.resolve(AboutSchema))

  const { getByTestId, queryAllByText } = setup()

  await waitFor(() => {
    expect(getByTestId(TEST_ID)).toHaveClass('green')
    expect(queryAllByText(TEST_DOMAINS.AGENT)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenCalledWith(TEST_URLS.BASE_SCHEMAS_URL)
  expect(getData).toHaveBeenCalledWith(TEST_URLS.ABOUT_SCHEMA_URL)
})

// test('Changing language works correctly', async () => {
//   getData.mockImplementation(() => Promise.resolve([]))
//
//   const { getByText, queryAllByText } = setup()
//
//   await waitFor(() => {
//     expect(queryAllByText(`${UI.LANGUAGE.nb} (${UI.LANGUAGE_CHOICE.nb})`)).toHaveLength(1)
//     userEvent.click(getByText(UI.ENGLISH.nb))
//     expect(queryAllByText(`${UI.LANGUAGE.en} (${UI.LANGUAGE_CHOICE.en})`)).toHaveLength(1)
//     userEvent.click(getByText(UI.NORWEGIAN.en))
//     expect(queryAllByText(`${UI.LANGUAGE.nb} (${UI.LANGUAGE_CHOICE.nb})`)).toHaveLength(1)
//   })
// })

describe('Navigation', () => {
  beforeEach(() => {
    getData
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve(AboutSchema))
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve(AboutSchema))
  })

  test('All navigation works', async () => {
    const { container, getByText, queryAllByText } = setup()

    await waitFor(() => {
      userEvent.click(container.querySelector('a[href="/settings"]'))
      expect(queryAllByText(UI.SETTINGS_HEADER.nb)).toHaveLength(1)
      userEvent.click(getByText(UI.IMPORT.nb))
      expect(queryAllByText(UI.UPLOAD.nb)).toHaveLength(1)
      userEvent.click(getByText(UI.HEADER.nb))
      expect(queryAllByText(UI.SETTINGS_HEADER.nb)).toHaveLength(1)
      userEvent.click(getByText(UI.EXPLORE.nb))
      expect(queryAllByText(UI.SETTINGS_HEADER.nb)).toHaveLength(0)
    })
  })

  // test('Changing settings works correctly', async () => {
  //   const { getByPlaceholderText, getByText, queryAllByText } = setup()
  //
  //   await userEvent.type(getByPlaceholderText(UI.USER.nb), 'Mr. Test')
  //   expect(getByText(MESSAGES.NEW_VALUES.nb)).toBeInTheDocument()
  //
  //   userEvent.click(getByText(UI.APPLY.nb))
  //   expect(getData).toHaveBeenCalledTimes(4)
  //   expect(getData).toHaveBeenCalledWith(TEST_URLS.BASE_SCHEMAS_URL)
  //   expect(getData).toHaveBeenCalledWith(TEST_URLS.ABOUT_SCHEMA_URL)
  // })
})

test('App renders correctly when bad response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject(ERRORS.ERROR.en))

  const { getByTestId, queryAllByText } = setup()

  await waitFor(() => {
    expect(getByTestId(TEST_ID)).toHaveClass('red')
    expect(queryAllByText(ERRORS.ERROR.en)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith(TEST_URLS.BASE_SCHEMAS_URL)
})
