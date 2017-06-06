import TOS from '@/pages/pybossa/help/TOS'
import Privacy from '@/pages/pybossa/help/Privacy'
import Cookies from '@/pages/pybossa/help/Cookies'

export default {
  path: 'help',
  name: 'help',
  component: require('@/components/Tabs'),
  props: {
    tabs: [
      { title: 'Terms of Service', content: TOS },
      { title: 'Privacy Policy', content: Privacy },
      { title: 'Cookies Policy', content: Cookies }
    ]
  }
}
