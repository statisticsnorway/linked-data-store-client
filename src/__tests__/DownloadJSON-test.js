import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { DownloadJSON } from '../components'
import { createUiSchema } from '../utilities'
import { API, LDS_TEST_PROPERTIES, TEST_DOMAINS, UI } from '../enum'

import AgentSchema from './test-data/AgentSchema'
import AgentData from './test-data/AgentData'

const setup = () => {
  const props = {
    data: AgentData,
    lds: LDS_TEST_PROPERTIES,
    uiSchema: createUiSchema(AgentSchema.definitions, LDS_TEST_PROPERTIES, TEST_DOMAINS.AGENT)
  }

  const { getByText } = render(
    <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
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

  userEvent.click(getByText(UI.DOWNLOAD_JSON.nb))

  expect(document.body.appendChild).toBeCalledWith(
    expect.any(HTMLElement)
  )
  expect(document.body.removeChild).toBeCalledWith(
    expect.any(HTMLElement)
  )
})
