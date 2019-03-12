import React from 'react'
import 'jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, fireEvent, render, wait } from 'react-testing-library'

import App from '../App'
import { getData } from '../utilities/fetch/Fetch'
import { UI } from '../enum'

jest.mock('../utilities/fetch/Fetch', () => ({getData: jest.fn()}))

afterEach(() => {
  getData.mockReset()
  cleanup()
})

const setup = () => {
  const {container, getByTestId, getByText, queryAllByText} = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  return {container, getByTestId, getByText, queryAllByText}
}

describe('Testing App with good response', () => {
  beforeEach(() => {
    getData.mockImplementation(() => Promise.resolve(['/data/Agent?schema']))
  })

  test('App renders correctly when response good from LDS', async () => {
    const {getByTestId, queryAllByText} = setup()

    await wait(() => {
      expect(getByTestId('health')).toHaveClass('green')
      expect(queryAllByText('Agent')).toHaveLength(1)
    })

    expect(getData).toHaveBeenCalledTimes(1)
    expect(getData).toHaveBeenCalledWith('http://localhost:9090/data?schema')
  })

  test('Changing language works correctly', async () => {
    const {getByText, queryAllByText} = setup()

    await wait(() => {
      expect(queryAllByText(`${UI.LANGUAGE.nb} (${UI.LANGUAGE_CHOICE.nb})`)).toHaveLength(1)
      fireEvent.click(getByText(`${UI.ENGLISH.nb}`))
      expect(queryAllByText(`${UI.LANGUAGE.en} (${UI.LANGUAGE_CHOICE.en})`)).toHaveLength(1)
      fireEvent.click(getByText(`${UI.NORWEGIAN.en}`))
      expect(queryAllByText(`${UI.LANGUAGE.nb} (${UI.LANGUAGE_CHOICE.nb})`)).toHaveLength(1)
    })
  })

  test('All navigation works', async () => {
    const {container, getByText, queryAllByText} = setup()

    await wait(() => {
      fireEvent.click(container.querySelector('a[href="/settings"]'))
      expect(queryAllByText(`${UI.SETTINGS_HEADER.nb}`)).toHaveLength(1)
      fireEvent.click(getByText(`${UI.IMPORT.nb}`))
      expect(queryAllByText(`${UI.UPLOAD.nb}`)).toHaveLength(1)
      fireEvent.click(getByText(`${UI.HEADER.nb}`))
      expect(queryAllByText(`${UI.SETTINGS_HEADER.nb}`)).toHaveLength(1)
    })
  })
})

test('App renders correctly when bad response from LDS', async () => {
  getData.mockImplementation(() => Promise.reject('Error'))

  const {getByTestId, queryAllByText} = setup()

  await wait(() => {
    expect(getByTestId('health')).toHaveClass('red')
    expect(queryAllByText('Error')).toHaveLength(1)
  })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith('http://localhost:9090/data?schema')
})
