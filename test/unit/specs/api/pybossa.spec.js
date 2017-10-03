import pybossaTestResponses from '../../fixtures/pybossaTestResponses'

import pybossa from '@/api/pybossa'

describe('PyBossaApi', () => {
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

  describe('getData', () => {
    it('merges multiple responses', () => {
      const endpoints = [
        'endpoint_one',
        'endpoint_two'
      ]
      const responses = [
        {
          projects: ['project1'],
          categories: ['cat1']
        },
        {
          categories: ['cat2']
        }
      ]
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      mockGet.mockReturnValueOnce(new Promise((resolve, reject) => {
        resolve(responses[0])
      })).mockReturnValueOnce(new Promise((resolve, reject) => {
        resolve(responses[1])
      }))
      return pybossa.getData(endpoints).then(data => {
        expect(mockGet.mock.calls[0][0]).toBe(endpoints[0])
        expect(mockGet.mock.calls[1][0]).toBe(endpoints[1])
        expect(data).toEqual({
          projects: ['project1'],
          categories: ['cat2']
        })
      })
    })
  })

  describe('getProfile', () => {
    it('makes the correct request', () => {
      const name = 'me'
      const expectedUrl = `/account/${name}`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getProfile(name)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('signout', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/signout'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.signout()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getLeaderboard', () => {
    it('makes the correct request', () => {
      const window = 3
      const expectedUrl = `/leaderboard/window/${window}`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getLeaderboard(window)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })
})
