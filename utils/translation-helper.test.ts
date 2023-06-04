import TranslationHelper from './translation-helper'

describe('TranslationHelper.getTranslationDataDiff', () => {
  it('should succeed without changes', async () => {
    const oldData = { foo: 'bar' }
    const newData = { foo: 'bar' }

    const res = TranslationHelper.getTranslationDataDiff(oldData, newData)

    expect(res.added.length).toBe(0)
    expect(res.modified.length).toBe(0)
    expect(res.deleted.length).toBe(0)
  })

  it('should succeed without addition', async () => {
    const oldData = { foo: 'bar' }
    const newData = { foo: 'bar', bar: 'foo' }

    const res = TranslationHelper.getTranslationDataDiff(oldData, newData)

    expect(res.added.length).toBe(1)
    expect(res.added[0]).toBe('bar')
    expect(res.modified.length).toBe(0)
    expect(res.deleted.length).toBe(0)
  })

  it('should succeed without modification', async () => {
    const oldData = { foo: 'bar' }
    const newData = { foo: 'foo' }

    const res = TranslationHelper.getTranslationDataDiff(oldData, newData)

    expect(res.added.length).toBe(0)
    expect(res.modified.length).toBe(1)
    expect(res.modified[0]).toBe('foo')
    expect(res.deleted.length).toBe(0)
  })

  it('should succeed without deletion', async () => {
    const oldData = { foo: 'bar' }
    const newData = {}

    const res = TranslationHelper.getTranslationDataDiff(oldData, newData)

    expect(res.added.length).toBe(0)
    expect(res.modified.length).toBe(0)
    expect(res.deleted.length).toBe(1)
    expect(res.deleted[0]).toBe('foo')
  })

  it('should succeed without nested addition', async () => {
    const oldData = { foo: { bar: 'value' } }
    const newData = { foo: { bar: 'value', hello: 'world' } }

    const res = TranslationHelper.getTranslationDataDiff(oldData, newData)

    expect(res.added.length).toBe(1)
    expect(res.added[0]).toBe('foo.hello')
    expect(res.modified.length).toBe(0)
    expect(res.deleted.length).toBe(0)
  })

  it('should succeed without nested modification', async () => {
    const oldData = { foo: { bar: 'value' } }
    const newData = { foo: { bar: 'world' } }

    const res = TranslationHelper.getTranslationDataDiff(oldData, newData)

    expect(res.added.length).toBe(0)
    expect(res.modified.length).toBe(1)
    expect(res.modified[0]).toBe('foo.bar')
    expect(res.deleted.length).toBe(0)
  })

  it('should succeed without nested deletion', async () => {
    const oldData = { foo: { bar: 'value' } }
    const newData = {}

    const res = TranslationHelper.getTranslationDataDiff(oldData, newData)

    expect(res.added.length).toBe(0)
    expect(res.modified.length).toBe(0)
    expect(res.deleted.length).toBe(1)
    expect(res.deleted[0]).toBe('foo.bar')
  })
})
