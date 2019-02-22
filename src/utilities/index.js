export {
  extractDomainFromString,
  extractDomainFromFilename,
  extractReferenceFromString,
  truncateString,
  extractStringFromObject
} from './common/StringHandling'
export { convertDataToView, createDefaultData } from './data-handling/DataHandling'
export { validateAndClean } from './data-handling/DataValidation'
export { deleteData, getData, putData } from './fetch/Fetch'
export { createUiSchema } from './schema-handling/SchemaHandling'
