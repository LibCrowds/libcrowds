import Vue from 'vue'
import Privacy from '@/pages/help/Privacy'
import testSettings from 'test/testSettings'

describe('Privacy help page', () => {
  it('sets the correct data', () => {
    expect(typeof Privacy.data).toBe('function')
    const data = Privacy.data()
    expect(data).toEqual({
      siteConfig: testSettings
    })
  })
})
