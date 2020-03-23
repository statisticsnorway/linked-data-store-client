import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, wait } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import { CodeBlockDetails, MultiCodeBlockDetails } from '../components'
import { API, LDS_TEST_PROPERTIES, TEST_DOMAINS, UI } from '../enum'
import { createUiSchema } from '../utilities'

import ProcessStepSchema from './test-data/ProcessStepSchema'
import ProcessStepData from './test-data/ProcessStepData'
import ProcessStepInstanceSchema from './test-data/ProcessStepInstanceSchema'
import ProcessStepInstanceData from './test-data/ProcessStepInstanceData'

jest.mock('react-ace')

const setupSingle = () => {
  const fullUiSchema = createUiSchema(ProcessStepInstanceSchema.definitions, LDS_TEST_PROPERTIES, TEST_DOMAINS.PROCESS_STEP_INSTANCE)

  const props = {
    data: ProcessStepInstanceData.processExecutionCode,
    uiSchema: fullUiSchema.unique.processExecutionCode
  }

  const { getByText, queryAllByText } = render(
    <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
      <CodeBlockDetails {...props} />
    </LanguageContext.Provider>
  )

  return { getByText, queryAllByText }
}

const setupMulti = () => {
  const fullUiSchema = createUiSchema(ProcessStepSchema.definitions, LDS_TEST_PROPERTIES, TEST_DOMAINS.PROCESS_STEP)

  const props = {
    data: ProcessStepData.codeBlocks,
    uiSchema: fullUiSchema.unique.codeBlocks
  }

  const { getByText, queryAllByText } = render(
    <MemoryRouter>
      <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
        <MultiCodeBlockDetails {...props} />
      </LanguageContext.Provider>
    </MemoryRouter>
  )

  return { getByText, queryAllByText }
}

test('CodeBlockDetails renders modal correctly', async () => {
  const { getByText, queryAllByText } = setupSingle()

  await wait(() => {
    fireEvent.click(getByText(UI.VIEW_CODE_BLOCK.nb))

    expect(queryAllByText(ProcessStepInstanceSchema.definitions.ProcessStepInstance.properties.processExecutionCode.displayName))
      .toHaveLength(1)
  })
})

test('MultiCodeBlockDetails renders modal and correct amount of code blocks', async () => {
  const { getByText, queryAllByText } = setupMulti()

  await wait(() => {
    fireEvent.click(getByText(UI.VIEW_CODE_BLOCK.nb))
    fireEvent.click(getByText(`${ProcessStepData.codeBlocks[3].codeBlockTitle} - ${UI.ZEPPELIN_PARAGRAPH_INDEX.nb}: ${ProcessStepData.codeBlocks[3].codeBlockIndex}`))

    expect(queryAllByText(UI.ZEPPELIN_PARAGRAPH_INDEX.nb, { exact: false })).toHaveLength(4)
  })
})
