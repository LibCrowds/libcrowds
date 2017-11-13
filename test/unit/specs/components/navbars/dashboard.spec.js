import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import NuxtLink from '@/.nuxt/components/nuxt-link'

import { routes } from '@/test/fixtures/routes'
import { mount, createLocalVue } from 'vue-test-utils'
import DashboardNavbar from '@/components/navbars/Dashboard'

describe('Dashboard navbar', () => {
  let localVue = null
  let wrapper = null
  let router = null
  let navItems = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.use(VueRouter)
    localVue.component(NuxtLink.name, NuxtLink)
    router = new VueRouter({
      routes
    })
    navItems = [
      {
        label: 'Dashboard',
        link: {
          name: 'admin-site-dashboard'
        }
      },
      {
        label: 'Users',
        link: {
          name: 'admin-site-users'
        }
      }
    ]
  })

  it('renders correctly in top position', () => {
    wrapper = mount(DashboardNavbar, {
      localVue,
      router,
      propsData: {
        position: 'top',
        navItems: navItems
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('renders correctly in side position', () => {
    wrapper = mount(DashboardNavbar, {
      localVue,
      router,
      propsData: {
        position: 'side',
        navItems: navItems
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
