import React from 'react'
import { fireEvent, render, wait } from '@testing-library/react'

import { LanguageContext } from '../utilities/context/LanguageContext'
import MultiCodeBlockDetails from '../components/MultiCodeBlockDetails'
import CodeBlockDetails from '../components/CodeBlockDetails'
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
    data: ProcessStepInstanceData.codeBlock,
    uiSchema: fullUiSchema.unique.codeBlock
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
    <LanguageContext.Provider value={{ value: API.DEFAULT_LANGUAGE }}>
      <MultiCodeBlockDetails {...props} />
    </LanguageContext.Provider>
  )

  return { getByText, queryAllByText }
}

test('CodeBlockDetails renders modal correctly', async () => {
  const { getByText, queryAllByText } = setupSingle()

  await wait(() => {
    fireEvent.click(getByText(UI.VIEW_CODE_BLOCK.nb))

    expect(queryAllByText(`Code block`)).toHaveLength(1)
  })
})

test('MultiCodeBlockDetails renders modal and correct amount of code blocks', async () => {
  const { getByText, queryAllByText } = setupMulti()

  await wait(() => {
    fireEvent.click(getByText(UI.VIEW_CODE_BLOCK.nb))

    expect(queryAllByText(new RegExp('^' + UI.ZEPPELIN_PARAGRAPH_INDEX.nb))).toHaveLength(11)
  })
})
