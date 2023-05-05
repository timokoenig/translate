import { TranslationFile } from './models'

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
}

export default TranslationHelper
