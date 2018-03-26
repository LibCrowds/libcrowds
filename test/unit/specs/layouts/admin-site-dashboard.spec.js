import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import NuxtLink from '@/.nuxt/components/nuxt-link'

import { mount, createLocalVue } from '@vue/test-utils'
import AdminSiteDashboard from '@/layouts/admin-site-dashboard'
import { routes } from '@/test/fixtures/routes'

describe('Site admin dashboard layout', () => {
  let localVue = null
  let wrapper = null
  let router = null
  let store = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component(NuxtLink.name, NuxtLink)
    localVue.use(VueRouter)
    router = new VueRouter({
      routes
    })
    localVue.use(Vuex)
    store = new Vuex.Store({
      state: {
        currentUser: {
          name: 'joebloggs'
        }
      }
    })
    wrapper = mount(AdminSiteDashboard, {
      localVue,
      store,
      router
    })
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
