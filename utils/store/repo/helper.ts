import { TranslationFileData, TranslationGroup } from '@/utils/models'

export const deleteNestedValue = (
  path: string[],
  data: TranslationFileData
): TranslationFileData => {
  let tmpData: TranslationFileData = JSON.parse(JSON.stringify(data))
  const tmpPath = [...path]
  const key = tmpPath.shift()
  if (!key) return tmpData
  if (tmpPath.length == 0) {
    delete tmpData[key]
    return tmpData
  }
  if (key in tmpData) {
    tmpData[key] = deleteNestedValue(tmpPath, tmpData[key] as TranslationFileData)
  }
  return tmpData
}

const mapTranslationChildren = (
  translationGroup: TranslationGroup,
  lang: string
): TranslationFileData => {
  let tmpValues: TranslationFileData = {}
  if (translationGroup.children.length > 0) {
    for (const child of translationGroup.children) {
      const mappedValue = mapTranslationChildren(child, lang)
      if (child.children.length > 0) {
        tmpValues[child.key] = mappedValue
      } else {
        tmpValues = { ...tmpValues, ...mappedValue }
      }
    }
  } else {
    const translationValue = translationGroup.translations.find(obj => obj.lang == lang)
    if (translationValue) {
      tmpValues[translationGroup.key] = translationValue.value
    }
  }
  return tmpValues
}

export const updateNestedValue = (
  translationGroup: TranslationGroup,
  lang: string,
  path: string[],
  data: TranslationFileData
): TranslationFileData => {
  let tmpData: TranslationFileData = JSON.parse(JSON.stringify(data))
  const tmpPath = [...path]
  const key = tmpPath.shift()
  if (!key) return tmpData
  if (tmpPath.length == 0) {
    if (translationGroup.children.length > 0) {
      tmpData[translationGroup.key] = mapTranslationChildren(translationGroup, lang)
    } else {
      const translationValue = translationGroup.translations.find(
        translation => translation.lang == lang
      )
      if (translationValue) {
        tmpData[translationGroup.key] = translationValue.value
      }
    }
    return tmpData
  }
  tmpData[key] = updateNestedValue(
    translationGroup,
    lang,
    tmpPath,
    key in tmpData ? (tmpData[key] as TranslationFileData) : {}
  )
  return tmpData
}
