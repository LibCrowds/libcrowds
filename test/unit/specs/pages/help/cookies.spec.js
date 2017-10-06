import Cookies from '@/pages/help/Cookies'
import testSiteConfig from 'test/testSiteConfig'

describe('Cookies help page', () => {
  it('sets the correct data', () => {
    expect(typeof Cookies.data).toBe('function')
    const data = Cookies.data()
    expect(data).toEqual({
      siteConfig: testSiteConfig
    })
  })
})
