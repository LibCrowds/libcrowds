import TOS from '@/pages/help/TOS'
import testSiteConfig from 'test/testSiteConfig'

describe('TOS help page', () => {
  it('sets the correct data', () => {
    expect(typeof TOS.data).toBe('function')
    const data = TOS.data()
    expect(data).toEqual({
      siteConfig: testSiteConfig
    })
  })
})
