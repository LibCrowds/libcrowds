import BootstrapVue from 'bootstrap-vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/television'
import 'vue-awesome/icons/list'

import { mount, createLocalVue } from 'vue-test-utils'
import IndexPage from '@/pages/index'

describe('Index page', () => {
  const localVue = createLocalVue()
  localVue.use(BootstrapVue)
  localVue.component('icon', Icon)
  localVue.filter('intComma', (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  })
  const wrapper = mount(IndexPage, {
    localVue
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
