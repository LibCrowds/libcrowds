import Vue from 'vue'
import TOS from '@/pages/help/TOS'
import testSettings from 'test/testSettings'

describe('TOS help page', () => {
  it('sets the correct data', () => {
    expect(typeof TOS.data).toBe('function')
    const data = TOS.data()
    expect(data).toEqual({
      siteConfig: testSettings
    })
  })
})
