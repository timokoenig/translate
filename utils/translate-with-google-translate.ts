type Translation = {
  translatedText: string
  detectedSourceLanguage: string
}

type TranslationResponse = {
  translations: Translation[]
}

type Response = {
  data: TranslationResponse
}

const translateWithGoogleTranslate = async (
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<Translation> => {
  let target = targetLanguage.toLowerCase()
  if (target == 'ua') {
    target = 'uk'
  }
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target,
        format: 'text',
      }),
    }
  )
  const data = (await res.json()) as Response
  if (data.data.translations.length === 0) {
    throw new Error('No Translation available')
  }
  return data.data.translations[0]
}

export default translateWithGoogleTranslate
