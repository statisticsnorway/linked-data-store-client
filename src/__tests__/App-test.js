import React from 'react'
import { toHaveClass } from '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import App from '../App'
import { getData } from '../utilities/fetch/Fetch'
import { API, ERRORS, MESSAGES, TEST_DOMAINS, TEST_URLS, UI } from '../enum'

import AboutData from './test-data/AboutData'

expect.extend({ toHaveClass })

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

const TEST_ID = 'health'

const setup = () => {
  const { container, getByPlaceholderText, getByTestId, getByText, queryAllByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  return { container, getByPlaceholderText, getByTestId, getByText, queryAllByText }
}

test('App renders correctly when response good from LDS', async () => {
  getData
    .mockImplementationOnce(() => Promise.resolve([`/data/${TEST_DOMAINS.AGENT}${API.SCHEMA_QUERY}`]))
    .mockImplementationOnce(() => Promise.resolve(AboutData))

  const { getByTestId, queryAllByText } = setup()

  await wait(() => {
    expect(getByTestId(TEST_ID)).toHaveClass('green')
    expect(queryAllByText(TEST_DOMAINS.AGENT)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(2)
  expect(getData).toHaveBeenCalledWith(TEST_URLS.BASE_SCHEMAS_URL)
  expect(getData).toHaveBeenCalledWith(TEST_URLS.ABOUT_SCHEMA_URL)
})

test('Changing language works correctly', async () => {
  getData.mockImplementation(() => Promise.resolve([]))

  const { getByText, queryAllByText } = setup()

  await wait(() => {
    expect(queryAllByText(`${UI.LANGUAGE.nb} (${UI.LANGUAGE_CHOICE.nb})`)).toHaveLength(1)
    fireEvent.click(getByText(UI.ENGLISH.nb))
    expect(queryAllByText(`${UI.LANGUAGE.en} (${UI.LANGUAGE_CHOICE.en})`)).toHaveLength(1)
    fireEvent.click(getByText(UI.NORWEGIAN.en))
    expect(queryAllByText(`${UI.LANGUAGE.nb} (${UI.LANGUAGE_CHOICE.nb})`)).toHaveLength(1)
  })
})

describe('Navigation', () => {
  beforeEach(() => {
    getData
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve(AboutData))
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve(AboutData))
  })

  test('All navigation works', async () => {
    const { container, getByText, queryAllByText } = setup()

    await wait(() => {
      fireEvent.click(container.querySelector('a[href="/settings"]'))
      expect(queryAllByText(UI.SETTINGS_HEADER.nb)).toHaveLength(1)
      fireEvent.click(getByText(UI.IMPORT.nb))
      expect(queryAllByText(UI.UPLOAD.nb)).toHaveLength(1)
      fireEvent.click(getByText(UI.HEADER.nb))
      expect(queryAllByText(UI.SETTINGS_HEADER.nb)).toHaveLength(1)
      fireEvent.click(getByText(UI.EXPLORE.nb))
      expect(queryAllByText(UI.SETTINGS_HEADER.nb)).toHaveLength(0)
    })
  })

  test('Changing settings works correctly', async () => {
    const { getByPlaceholderText, getByText, queryAllByText } = setup()

    await wait(() => {
      fireEvent.change(getByPlaceholderText(UI.USER.nb), { target: { value: 'Mr. Test' } })
      expect(queryAllByText(MESSAGES.NEW_VALUES.nb)).toHaveLength(1)
      fireEvent.click(getByText(UI.APPLY.nb))
    })

    expect(getData).toHaveBeenCalledTimes(4)
    expect(getData).toHaveBeenCalledWith(TEST_URLS.BASE_SCHEMAS_URL)
    expect(getData).toHaveBeenCalledWith(TEST_URLS.ABOUT_SCHEMA_URL)
  })
})

test('App renders correctly when bad response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject(ERRORS.ERROR.en))

  const { getByTestId, queryAllByText } = setup()

  await wait(() => {
    expect(getByTestId(TEST_ID)).toHaveClass('red')
    expect(queryAllByText(ERRORS.ERROR.en)).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith(TEST_URLS.BASE_SCHEMAS_URL)
})
