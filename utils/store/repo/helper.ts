import { Repository, TranslationFile, TranslationFileData, TranslationGroup } from '@/utils/models'

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

// Compose translation groups from current repositories translation files
export const composeTranslationGroups = (repo: Repository): TranslationGroup[] => {
  let translationGroups: TranslationGroup[] = []

  const mapTranslationGroup = (
    file: TranslationFile,
    data: TranslationFileData,
    groups: TranslationGroup[],
    keyPath: string[]
  ): TranslationGroup[] => {
    let tmpGroups = groups

    Object.keys(data).forEach(key => {
      const keyData = data[key] as string | TranslationFileData

      let group = tmpGroups.find(obj => obj.key == key)
      if (!group) {
        group = {
          category: file.nameDisplay,
          key,
          keyPath: [...keyPath, key],
          translations: repo.languages.map(lang => ({
            key,
            value: '',
            lang: lang.code,
          })),
          children: [],
        }
      }

      if (typeof keyData == 'string') {
        group.translations = [
          ...group.translations.filter(obj => obj.lang != file.lang),
          {
            key,
            value: keyData,
            lang: file.lang,
          },
        ]
      } else if (typeof keyData == 'object') {
        group.children = mapTranslationGroup(file, keyData, group.children, group.keyPath)
      }

      tmpGroups = [...tmpGroups.filter(obj => obj.key != group?.key), group]
    })

    return tmpGroups.sort((a, b) =>
      a.key.toLowerCase() > b.key.toLowerCase()
        ? 1
        : a.key.toLowerCase() < b.key.toLowerCase()
        ? -1
        : 0
    )
  }

  repo.files.forEach(file => {
    translationGroups = mapTranslationGroup(file, file.data, translationGroups, [])
  })

  return translationGroups
}
