import pybossaTestResponses from 'test/unit/fixtures/pybossaTestResponses'
import testSiteConfig from 'test/testSiteConfig'

import PyBossaApi from '@/api/pybossa'

describe('PyBossaApi', () => {
  let pybossa = null

  beforeEach (() => {
    pybossa = new PyBossaApi(testSiteConfig.pybossaHost)
  })

  describe('_filterMicrositeCategories', () => {
    it('filters microsite categories for the given key only', () => {
      const categories = pybossaTestResponses.getApiCategories.data
      const key = 'playbills'
      const filtered = pybossa._filterMicrositeCategories(categories, key)
      expect(filtered.length).toBe(1)
      expect(filtered[0].info.collection).toBe(key)
    })
  })

  describe('getMicrositeCategories', () => {
    it('makes the correct request', () => {
      const key = 'playbills'
      const expectedUrl = `/api/${key}`
      const expectedParams = {
        info: `collection::${key}`,
        fulltextsearch: 1
      }
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getMicrositeCategories(key)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockGet.mock.calls[0][1]).toEqual(expectedParams)
    })

    it('returns the correct categories', () => {
      const key = 'playbills'
      const response = pybossaTestResponses.getApiCategories.data
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      mockGet.mockReturnValue(new Promise((resolve, reject) => {
        resolve(response)
      }))
      return pybossa.getMicrositeCategories(key).then(categories => {
        expect(categories.length).toBe(1)
        expect(categories[0].info.collection).toBe(key)
      })
    })
  })
})
