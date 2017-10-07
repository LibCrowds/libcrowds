import Error from '@/pages/Error'
import testSiteConfig from 'test/testSiteConfig'
import { shallow } from 'vue-test-utils'

describe('Error page', () => {
  let cmp = null

  beforeEach(() => {
    cmp = shallow(Error)
  })

  it('renders h1 based on title prop', () => {
    const title = 'Disaster'
    cmp.setProps({ title: title })
    expect(cmp.vm.$el.querySelector('h1').textContent).toEqual(title)
  })

  it('renders lead based on description prop', () => {
    const description = 'We messed up'
    cmp.setProps({ description: description })
    expect(cmp.vm.$el.querySelector('.lead').textContent).toEqual(description)
  })
})
