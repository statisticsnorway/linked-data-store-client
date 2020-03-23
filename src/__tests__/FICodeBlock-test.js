import React from 'react'
import { fireEvent, render, wait } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import FIMultiCodeBlock from '../components/form-inputs/FIMultiCodeBlock'
import { API, LDS_TEST_PROPERTIES, TEST_DOMAINS, UI } from '../enum'
import { createUiSchema } from '../utilities'

import ProcessStepSchema from './test-data/ProcessStepSchema'
import ProcessStepData from './test-data/ProcessStepData'

jest.mock('react-ace')

const setup = () => {
  const fullUiSchema = createUiSchema(ProcessStepSchema.definitions, LDS_TEST_PROPERTIES, TEST_DOMAINS.PROCESS_STEP)

  const props = {
    value: ProcessStepData.codeBlocks,
    uiSchema: fullUiSchema.unique.codeBlocks
  }

  const { getByText, queryAllByText } = render(
    <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
      <FIMultiCodeBlock {...props} />
    </LanguageContext.Provider>
  )

  return { getByText, queryAllByText }
}

test('FIMultiCodeBlock renders modal and correct amount of code blocks', async () => {
  const { getByText, queryAllByText } = setup()

  await wait(() => {
    fireEvent.click(getByText(UI.HANDLE_CODE_BLOCK.nb))
    fireEvent.click(getByText(`${UI.ZEPPELIN_PARAGRAPH_INDEX.nb}: ${ProcessStepData.codeBlocks[3].codeBlockIndex}`))

    expect(queryAllByText(UI.ZEPPELIN_PARAGRAPH_INDEX.nb, { exact: false })).toHaveLength(4)
  })
})
