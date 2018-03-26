import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import NuxtLink from '@/.nuxt/components/nuxt-link'

import collection from '@/test/fixtures/collection.json'
import { mount, createLocalVue } from '@vue/test-utils'
import Container from '@/layouts/container'
import { routes } from '@/test/fixtures/routes'

describe('Container layout', () => {
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
        publishedCollections: [ collection ],
        currentUser: {
          name: 'joebloggs'
        }
      }
    })
    wrapper = mount(Container, {
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
