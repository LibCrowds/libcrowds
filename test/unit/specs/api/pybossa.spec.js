import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import pybossaTestResponses from '../../fixtures/pybossaTestResponses'

import PyBossaApi from '@/api/pybossa'

describe('PyBossaApi', () => {
  let pybossa = null
  let mockAxios = null

  beforeEach(() => {
    pybossa = new PyBossaApi()
    mockAxios = new AxiosMockAdapter(axios)
  })

  describe('getMicrositeCategories', () => {
    it('builds the URL correctly', () => {
      const mockGet = jest.fn()
      pybossa.get = mockGet
      const key = 'playbills'
      const expectedUrl = `/api/${key}`
      const expectedParams = {
        info: `collection::${key}`,
        fulltextsearch: 1
      }
      pybossa.getMicrositeCategories(key)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockGet.mock.calls[0][1]).toEqual(expectedParams)
    })
  })
})
