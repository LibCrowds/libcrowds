import Vue from 'vue'
import API from '@/pages/help/API'
import testSiteConfig from 'test/testSiteConfig'

describe('API help page', () => {
  it('sets the correct data', () => {
    expect(typeof API.data).toBe('function')
    const data = API.data()
    expect(data).toEqual({
      siteConfig: testSiteConfig
    })
  })
})
