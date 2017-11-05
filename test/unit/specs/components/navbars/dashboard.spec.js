import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

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
    router = new VueRouter({
      routes
    })
    navItems = [
      { name: 'admin-site-dashboard', label: 'Dashboard' },
      { name: 'admin-site-featured', label: 'Featured Projects' }
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
