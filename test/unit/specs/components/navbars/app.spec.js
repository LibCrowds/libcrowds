import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

import { routes } from '@/test/fixtures/routes'
import pbTestResponses from '@/test/fixtures/pybossaTestResponses.json'
import { mount, createLocalVue } from 'vue-test-utils'
import AppNavbar from '@/components/navbars/App'

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
    store.state.currentUser = {}
    wrapper = mount(AppNavbar, {
      localVue,
      store,
      router
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('renders correctly when signed in as non-admin', () => {
    const user = pbTestResponses.getAccount.data.user
    user.admin = false
    store.state.currentUser = JSON.parse(JSON.stringify(user))
    wrapper = mount(AppNavbar, {
      localVue,
      store,
      router
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('renders correctly when signed in as admin', () => {
    const user = pbTestResponses.getAccount.data.user
    user.admin = true
    store.state.currentUser = JSON.parse(JSON.stringify(user))
    wrapper = mount(AppNavbar, {
      localVue,
      store,
      router
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
