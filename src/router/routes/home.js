import config from '@/config'
import Landing from '@/pages/Landing'
import About from '@/pages/home/About'
import Data from '@/pages/home/Data'
import Results from '@/pages/home/Results'
import Contribute from '@/pages/home/Contribute'
import Statistics from '@/pages/home/Statistics'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/data',
    name: 'data',
    component: Data
  },
  {
    path: '/contribute',
    name: 'contribute',
    component: Contribute
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: Statistics
  }
]

// Conditional routes
if (config.resultsComponent) {
  routes.push({
    path: '/results',
    name: 'results',
    component: Results
  })
}

export default routes
