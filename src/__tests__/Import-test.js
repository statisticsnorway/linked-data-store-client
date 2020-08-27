import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { Import } from '../pages'
import { putData } from '../utilities'
import { API, ERRORS, LDS_TEST_PROPERTIES, UI } from '../enum'

import AgentData from './test-data/AgentData'

jest.mock('../utilities/fetch/Fetch', () => ({ putData: jest.fn() }))

afterEach(() => {
  putData.mockReset()
})

const FILE = 'AgentExample.json'
const FILE_TYPE = 'application/json'
const TEST_ID = 'fileUploader'

const setup = () => {
  const { getByTestId, getByText, queryAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
        <Import lds={LDS_TEST_PROPERTIES} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { getByTestId, getByText, queryAllByText }
}

test('Import renders correctly when response from LDS', async () => {
  putData.mockImplementationOnce(() => Promise.resolve())

  const { getByTestId, getByText, queryAllByText } = setup()
  const fileUploader = getByTestId(TEST_ID)

  expect(fileUploader).not.toBeVisible()

  fireEvent.change(fileUploader, {
    target: {
      files: [
        new File([JSON.stringify(AgentData)], FILE, { type: FILE_TYPE })
      ]
    }
  })

  await waitFor(() => getByText(UI.IMPORTING_SUCCESS.nb))

  expect(queryAllByText('1 / 1')).toHaveLength(1)
})

test('Import renders correctly when bad response from LDS', async () => {
  putData.mockImplementation(() => Promise.reject(ERRORS.ERROR.en))

  const { getByTestId, getByText, queryAllByText } = setup()
  const fileUploader = getByTestId(TEST_ID)

  expect(fileUploader).not.toBeVisible()

  fireEvent.change(fileUploader, {
    target: {
      files: [
        new File([JSON.stringify(AgentData)], FILE, { type: FILE_TYPE })
      ]
    }
  })

  await waitFor(() => getByText(UI.IMPORTING_SUCCESS.nb))

  expect(queryAllByText('0 / 1')).toHaveLength(1)
  expect(queryAllByText(FILE)).toHaveLength(1)
  expect(queryAllByText(ERRORS.ERROR.en)).toHaveLength(1)
})
