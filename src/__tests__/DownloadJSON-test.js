import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import DownloadJSON from '../components/DownloadJSON'
import { createUiSchema } from '../utilities'
import { UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'

afterEach(() => {
  cleanup()
})

const setup = () => {
  const lds = {
    namespace: 'ns',
    producer: 'gsim',
    url: 'http://localhost:9090',
    user: 'Test user'
  }

  const props = {
    data: AgentData,
    lds: lds,
    uiSchema: createUiSchema(AgentSchema.definitions, lds, 'Agent')
  }

  const { getByText } = render(
    <LanguageContext.Provider value={{ value: 'nb' }}>
      <DownloadJSON {...props} />
    </LanguageContext.Provider>
  )

  return { getByText }
}

test('DownloadJSON works on existing object', () => {
  jest.spyOn(document.body, 'appendChild')
  jest.spyOn(document.body, 'removeChild')
  global.URL.createObjectURL = jest.fn()

  const { getByText } = setup()

  fireEvent.click(getByText(UI.DOWNLOAD_JSON.nb))

  expect(document.body.appendChild).toBeCalledWith(
    expect.any(HTMLElement)
  )
  expect(document.body.removeChild).toBeCalledWith(
    expect.any(HTMLElement)
  )
})
