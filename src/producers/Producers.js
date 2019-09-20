import { setVersion } from '../utilities/schema-handling/AutofillHandling'
import { API } from '../enum'

const uuidv4 = require('uuid/v4')

export const producers = {
  [API.DEFAULT_PRODUCER]: {
    grouping: {
      autofilled: ['id', 'createdDate', 'createdBy', 'version', 'versionValidFrom', 'lastUpdatedDate', 'lastUpdatedBy', 'validFrom', 'validUntil'],
      common: ['name', 'description', 'administrativeStatus', 'versionRationale', 'administrativeDetails', 'agentInRoles']
    },
    autofillTypes: {
      user: ['createdBy', 'lastUpdatedBy']
    },
    tableHeaders: {
      default: ['name', 'description', 'id'],
      DimensionalDataSet: ['name', 'description', 'dataSetState', 'dimensionalDataStructure', 'metadataSourcePath', 'dataSourcePath', 'agentInRoles', 'version', 'id'],
      UnitDataSet: ['name', 'description', 'dataSetState', 'unitDataStructure', 'metadataSourcePath', 'dataSourcePath', 'agentInRoles', 'version', 'id']
    }
  },
  basic: {
    grouping: {
      autofilled: ['id'],
      common: []
    },
    autofillTypes: {
      user: []
    },
    tableHeaders: {
      default: ['id']
    }
  }
}

export const createAutofillData = (data, property, producer, user) => {
  switch (producer) {
    case API.DEFAULT_PRODUCER:
      switch (property) {
        case 'id':
          return uuidv4()

        case 'createdDate':
        case 'lastUpdatedDate':
        case 'versionValidFrom':
        case 'validFrom':
          const now = new Date()

          return now.toISOString()

        case 'validUntil':
          const future = new Date(new Date().setFullYear(new Date().getFullYear() + 1))

          return future.toISOString()

        case 'version':
          return '1.0.0'

        case 'createdBy':
        case 'lastUpdatedBy':
          return user

        default:
          return data
      }

    case 'basic':
      return property === 'id' ? uuidv4() : data

    default:
      return data
  }
}

export const updateAutofillData = (data, property, producer, user) => {
  switch (producer) {
    case API.DEFAULT_PRODUCER:
      switch (property) {
        case 'lastUpdatedDate':
        case 'versionValidFrom':
          const now = new Date()

          return now.toISOString()

        case 'validUntil':
          const future = new Date(new Date().setFullYear(new Date().getFullYear() + 1))

          return future.toISOString()

        case 'version':
          return setVersion(data)

        case 'lastUpdatedBy':
          return user

        default:
          return data
      }

    case 'basic':
      return data

    default:
      return data
  }
}

export const extractStringFromObject = (object, producer, language) => {
  if (typeof object === 'object' && object !== null) {
    if (producer === API.DEFAULT_PRODUCER) {
      const nameObject = object.find(object => object.languageCode === language)

      return `${nameObject === undefined ? object[0].languageText : nameObject.languageText}`
    } else {
      return object.toString()
    }
  } else {
    return object
  }
}
