import { TranslationFile, TranslationFileData } from './models'

const TranslationHelper = {
  // Get all categories
  getCategories: (translationFiles: TranslationFile[]): string[] => {
    let categories: string[] = []
    translationFiles.forEach(obj => {
      if (!categories.includes(obj.nameDisplay)) {
        categories.push(obj.nameDisplay)
      }
    })
    return categories
  },

  // Get all languages
  getLanguages: (translationFiles: TranslationFile[]): string[] => {
    let languages: string[] = []
    translationFiles.forEach(obj => {
      if (!languages.includes(obj.lang)) {
        languages.push(obj.lang)
      }
    })
    return languages
  },

  // Get translation file diff returns all keys that have been added, modified, or deleted
  getTranslationDataDiff: (
    oldData: TranslationFileData,
    newData: TranslationFileData
  ): { added: string[]; modified: string[]; deleted: string[] } => {
    let added: string[] = []
    let modified: string[] = []
    let deleted: string[] = []

    // flattenObject turns { 'key': { 'sub': 'value' } } into { 'key.sub': 'value' }
    const flattenObject = (data: TranslationFileData): { [key: string]: string } => {
      let res: { [key: string]: string } = {}
      Object.keys(data).forEach(key => {
        const value = data[key]
        if (typeof value == 'string') {
          res[key] = value
        } else if (typeof value == 'object') {
          const subValue = flattenObject(value)
          Object.keys(subValue).forEach(subKey => {
            res[`${key}.${subKey}`] = subValue[subKey]
          })
        }
      })
      return res
    }

    const oldKeys = flattenObject(oldData)
    const newKeys = flattenObject(newData)

    Object.keys(oldKeys).forEach(key => {
      if (newKeys[key] === undefined) {
        deleted.push(key)
      } else if (newKeys[key] != oldKeys[key]) {
        modified.push(key)
      }
    })

    Object.keys(newKeys).forEach(key => {
      if (oldKeys[key] === undefined) {
        added.push(key)
      }
    })

    return {
      added,
      modified,
      deleted,
    }
  },
}

export default TranslationHelper
