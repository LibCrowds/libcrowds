import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import NuxtLink from '@/.nuxt/components/nuxt-link'

import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/envelope'

import collection from '@/test/fixtures/collection.json'
import { mount, createLocalVue } from 'vue-test-utils'
import AppFooter from '@/components/footers/App'
import { routes } from '@/test/fixtures/routes'

describe('App footer', () => {
  let localVue = null
  let wrapper = null
  let router = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.use(VueRouter)
    localVue.component('icon', Icon)
    localVue.component(NuxtLink.name, NuxtLink)
    router = new VueRouter({
      routes
    })
    wrapper = mount(AppFooter, {
      localVue,
      router,
      propsData: {
        collections: [ collection ]
      }
    })
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
