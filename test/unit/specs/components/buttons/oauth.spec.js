import BootstrapVue from 'bootstrap-vue'
import { shallow, createLocalVue } from 'vue-test-utils'
import Oauth from '~/components/buttons/Oauth'

describe('Oauth buttons', () => {
  const localVue = createLocalVue()
  localVue.use(BootstrapVue)

  it('renders all buttons', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    const wrapper = shallow(Oauth, {
      localVue,
      propsData: {
        facebook: true,
        goiogle: true,
        twitter: true
      }
    })
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})