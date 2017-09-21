import Error from '@/pages/Error'

export default [
  {
    path: '/400',
    name: '400',
    component: Error,
    props: {
      title: 'Bad Request',
      description: 'The server could not understand a request from your browser'
    }
  },
  {
    path: '/401',
    name: '401',
    component: Error,
    props: {
      title: 'Unauthorised',
      description: 'You are not authorised to access the requested resource'
    }
  },
  {
    path: '/403',
    name: '403',
    component: Error,
    props: {
      title: 'Forbidden',
      description: 'You do not have permission to access the requested resource'
    }
  },
  {
    path: '/404',
    name: '404',
    alias: '*',
    component: Error,
    props: {
      title: 'Page Not Found',
      description: 'We could not find the page you were looking for'
    }
  },
  {
    path: '/415',
    name: '415',
    alias: '*',
    component: Error,
    props: {
      title: 'Unsupported Media Type',
      description: 'The request was made with an invalid media type.'
    }
  },
  {
    path: '/500',
    name: '500',
    component: Error,
    props: {
      title: 'Server Error',
      description: 'Something is broken, we will fix it as soon as we can'
    }
  }
]
