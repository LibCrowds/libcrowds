import pybossaTestResponses from 'test/unit/fixtures/pybossaTestResponses'
import testSiteConfig from 'test/testSiteConfig'

import PyBossaApi from '@/api/pybossa'

describe('PyBossaApi', () => {
  let pybossa = null
  let mockGet = null
  let mockPost = null
  let mockPut = null
  let mockDel = null
  let form = null

  beforeEach (() => {
    pybossa = new PyBossaApi(testSiteConfig.pybossaHost)
    mockGet = jest.fn()
    mockPost = jest.fn()
    mockPut = jest.fn()
    mockDel = jest.fn()
    pybossa.client.get = mockGet
    pybossa.client.post = mockPost
    pybossa.client.put = mockPut
    pybossa.client.del = mockDel
    form = {
      csrf: 'token',
      errors: {},
      some_key: null
    }
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
      pybossa.getMicrositeCategories(key)
      expect(mockGet.mock.calls[0][0]).toBe(expectedUrl)
      expect(mockGet.mock.calls[0][1]).toEqual(expectedParams)
    })

    it('returns the correct categories', () => {
      const key = 'playbills'
      const response = pybossaTestResponses.getApiCategories.data
      mockGet.mockReturnValue(new Promise((resolve, reject) => {
        resolve(response)
      }))
      return pybossa.getMicrositeCategories(key).then(categories => {
        expect(categories.length).toBe(1)
        expect(categories[0].info.collection).toBe(key)
      })
    })
  })

  describe('Favourites endpoints', () => {
    it('makes the correct request for getFavourites', () => {
      const expectedUrl = '/api/favourites'
      pybossa.getFavourites()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for addFavourite', () => {
      const taskId = 42
      const expectedUrl = '/api/favourites'
      const expectedParams = {
        task_id: taskId
      }
      pybossa.addFavourite(taskId)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, expectedParams)
    })

    it('makes the correct request for deleteFavourite', () => {
      const taskId = 42
      const expectedUrl = `/api/favourites/${taskId}`
      pybossa.deleteFavourite(taskId)
      expect(mockDel).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('Account endpoints', () => {
    it('makes the correct request for getAccountIndex', () => {
      const page = 42
      const expectedUrl = `/account/page/${page}`
      pybossa.getAccountIndex(page)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getAccountRegistration', () => {
      const expectedUrl = '/account/register'
      const mockGet = jest.fn()
      pybossa.client.get = mockGet
      pybossa.getAccountRegistration()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for register', () => {
      const expectedUrl = '/account/register'
      pybossa.register(form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for getAccountSignin', () => {
      const expectedUrl = '/account/signin'
      pybossa.getAccountSignin()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for signin', () => {
      const expectedUrl = '/account/signin'
      pybossa.signin(form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for signout', () => {
      const expectedUrl = '/account/signout'
      pybossa.signout()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getRecoverPassword', () => {
      const expectedUrl = '/account/forgot-password'
      pybossa.getRecoverPassword()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for recoverPassword', () => {
      const expectedUrl = '/account/forgot-password'
      pybossa.recoverPassword(form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for getAccount', () => {
      const name = 'me'
      const expectedUrl = `/account/${name}`
      pybossa.getAccount(name)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getProfile', () => {
      const expectedUrl = '/account/profile'
      pybossa.getProfile()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getAccountProjects', () => {
      const name = 'me'
      const expectedUrl = `/account/${name}/projects`
      pybossa.getAccountProjects(name)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getUpdateProfile', () => {
      const name = 'me'
      const expectedUrl = `/account/${name}/update`
      pybossa.getUpdateProfile(name)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for updateProfile', () => {
      const name = 'me'
      const type = 'Upload'
      const expectedUrl = `/account/${name}/update`
      const expectedParams = JSON.parse(JSON.stringify(form))
      expectedParams.btn = type
      pybossa.updateProfile(name, form, type)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for getResetPassword', () => {
      const expectedUrl = '/account/reset-password'
      const params = {
        key: 'secret'
      }
      pybossa.getResetPassword(params)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl, { params: params })
    })

    it('makes the correct request for resetPassword', () => {
      const expectedUrl = '/account/reset-password'
      pybossa.resetPassword(form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for getResetApiKey', () => {
      const name = 'me'
      const expectedUrl = `/account/${name}/resetapikey`
      pybossa.getResetApiKey(name)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for resetApiKey', () => {
      const name = 'me'
      const expectedUrl = `/account/${name}/resetapikey`
      pybossa.resetApiKey(name, form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for subscribeToNewsletter', () => {
      const expectedUrl = `/account/newsletter`
      const params = {
        subscribe: true
      }
      pybossa.subscribeToNewsletter()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl, { params: params })
    })

    it('makes the correct request for getConfirmEmail', () => {
      const expectedUrl = '/account/confirm-email'
      pybossa.getConfirmEmail()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for confirmEmail', () => {
      const expectedUrl = '/account/register/confirmation'
      const params = {
        key: 'secret'
      }
      pybossa.confirmEmail(params)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl, { params: params })
    })
  })

  describe('Leaderboard endpoints', () => {
    it('makes the correct request getLeaderboard', () => {
      const window = 42
      const expectedUrl = `leaderboard/window/${window}`
      pybossa.getLeaderboard(window)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('Announcements endpoints', () => {
    it('makes the correct request for getAnnouncements', () => {
      const expectedUrl = `/announcements`
      pybossa.getAnnouncements()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getAdminAnnouncements', () => {
      const expectedUrl = `/admin/announcement`
      pybossa.getAdminAnnouncements()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getNewAnnouncement', () => {
      const expectedUrl = `/admin/announcement/new`
      pybossa.getNewAnnouncement()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for newAnnouncement', () => {
      const expectedUrl = `/admin/announcement/new`
      pybossa.newAnnouncement(form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for getUpdateAnnouncement', () => {
      const announcementId = 42
      const expectedUrl = `/admin/announcement/${announcementId}/update`
      pybossa.getUpdateAnnouncement(announcementId)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for updateAnnouncement', () => {
      const announcementId = 42
      const expectedUrl = `/admin/announcement/${announcementId}/update`
      pybossa.updateAnnouncement(announcementId, form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })
  })



  describe('Project endpoints', () => {
    it('makes the correct request for getProject', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}`
      pybossa.getProject(shortname)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getProjectStats', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}/stats`
      pybossa.getProjectStats(shortname)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for exportData', () => {
      const shortName = 'my_project'
      const type = 'result'
      const format = 'json'
      const expectedUrl = `/project/${shortName}/tasks/export`
      const expectedParams = {
        responseType: 'arraybuffer',
        params: {
          type: type,
          format: format
        }
      }
      pybossa.exportData(shortName, type, format)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl, expectedParams)
    })
  })
})
