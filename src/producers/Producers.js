import { setVersion } from '../utilities/schema-handling/AutofillHandling'

const uuidv4 = require('uuid/v4')

export const producers = {
  gsim: {
    grouping: {
      autofilled: ['id', 'createdDate', 'createdBy', 'version', 'versionValidFrom', 'lastUpdatedDate', 'lastUpdatedBy', 'validFrom', 'validUntil'],
      common: ['name', 'description', 'administrativeStatus', 'versionRationale', 'administrativeDetails', 'agentInRoles']
    },
    autofillTypes: {
      user: ['createdBy', 'lastUpdatedBy']
    },
    tableHeaders: ['name', 'description', 'id']
  },
  default: {
    grouping: {
      autofilled: ['id'],
      common: []
    },
    autofillTypes: {
      user: []
    },
    tableHeaders: ['id']
  }
}

export const createAutofillData = (data, property, producer, user) => {
  switch (producer) {
    case 'gsim':
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

    case 'default':
      switch (property) {
        case 'id':
          return uuidv4()

        default:
          return data
      }

    default:
      return data
  }
}

export const updateAutofillData = (data, property, producer, user) => {
  switch (producer) {
    case 'gsim':
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

    case 'default':
      switch (property) {
        default:
          return data
      }

    default:
      return data
  }
}

export const extractStringFromObject = (object, producer, languageCode) => {
  if (typeof object === 'object' && object !== null) {
    switch (producer) {
      case 'gsim':
        const nameObject = object.find(object => object.languageCode === languageCode)

        return `${nameObject === undefined ? object[0].languageText : nameObject.languageText}`

      default:
        return object.toString()
    }
  } else {
    return object
  }
}
