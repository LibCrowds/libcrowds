import pybossaTestResponses from '~/test/fixtures/pybossaTestResponses'
import PybossaPlugin from '~/modules/pybossa'

describe('PYBOSSA plugin', () => {
  let nuxt = null
  let pybossa = null
  let mockContext = null
  let mockInject = null
  let mockGet = null
  let mockPost = null
  let mockPut = null
  let mockDel = null
  let form = null

  beforeAll(async () => {
    mockContext = jest.fn()
    mockInject = jest.fn()
    pybossa = new PybossaPlugin(mockContext, mockInject)
  })

  beforeEach(() => {
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

  describe('Initialisation', () => {
    it('injects $pybossa into the context', () => {
      expect(mockContext.$pybossa).toBe(pybossa)
      expect(mockInject).toHaveBeenCalledWith('pybossa' ,pybossa)
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
      const expectedUrl = `/account/${name}/`
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
  })

  describe('Admin endpoints', () => {
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

    it('makes the correct request for getAdminUsers', () => {
      const expectedUrl = `/admin/users`
      pybossa.getAdminUsers()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for searchUsers', () => {
      const expectedUrl = `/admin/users`
      pybossa.searchUsers(form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for addAdminUser', () => {
      const userId = 42
      const expectedUrl = `/admin/users/add/${userId}`
      pybossa.addAdminUser(userId)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for delAdminUser', () => {
      const userId = 42
      const expectedUrl = `/admin/users/del/${userId}`
      pybossa.delAdminUser(userId)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for exportUsers', () => {
      const format = 'json'
      const expectedUrl = `/admin/users/export`
      const expectedParams = {
        responseType: 'arraybuffer',
        params: {
          format: format
        }
      }
      pybossa.exportUsers(format)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl, expectedParams)
    })

    it('makes the correct request for getAdminCategories', () => {
      const expectedUrl = `/admin/categories`
      pybossa.getAdminCategories()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for addCategory', () => {
      const expectedUrl = `/admin/categories`
      pybossa.addCategory(form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct requests for deleteCategory', () => {
      const categoryId = 42
      const expectedUrl = `/admin/categories/del/${categoryId}`
      const getDeleteCategoryResponse = pybossaTestResponses.getDeleteCategory
      mockGet.mockReturnValue(new Promise((resolve, reject) => {
        resolve(getDeleteCategoryResponse)
      }))
      return pybossa.deleteCategory(categoryId, form).then(r => {
        expect(mockGet).toHaveBeenCalledWith(expectedUrl)
        expect(mockPost).toHaveBeenCalledWith(expectedUrl, {
          headers: {
            'X-CSRFToken': getDeleteCategoryResponse.data.form.csrf
          }
        })
      })
    })

    it('makes the correct request for getUpdateCategory', () => {
      const categoryId = 42
      const expectedUrl = `/admin/categories/update/${categoryId}`
      pybossa.getUpdateCategory(categoryId)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for updateCategory', () => {
      const categoryId = 42
      const expectedUrl = `/admin/categories/update/${categoryId}`
      pybossa.updateCategory(categoryId, form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for getAdminDashboard', () => {
      const expectedUrl = `/admin/dashboard`
      pybossa.getAdminDashboard()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getAdminFeatured', () => {
      const expectedUrl = `/admin/featured`
      pybossa.getAdminFeatured()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for featureProject', () => {
      const projectId = 42
      const expectedUrl = `/admin/featured/${projectId}`
      pybossa.featureProject(projectId, form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for featureProject', () => {
      const projectId = 42
      const expectedUrl = `/admin/featured/${projectId}`
      pybossa.unfeatureProject(projectId, form)
      expect(mockDel).toHaveBeenCalledWith(expectedUrl, { params: form })
    })
  })

  describe('Help endpoints', () => {
    it('makes the correct request for getApiHelp', () => {
      const expectedUrl = `/help/api`
      pybossa.getApiHelp()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getPrivacyHelp', () => {
      const expectedUrl = `/help/privacy`
      pybossa.getPrivacyHelp()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getCookiesHelp', () => {
      const expectedUrl = `/help/cookies-policy`
      pybossa.getCookiesHelp()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getTermsHelp', () => {
      const expectedUrl = `/help/terms-of-use`
      pybossa.getTermsHelp()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('Stats endpoints', () => {
    it('makes the correct request for getStats', () => {
      const expectedUrl = `stats/`
      pybossa.getStats()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getStatsSummary', () => {
      const expectedUrl = `/api/globalstats`
      pybossa.getStatsSummary()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('Project endpoints', () => {
    it('makes the correct request for getCategory', () => {
      const shortname = 'my_category'
      const expectedUrl = `/project/category/${shortname}/`
      pybossa.getCategory(shortname)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getCategory with page', () => {
      const shortname = 'my_category'
      const page = 42
      const expectedUrl = `/project/category/${shortname}/page/${page}/`
      pybossa.getCategory(shortname, page)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('filters microsite categories for the given key only', () => {
      const categories = pybossaTestResponses.getApiCategories.data
      const key = 'playbills'
      const filtered = pybossa._filterMicrositeCategories(categories, key)
      expect(filtered.length).toBe(1)
      expect(filtered[0].info.collection).toBe(key)
    })

    it('makes the correct request for getMicrositeCategories', () => {
      const key = 'playbills'
      const expectedUrl = `/api/category`
      const expectedParams = {
        info: `collection::${key}`,
        fulltextsearch: 1
      }
      pybossa.getMicrositeCategories(key)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl, expectedParams)
    })

    it('returns the correct categories', () => {
      const key = 'playbills'
      const response = pybossaTestResponses.getApiCategories
      mockGet.mockReturnValue(new Promise((resolve, reject) => {
        resolve(response)
      }))
      return pybossa.getMicrositeCategories(key).then(r => {
        expect(r.data.categories.length).toBe(1)
        expect(r.data.categories[0].info.collection).toBe(key)
      })
    })

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

    it('makes the correct request for getNewProject', () => {
      const expectedUrl = `/project/new`
      pybossa.getNewProject()
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for newProject', () => {
      const expectedUrl = `/project/new`
      pybossa.newProject(form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for getDeleteProject', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}/delete`
      pybossa.getDeleteProject(shortname)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for deleteProject', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}/delete`
      pybossa.deleteProject(shortname, form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for getUpdateProject', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}/update`
      pybossa.getUpdateProject(shortname)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for updateProject', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}/update`
      pybossa.updateProject(shortname, form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
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

    it('makes the correct request for getBrowseTasks', () => {
      const shortname = 'my_project'
      const page = 42
      const expectedUrl = `/project/${shortname}/tasks/browse/${page}`
      pybossa.getBrowseTasks(shortname, page)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })

    it('makes the correct request for getTaskImporter', () => {
      const shortname = 'my_project'
      const type = 'csv'
      const expectedUrl = `/project/${shortname}/tasks/import`
      pybossa.getTaskImporter(shortname, type)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl, { params: {
        type: type
      }})
    })

    it('makes the correct request for importTasks', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}/tasks/import`
      pybossa.importTasks(shortname, form)
      expect(mockPost).toHaveBeenCalledWith(expectedUrl, { params: form })
    })

    it('makes the correct request for getTutorial', () => {
      const shortname = 'my_project'
      const expectedUrl = `/project/${shortname}/tutorial`
      pybossa.getTutorial(shortname)
      expect(mockGet).toHaveBeenCalledWith(expectedUrl)
    })
  })
})
