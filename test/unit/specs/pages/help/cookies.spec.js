import Vue from 'vue'
import Cookies from '@/pages/help/Cookies'
import testSettings from 'test/testSettings'

describe('Cookies help page', () => {
  it('sets the correct data', () => {
    expect(typeof Cookies.data).toBe('function')
    const data = Cookies.data()
    expect(data).toEqual({
      siteConfig: testSettings
    })
  })
})
