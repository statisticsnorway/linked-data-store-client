export {
  extractDomainFromString, extractDomainFromFilename, extractReferenceFromString, truncateString
} from './common/StringHandling'
export { convertDataToView, createDefaultData } from './data-handling/DataHandling'
export { validateAndClean } from './data-handling/DataValidation'
export { deleteData, getData, putData } from './fetch/Fetch'
export { createUiSchema } from './schema-handling/SchemaHandling'
