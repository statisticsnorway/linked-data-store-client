import React from 'react'
import 'jest-dom/extend-expect'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, fireEvent, render, waitForElement } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import Import from '../pages/import/Import'
import { putData } from '../utilities/fetch/Fetch'
import { UI } from '../enum'

import AgentData from './test-data/AgentData'

jest.mock('../utilities/fetch/Fetch', () => ({ putData: jest.fn() }))

afterEach(() => {
  putData.mockReset()
  cleanup()
})

const setup = () => {
  const props = {
    lds: {
      namespace: 'ns',
      producer: 'gsim',
      url: 'http://localhost:9090',
      user: 'Test user'
    }
  }

  const { getByTestId, getByText, queryAllByText } = render(
    <MemoryRouter>
      <LanguageContext.Provider value={{ value: 'nb' }}>
        <Import {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { getByTestId, getByText, queryAllByText }
}

test('Import renders correctly when response from LDS', async () => {
  putData.mockImplementationOnce(() => Promise.resolve())

  const { getByTestId, getByText, queryAllByText } = setup()
  const fileUploader = getByTestId('fileUploader')

  expect(fileUploader).not.toBeVisible()

  fireEvent.change(fileUploader, {
    target: {
      files: [
        new File([JSON.stringify(AgentData)], 'AgentExample.json', { type: 'application/json' })
      ]
    }
  })

  await waitForElement(() => getByText(UI.IMPORTING_SUCCESS.nb))

  expect(queryAllByText('1 / 1')).toHaveLength(1)
})

test('Import renders correctly when bad response from LDS', async () => {
  putData.mockImplementation(() => Promise.reject('Error'))

  const { getByTestId, getByText, queryAllByText } = setup()
  const fileUploader = getByTestId('fileUploader')

  expect(fileUploader).not.toBeVisible()

  fireEvent.change(fileUploader, {
    target: {
      files: [
        new File([JSON.stringify(AgentData)], 'AgentExample.json', { type: 'application/json' })
      ]
    }
  })

  await waitForElement(() => getByText(UI.IMPORTING_SUCCESS.nb))

  expect(queryAllByText('0 / 1')).toHaveLength(1)
  expect(queryAllByText('AgentExample.json')).toHaveLength(1)
  expect(queryAllByText('Error')).toHaveLength(1)
})
