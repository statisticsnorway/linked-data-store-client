import { ERRORS } from '../../enum'

export const validateAndClean = (dataObject, draft = false, groupings, languageCode, uiSchema) => {
  const data = JSON.parse(JSON.stringify(dataObject))
  const errors = {}

  groupings.forEach(grouping => {
    Object.keys(uiSchema[grouping]).forEach(property => {
      if (data.hasOwnProperty(property)) {
        const uiSchemaProp = uiSchema[grouping][property]

        if (uiSchemaProp.hasOwnProperty('input')) {
          const multiple = uiSchemaProp.input.multiple
          const required = draft ? false : uiSchemaProp.input.required // There is an ongoing discussion on how to solve this at the moment. This should maybe only apply to dropdowns with required (if DRAFT and empty and required, generage mock link so LDS accepts storage is one potential workaround).
          const type = uiSchemaProp.input.type

          switch (type) {
            case 'boolean':
              if (typeof data[property] !== 'boolean') {
                errors[property] = ERRORS.WRONG_TYPE[languageCode]
              }
              break

            case 'date':
            case 'dropdown':
              const noValue = type === 'dropdown' ? '' : null

              if (multiple) {
                data[property] = data[property].filter(value => value !== noValue)

                if (data[property].length === 0) {
                  required ? errors[property] = ERRORS.EMPTY_VALUES[languageCode] : delete data[property]
                }
              } else {
                if (data[property] === noValue) {
                  required ? errors[property] = ERRORS.EMPTY_VALUE[languageCode] : delete data[property]
                }
              }
              break

            case 'multiInput':
              if (multiple) {
                const multipleValues = uiSchemaProp.input.value.multiple
                const optionHandler = uiSchemaProp.input.option.handler
                const valueHandler = uiSchemaProp.input.value.handler

                if (multipleValues) {
                  data[property] = data[property].filter(value =>
                    value[optionHandler] !== '' && value[valueHandler].filter(item => item !== '').length !== 0
                  )

                  if (data[property].length === 0) {
                    required ? errors[property] = ERRORS.EMPTY_VALUES[languageCode] : delete data[property]
                  }
                } else {
                  data[property] = data[property].filter(value =>
                    value[optionHandler] !== '' && value[valueHandler] !== ''
                  )

                  if (data[property].length === 0) {
                    required ? errors[property] = ERRORS.EMPTY_VALUES[languageCode] : delete data[property]
                  }
                }
              } else {
                // TODO: Don't think this is ever the case so far, but beware of it
              }
              break

            case 'radio':
              if (data[property] === '') {
                required ? errors[property] = ERRORS.EMPTY_CHOICE[languageCode] : delete data[property]
              }
              break

            default:
              if (data[property] === '') {
                required ? errors[property] = ERRORS.EMPTY_VALUE[languageCode] : delete data[property]
              }
          }
        }
      }
    })
  })

  return {data: data, errors: errors}
}
