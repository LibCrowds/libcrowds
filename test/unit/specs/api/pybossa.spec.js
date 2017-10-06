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

  describe('exportData', () => {
    it('makes the correct request', () => {
      const shortName = 'my_project'
      const type = 'result'
      const format = 'json'
      const mockGet = jest.fn()
      const expectedUrl = `/project/${shortName}/tasks/export`
      const expectedParams = {
        responseType: 'arraybuffer',
        params: {
          type: type,
          format: format
        }
      }
      pybossa.client.get = mockGet
      pybossa.exportData(shortName, type, format)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockGet.mock.calls[0][1]).toEqual(expectedParams)
    })
  })

  describe('getLeaderboard', () => {
    it('makes the correct request', () => {
      const window = 42
      const expectedUrl = `leaderboard/window/${window}`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getLeaderboard(window)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getFavourites', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/api/favourites'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getFavourites()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('addFavourite', () => {
    it('makes the correct request', () => {
      const taskId = 42
      const expectedUrl = '/api/favourites'
      const expectedParams = {
        task_id: taskId
      }
      const mockPost = jest.fn()
      pybossa.client.post = mockPost
      pybossa.addFavourite(taskId)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual(expectedParams)
    })
  })

  describe('deleteFavourite', () => {
    it('makes the correct request', () => {
      const taskId = 42
      const expectedUrl = `/api/favourites/${taskId}`
      const mockDel = jest.fn()
      pybossa.client.del = mockDel
      pybossa.deleteFavourite(taskId)
      expect(mockDel.mock.calls[0][0]).toBe(expectedUrl)
    })
  })
})
