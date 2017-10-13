import BootstrapVue from 'bootstrap-vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/trophy'
import 'vue-awesome/icons/tasks'
import 'vue-awesome/icons/clock-o'

import pbTestResponses from '~/test/fixtures/pybossaTestResponses.json'
import { mount, createLocalVue } from 'vue-test-utils'
import ProfileCard from '~/components/cards/Profile'

describe('Profile card', () => {
  let localVue = null
  let user = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component('icon', Icon)
    user = pbTestResponses.getAccount.data.user
    wrapper = mount(ProfileCard, {
      localVue,
      propsData: {
        user: user
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
