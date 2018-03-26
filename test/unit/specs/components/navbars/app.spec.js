import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import NuxtLink from '@/.nuxt/components/nuxt-link'

import pbTestResponses from '@/test/fixtures/pybossaTestResponses.json'
import { mount, createLocalVue } from '@vue/test-utils'
import TopNavbar from '@/components/navbars/Top'
import { routes } from '@/test/fixtures/routes'

describe('App navbar', () => {
  let localVue = null
  let wrapper = null
  let store = null
  let router = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.use(Vuex)
    localVue.use(VueRouter)
    localVue.component(NuxtLink.name, NuxtLink)
    store = new Vuex.Store({
      state: {
        currentUser: {}
      }
    })
    router = new VueRouter({
      routes
    })
  })

  it('renders correctly when signed out', () => {
    wrapper = mount(TopNavbar, {
      localVue,
      store,
      router,
      propsData: {
        currentUser: {}
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('renders correctly when signed in as non-admin', () => {
    const user = pbTestResponses.getAccount.data.user
    user.admin = false
    wrapper = mount(TopNavbar, {
      localVue,
      store,
      router,
      propsData: {
        currentUser: JSON.parse(JSON.stringify(user))
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('renders correctly when signed in as admin', () => {
    const user = pbTestResponses.getAccount.data.user
    user.admin = true
    wrapper = mount(TopNavbar, {
      localVue,
      router,
      store,
      propsData: {
        currentUser: JSON.parse(JSON.stringify(user))
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
