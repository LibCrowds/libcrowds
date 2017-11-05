import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

import { routes } from '@/test/fixtures/routes'
import collection from '@/test/fixtures/collection.json'
import pbTestResponses from '@/test/fixtures/pybossaTestResponses.json'
import { mount, createLocalVue } from 'vue-test-utils'
import CollectionNavbar from '@/components/navbars/Collection'

describe('Collection navbar', () => {
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
    wrapper = mount(CollectionNavbar, {
      localVue,
      router,
      propsData: {
        collection: collection,
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
    wrapper = mount(CollectionNavbar, {
      localVue,
      store,
      router,
      propsData: {
        collection: collection,
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
    wrapper = mount(CollectionNavbar, {
      localVue,
      store,
      router,
      propsData: {
        collection: collection,
        currentUser: JSON.parse(JSON.stringify(user))
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
