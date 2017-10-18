import axios from 'axios'
import { Nuxt, Builder } from 'nuxt'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/television'
import 'vue-awesome/icons/list'

import pbTestResponses from '@/test/fixtures/pybossaTestResponses.json'

describe('Index page', () => {
  let nuxt = null
  let server = null

  beforeAll(async () => {
    nuxt.app.$pybossa = {
      getStats: jest.fn(() => pbTestResponses.getStats),
      getLeaderboard: jest.fn(() => pbTestResponses.getLeaderboard)
    }
  }, 5*60)

  it('renders correctly', async () => {
    const window = await nuxt.renderAndGetWindow('http://localhost:4000/')
    const element = window.document.querySelector('.red')
    console.log(element)
    expect(1).toBe(2)
  })

  afterAll(() => {
    server.close()
    nuxt.close()
  })
})
