import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import NuxtLink from '@/.nuxt/components/nuxt-link'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/bars'
import 'vue-awesome/icons/caret-down'
import VueGravatar from 'vue-gravatar'
import { directive as onClickaway } from 'vue-clickaway'

import axios from 'axios'
import moxios from 'moxios'

import collection from '@/test/fixtures/collection.json'
import pbTestResponses from '@/test/fixtures/pybossaTestResponses.json'
import { mount, createLocalVue } from '@vue/test-utils'
import TopNavbar from '@/components/navbars/Top'
import { routes } from '@/test/fixtures/routes'
import { currentMicrositeNavItems } from '@/mixins/currentMicrositeNavItems'

describe('Top navbar', () => {
  let $axios = axios.create()
  let localVue = null
  let wrapper = null
  let store = null
  let router = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.use(Vuex)
    localVue.use(VueRouter)
    localVue.component('icon', Icon)
    localVue.component('v-gravatar', VueGravatar)
    localVue.directive('on-clickaway', onClickaway)
    localVue.component(NuxtLink.name, NuxtLink)
    store = new Vuex.Store({
      state: {
        currentUser: {},
        currentCollection: {}
      }
    })
    router = new VueRouter({
      routes
    })

    moxios.install($axios)
  })

  afterEach(() => {
    moxios.uninstall($axios)
  })

  it('renders correctly with props', () => {
    wrapper = mount(TopNavbar, {
      localVue,
      store,
      router,
      mocks: {
        $axios
      },
      propsData: {
        fixedTop: true,
        navbarBrand: 'Foo',
        showHelp: true,
        transparent: true,
        dark: true
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('renders correctly when signed out and no collection', () => {
    wrapper = mount(TopNavbar, {
      localVue,
      store,
      router,
      mocks: {
        $axios
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('renders correctly when signed in and no collection', () => {
    const user = pbTestResponses.getAccount.data.user
    user.admin = false
    store.state.currentUser = user
    wrapper = mount(TopNavbar, {
      localVue,
      store,
      router,
      mocks: {
        $axios
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('renders correctly when signed out and has collection', () => {
    currentMicrositeNavItems.computed.currentMicrositeNavItems = () => {
      return [
        {
          label: 'Home',
          link: {
            name: 'collection-short_name',
            params: {
              short_name: collection.short_name
            }
          }
        },
        {
          label: 'About',
          link: {
            name: 'collection-short_name-about',
            params: {
              short_name: collection.short_name
            }
          }
        }
      ]
    }
    wrapper = mount(TopNavbar, {
      localVue,
      store,
      router,
      mocks: {
        $axios
      },
      mixins: [ currentMicrositeNavItems ]
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('renders correctly when signed in and has collection', () => {
    const user = pbTestResponses.getAccount.data.user
    store.state.currentUser = user
    currentMicrositeNavItems.computed.currentMicrositeNavItems = () => {
      return [
        {
          label: 'Home',
          link: {
            name: 'collection-short_name',
            params: {
              short_name: collection.short_name
            }
          }
        },
        {
          label: 'About',
          link: {
            name: 'collection-short_name-about',
            params: {
              short_name: collection.short_name
            }
          }
        }
      ]
    }
    wrapper = mount(TopNavbar, {
      localVue,
      store,
      router,
      mocks: {
        $axios
      },
      mixins: [ currentMicrositeNavItems ]
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
