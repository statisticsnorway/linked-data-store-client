import React from 'react'

export const languages = {
  ENGLISH: {
    languageCode: 'en'
  },
  NORWEGIAN: {
    languageCode: 'nb'
  }
}

export const LanguageContext = React.createContext(languages.NORWEGIAN.languageCode)
