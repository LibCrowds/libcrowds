import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import NuxtLink from '@/.nuxt/components/nuxt-link'

import { routes } from '@/test/fixtures/routes'
import { mount, createLocalVue } from '@vue/test-utils'
import SideNavbar from '@/components/navbars/Side'

describe('Side navbar', () => {
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
          name: 'admin-site'
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

  it('renders correctly when signed out and no extra items', () => {
    wrapper = mount(SideNavbar, {
      localVue,
      router,
      propsData: {
        navItems: navItems
      }
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
