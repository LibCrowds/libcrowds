import Vue from 'vue'
import getSiteKey from '@/utils/get-site-key'

describe('get-site-key.js', () => {
  it('should return null', () => {
    const key = getSiteKey()
    console.log(key)
    expect(key).to.equal(null)
  })
})
