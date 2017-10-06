import pybossaTestResponses from 'test/unit/fixtures/pybossaTestResponses'
import testSiteConfig from 'test/testSiteConfig'

import PyBossaApi from '@/api/pybossa'

describe('PyBossaApi', () => {
  let pybossa = null

  beforeEach (() => {
    pybossa = new PyBossaApi(testSiteConfig.pybossaHost)
  })

  describe('_filterMicrositeCategories', () => {
    it('filters microsite categories for the given key only', () => {
      const categories = pybossaTestResponses.getApiCategories.data
      const key = 'playbills'
      const filtered = pybossa._filterMicrositeCategories(categories, key)
      expect(filtered.length).toBe(1)
      expect(filtered[0].info.collection).toBe(key)
    })
  })

  describe('getMicrositeCategories', () => {
    it('makes the correct request', () => {
      const key = 'playbills'
      const expectedUrl = `/api/${key}`
      const expectedParams = {
        info: `collection::${key}`,
        fulltextsearch: 1
      }
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getMicrositeCategories(key)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockGet.mock.calls[0][1]).toEqual(expectedParams)
    })

    it('returns the correct categories', () => {
      const key = 'playbills'
      const response = pybossaTestResponses.getApiCategories.data
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      mockGet.mockReturnValue(new Promise((resolve, reject) => {
        resolve(response)
      }))
      return pybossa.getMicrositeCategories(key).then(categories => {
        expect(categories.length).toBe(1)
        expect(categories[0].info.collection).toBe(key)
      })
    })
  })

  describe('exportData', () => {
    it('makes the correct request', () => {
      const shortName = 'my_project'
      const type = 'result'
      const format = 'json'
      const mockGet = jest.fn()
      const expectedUrl = `/project/${shortName}/tasks/export`
      const expectedParams = {
        responseType: 'arraybuffer',
        params: {
          type: type,
          format: format
        }
      }
      pybossa.client.get = mockGet
      pybossa.exportData(shortName, type, format)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockGet.mock.calls[0][1]).toEqual(expectedParams)
    })
  })

  describe('getFavourites', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/api/favourites'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getFavourites()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('addFavourite', () => {
    it('makes the correct request', () => {
      const taskId = 42
      const expectedUrl = '/api/favourites'
      const expectedParams = {
        task_id: taskId
      }
      const mockPost = jest.fn()
      pybossa.client.post = mockPost
      pybossa.addFavourite(taskId)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual(expectedParams)
    })
  })

  describe('deleteFavourite', () => {
    it('makes the correct request', () => {
      const taskId = 42
      const expectedUrl = `/api/favourites/${taskId}`
      const mockDel = jest.fn()
      pybossa.client.del = mockDel
      pybossa.deleteFavourite(taskId)
      expect(mockDel.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getAccountIndex', () => {
    it('makes the correct request', () => {
      const page = 42
      const expectedUrl = `/account/page/${page}`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getAccountIndex(page)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getAccountRegistration', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/register'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getAccountRegistration()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('register', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/register'
      const form = {
        confirm: null,
        csrf: 'token',
        email_addr: null,
        errors: {},
        fullname: null,
        name: null,
        password: null
      }
      const mockPost = jest.fn()
      pybossa.client.post = mockPost
      pybossa.register(form)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual({
        params: form
      })
    })
  })

  describe('getAccountSignin', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/signin'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getAccountSignin()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('signin', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/signin'
      const form = {
        csrf: 'token',
        email: null,
        errors: {},
        password: null
      }
      const mockPost = jest.fn()
      pybossa.client.post = mockPost
      pybossa.signin(form)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual({
        params: form
      })
    })
  })

  describe('signout', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/signout'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.signout()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getRecoverPassword', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/forgot-password'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getRecoverPassword()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('recoverPassword', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/forgot-password'
      const form = {
        csrf: 'token',
        email: null,
        errors: {}
      }
      const mockPost = jest.fn()
      pybossa.client.post = mockPost
      pybossa.recoverPassword(form)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual({
        params: form
      })
    })
  })

  describe('getAccount', () => {
    it('makes the correct request', () => {
      const name = 'me'
      const expectedUrl = `/account/${name}`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getAccount(name)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getProfile', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/profile'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getProfile()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getAccountProjects', () => {
    it('makes the correct request', () => {
      const name = 'me'
      const expectedUrl = `/account/${name}/projects`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getAccountProjects(name)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getUpdateProfile', () => {
    it('makes the correct request', () => {
      const name = 'me'
      const expectedUrl = `/account/${name}/update`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getUpdateProfile(name)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('updateProfile', () => {
    it('makes the correct request', () => {
      const name = 'me'
      const type = 'Upload'
      const expectedUrl = `/account/${name}/update`
      const form = {
        ckan_api: null,
        csrf: 'token',
        email_addr: 'email@example.com',
        errors: {},
        fullname: 'Alex',
        id: 0,
        locale: 'en',
        name: name,
        privacy_mode: true,
        subscribed: true
      }
      const expectedParams = JSON.parse(JSON.stringify(form))
      expectedParams.btn = type
      const mockPost = jest.fn()
      pybossa.client.post = mockPost
      pybossa.updateProfile(name, form, type)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual({
        params: form
      })
    })
  })

  describe('getResetPassword', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/reset-password'
      const params = {
        key: 'secret'
      }
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getResetPassword(params)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockGet.mock.calls[0][1]).toEqual({
        params: params
      })
    })
  })

  describe('resetPassword', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/reset-password'
      const form = {
        confirm: null,
        csrf: 'token',
        current_password: null,
        errors: {},
        new_password: null
      }
      const mockPost = jest.fn()
      pybossa.client.post = mockPost
      pybossa.resetPassword(form)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual({
        params: form
      })
    })
  })

  describe('getResetApiKey', () => {
    it('makes the correct request', () => {
      const expectedUrl = `/account/${name}/resetapikey`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getResetApiKey()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('resetApiKey', () => {
    it('makes the correct request', () => {
      const expectedUrl = `/account/${name}/resetapikey`
      const form = {
        csrf: 'token'
      }
      const mockPost = jest.fn()
      pybossa.client.post = mockPost
      pybossa.resetApiKey(form)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual({
        params: form
      })
    })
  })

  describe('subscribeToNewsletter', () => {
    it('makes the correct request', () => {
      const expectedUrl = `/account/newsletter`
      const params = {
        subscribe: true
      }
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.subscribeToNewsletter()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockGet.mock.calls[0][1]).toEqual({
        params: params
      })
    })
  })

  describe('getConfirmEmail', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/confirm-email'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getConfirmEmail()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('confirmEmail', () => {
    it('makes the correct request', () => {
      const expectedUrl = '/account/register/confirmation'
      const params = {
        key: 'secret'
      }
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.confirmEmail(params)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockGet.mock.calls[0][1]).toEqual({
        params: params
      })
    })
  })

  describe('getProject', () => {
    it('makes the correct request', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getProject(shortname)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getProjectStats', () => {
    it('makes the correct request', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}/stats`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getProjectStats(shortname)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getLeaderboard', () => {
    it('makes the correct request', () => {
      const window = 42
      const expectedUrl = `leaderboard/window/${window}`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getLeaderboard(window)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getAnnouncements', () => {
    it('makes the correct request', () => {
      const expectedUrl = `/announcements`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getAnnouncements()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getAdminAnnouncements', () => {
    it('makes the correct request', () => {
      const expectedUrl = `/admin/announcement`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getAdminAnnouncements()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('getNewAnnouncement', () => {
    it('makes the correct request', () => {
      const expectedUrl = `/admin/announcement/new`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getNewAnnouncement()
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('newAnnouncement', () => {
    it('makes the correct request', () => {
      const expectedUrl = `/admin/announcement/new`
      const mockPost = jest.fn()
      const form = {
        body: null,
        csrf: 'token',
        errors: {},
        title: null,
        media_url: null,
        published: false
      }
      pybossa.client.post = mockPost
      pybossa.newAnnouncement(form)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual({
        params: form
      })
    })
  })

  describe('getUpdateAnnouncement', () => {
    it('makes the correct request', () => {
      const announcementId = 42
      const expectedUrl = `/admin/announcement/${announcementId}/update`
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getUpdateAnnouncement(announcementId)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
    })
  })

  describe('updateAnnouncement', () => {
    it('makes the correct request', () => {
      const announcementId = 42
      const expectedUrl = `/admin/announcement/${announcementId}/update`
      const mockPost = jest.fn()
      const form = {
        body: null,
        csrf: 'token',
        errors: {},
        title: null,
        media_url: null,
        published: false
      }
      pybossa.client.post = mockPost
      pybossa.updateAnnouncement(announcementId, form)
      expect(mockPost.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockPost.mock.calls[0][1]).toEqual({
        params: form
      })
    })
  })
})
