import Vue from 'vue'
import Privacy from '@/pages/help/Privacy'
import testSiteConfig from 'test/testSiteConfig'

describe('Privacy help page', () => {
  it('sets the correct data', () => {
    expect(typeof Privacy.data).toBe('function')
    const data = Privacy.data()
    expect(data).toEqual({
      siteConfig: testSiteConfig
    })
  })
})
