import uuid from 'uuid/v4'
import AxiosMockAdapter from 'axios-mock-adapter'
import pbTestResponses from '@/test/fixtures/pybossaTestResponses.json'
import pybossa from '@/api/pybossa'

describe('PYBOSSA module', () => {
  let mockAxios = null
  let form = null
  let randomData = null

  beforeEach(() => {
    mockAxios = new AxiosMockAdapter(pybossa.client)
    form = {
      csrf: 'token',
      errors: {},
      some_key: null
    }
    randomData = {
      key: uuid()
    }
  })

  describe('Favourites endpoints', () => {
    it('makes the correct request for getFavourites', () => {
      mockAxios.onGet('/api/favourites').reply(200, randomData)
      return pybossa.getFavourites().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for addFavourite', () => {
      const taskId = 42
      const params = {
        task_id: taskId
      }
      mockAxios.onPost('/api/favourites', params).reply(200, randomData)
      return pybossa.addFavourite(taskId).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for deleteFavourite', () => {
      const taskId = 42
      mockAxios.onDelete(`/api/favourites/${taskId}`).reply(200, randomData)
      return pybossa.deleteFavourite(taskId).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })
  })

  describe('Account endpoints', () => {
    it('makes the correct request for getAccountIndex', () => {
      const page = 42
      mockAxios.onGet(`/account/page/${page}`).reply(200, randomData)
      return pybossa.getAccountIndex(page).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getAccountRegistration', () => {
      mockAxios.onGet('/account/register').reply(200, randomData)
      return pybossa.getAccountRegistration().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for register', () => {
      mockAxios.onPost('/account/register', {
        params: form
      }).reply(200, randomData)
      return pybossa.register(form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getAccountSignin', () => {
      mockAxios.onGet('/account/signin').reply(200, randomData)
      return pybossa.getAccountSignin().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for signin', () => {
      mockAxios.onPost('/account/signin', {
        params: form
      }).reply(200, randomData)
      return pybossa.signin(form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for signout', () => {
      mockAxios.onGet('/account/signout').reply(200, randomData)
      return pybossa.signout().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getRecoverPassword', () => {
      mockAxios.onGet('/account/forgot-password').reply(200, randomData)
      return pybossa.getRecoverPassword().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for recoverPassword', () => {
      mockAxios.onPost('/account/forgot-password', {
        params: form
      }).reply(200, randomData)
      return pybossa.recoverPassword(form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getAccount', () => {
      const name = 'me'
      mockAxios.onGet(`/account/${name}/`).reply(200, randomData)
      return pybossa.getAccount(name).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getProfile', () => {
      mockAxios.onGet('/account/profile').reply(200, randomData)
      return pybossa.getProfile().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getAccountProjects', () => {
      const name = 'me'
      mockAxios.onGet(`/account/${name}/projects`).reply(200, randomData)
      return pybossa.getAccountProjects(name).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getUpdateProfile', () => {
      const name = 'me'
      mockAxios.onGet(`/account/${name}/update`).reply(200, randomData)
      return pybossa.getUpdateProfile(name).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for updateProfile', () => {
      const name = 'me'
      const type = 'Upload'
      form.btn = type
      mockAxios.onPost(`/account/${name}/update`, {
        params: form
      }).reply(200, randomData)
      return pybossa.updateProfile(name, form, type).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getResetPassword', () => {
      const url = '/account/reset-password'
      const params = {
        key: 'secret'
      }
      mockAxios.onGet(url, {
        params: params
      }).reply(200, randomData)
      return pybossa.getResetPassword(params).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for resetPassword', () => {
      const url = '/account/reset-password'
      mockAxios.onPost(url, {
        params: form
      }).reply(200, randomData)
      return pybossa.resetPassword(form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getResetApiKey', () => {
      const name = 'me'
      const url = `/account/${name}/resetapikey`
      mockAxios.onGet(url).reply(200, randomData)
      return pybossa.getResetApiKey(name).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for resetApiKey', () => {
      const name = 'me'
      mockAxios.onPost(`/account/${name}/resetapikey`, {
        params: form
      }).reply(200, randomData)
      return pybossa.resetApiKey(name, form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for subscribeToNewsletter', () => {
      mockAxios.onGet(`/account/newsletter`, {
        subscribe: 'True'
      }).reply(200, randomData)
      return pybossa.subscribeToNewsletter(true).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getConfirmEmail', () => {
      mockAxios.onGet('/account/confirm-email').reply(200, randomData)
      return pybossa.getConfirmEmail().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for confirmEmail', () => {
      const params = {
        key: 'secret'
      }
      mockAxios.onGet('/account/register/confirmation', {
        params: params
      }).reply(200, randomData)
      return pybossa.confirmEmail(params).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })
  })

  describe('Leaderboard endpoints', () => {
    it('makes the correct request getLeaderboard', () => {
      const window = 42
      mockAxios.onGet(`leaderboard/window/${window}`).reply(200, randomData)
      return pybossa.getLeaderboard(window).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })
  })

  describe('Announcements endpoints', () => {
    it('makes the correct request for getAnnouncements', () => {
      mockAxios.onGet(`/announcements`).reply(200, randomData)
      return pybossa.getAnnouncements().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })
  })

  describe('Admin endpoints', () => {
    it('makes the correct request for getAdminAnnouncements', () => {
      mockAxios.onGet(`/admin/announcement`).reply(200, randomData)
      return pybossa.getAdminAnnouncements().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getNewAnnouncement', () => {
      mockAxios.onGet(`/admin/announcement/new`).reply(200, randomData)
      return pybossa.getNewAnnouncement().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for newAnnouncement', () => {
      mockAxios.onPost(`/admin/announcement/new`, {
        params: form
      }).reply(200, randomData)
      return pybossa.newAnnouncement(form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getUpdateAnnouncement', () => {
      const announcementId = 42
      const url = `/admin/announcement/${announcementId}/update`
      mockAxios.onGet(url).reply(200, randomData)
      return pybossa.getUpdateAnnouncement(announcementId).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for updateAnnouncement', () => {
      const announcementId = 42
      const url = `/admin/announcement/${announcementId}/update`
      mockAxios.onPost(url, { params: form }).reply(200, randomData)
      return pybossa.updateAnnouncement(announcementId, form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getAdminUsers', () => {
      mockAxios.onGet(`/admin/users`).reply(200, randomData)
      return pybossa.getAdminUsers().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for searchUsers', () => {
      mockAxios.onPost(`/admin/users`, {
        params: form
      }).reply(200, randomData)
      return pybossa.searchUsers(form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for addAdminUser', () => {
      const userId = 42
      mockAxios.onGet(`/admin/users/add/${userId}`).reply(200, randomData)
      return pybossa.addAdminUser(userId).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for delAdminUser', () => {
      const userId = 42
      mockAxios.onGet(`/admin/users/del/${userId}`).reply(200, randomData)
      return pybossa.delAdminUser(userId).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for exportUsers', () => {
      const format = 'json'
      mockAxios.onGet(`/admin/users/export`, {
        responseType: 'arraybuffer',
        params: {
          format: format
        }
      }).reply(200, randomData)
      pybossa.exportUsers(format).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getAdminCategories', () => {
      mockAxios.onGet(`/admin/categories`).reply(200, randomData)
      return pybossa.getAdminCategories().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for addCategory', () => {
      mockAxios.onPost(`/admin/categories`, {
        params: form
      }).reply(200, randomData)
      return pybossa.addCategory(form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct requests for deleteCategory', () => {
      const categoryId = 42
      const expectedUrl = `/admin/categories/del/${categoryId}`
      const getDeleteCategoryResponse = pbTestResponses.getDeleteCategory
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
      const url = `/admin/categories/update/${categoryId}`
      mockAxios.onGet(url).reply(200, randomData)
      return pybossa.getUpdateCategory(categoryId).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for updateCategory', () => {
      const categoryId = 42
      const expectedUrl =
      mockAxios.onPost(`/admin/categories/update/${categoryId}`, {
        params: form
      }).reply(200, randomData)
      return pybossa.updateCategory(categoryId, form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getAdminDashboard', () => {
      mockAxios.onGet(`/admin/dashboard`).reply(200, randomData)
      return pybossa.getAdminDashboard().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getAdminFeatured', () => {
      mockAxios.onGet(`/admin/featured`).reply(200, randomData)
      return pybossa.getAdminFeatured().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for featureProject', () => {
      const projectId = 42
      mockAxios.onPost(`/admin/featured/${projectId}`, {
        params: form
      }).reply(200, randomData)
      return pybossa.featureProject(projectId, form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for unfeatureProject', () => {
      const projectId = 42
      mockAxios.onDelete(`/admin/featured/${projectId}`, {
        params: form
      }).reply(200, randomData)
      return pybossa.unfeatureProject(projectId, form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })
  })

  describe('Stats endpoints', () => {
    it('makes the correct request for getStats', () => {
      mockAxios.onGet(`/stats`).reply(200, randomData)
      return pybossa.getStats().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getStatsSummary', () => {
      mockAxios.onGet(`/api/globalstats`).reply(200, randomData)
      return pybossa.getStatsSummary().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })
  })

  describe('Project endpoints', () => {
    it('makes the correct request for getCategory', () => {
      const shortname = 'my_category'
      mockAxios.onGet(`/project/category/${shortname}`).reply(200, randomData)
      return pybossa.getCategory(shortname).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getCategory with page', () => {
      const shortname = 'my_category'
      const page = 42
      const url = `/project/category/${shortname}/page/${page}`
      mockAxios.onGet(url).reply(200, randomData)
      return pybossa.getCategory(shortname, page).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('filters microsite categories for the given key only', () => {
      const key = 'playbills'
      const matchingCategory = {
        'id': 1,
        'info': {
          'collection': key
        }
      }
      const categories = [
        matchingCategory,
        {
          'id': 1,
          'info': {
            'collection': 'something_else'
          }
        }
      ]
      const filtered = pybossa._filterMicrositeCategories(categories, key)
      expect(filtered).toEqual([matchingCategory])
    })

    it('makes the correct request for getMicrositeCategories', () => {
      const key = 'playbills'
      const expectedUrl = `/api/category`
      const expectedParams = {
        info: `collection::${key}`,
        fulltextsearch: 1
      }
      return pybossa.getMicrositeCategories(key).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('returns the correct categories for a microsite', () => {
      const key = 'playbills'
      const matchingCategory = {
        'id': 1,
        'info': {
          'collection': key
        }
      }
      const response = {
        data: [
          matchingCategory,
          {
            'id': 1,
            'info': {
              'collection': 'something_else'
            }
          }
        ]
      }
      mockAxios.onGet(`/api/category`,
      {
        prams: {
          info: `collection::${key}`,
          fulltextsearch: 1
        }
      }).reply(200, response)

      return pybossa.getMicrositeCategories(key).then(r => {
        expect(r.data).toEqual({
          categories: [ matchingCategory ]
        })
      })
    })

    it('makes the correct request for getProject', () => {
      const shortname = 'my_project'
      mockAxios.onGet(`/project/${shortname}`).reply(200, randomData)
      return pybossa.getProject(shortname).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getProjectStats', () => {
      const shortname = 'my_project'
      mockAxios.onGet(`/project/${shortname}/stats`).reply(200, randomData)
      return pybossa.getProjectStats(shortname).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getNewProject', () => {
      mockAxios.onGet(`/project/new`).reply(200, randomData)
      return pybossa.getNewProject().then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for newProject', () => {
      mockAxios.onPost(`/project/new`, {
        params: form
      }).reply(200, randomData)
      return pybossa.newProject(form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getDeleteProject', () => {
      const shortname = 'my_project'
      mockAxios.onGet(`/project/${shortname}/delete`).reply(200, randomData)
      return pybossa.getDeleteProject(shortname).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for deleteProject', () => {
      const shortname = 'my_project'
      mockAxios.onPost(`/project/${shortname}/delete`, {
        params: form
      }).reply(200, randomData)
      return pybossa.deleteProject(shortname, form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getUpdateProject', () => {
      const shortname = 'my_project'
      mockAxios.onGet(`/project/${shortname}/update`).reply(200, randomData)
      return pybossa.getUpdateProject(shortname).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for updateProject', () => {
      const shortname = 'my_project'
      mockAxios.onPost(`/project/${shortname}/update`, {
        params: form
      }).reply(200, randomData)
      return pybossa.updateProject(shortname, form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for exportData', () => {
      const shortName = 'my_project'
      const type = 'result'
      const format = 'json'
      mockAxios.onGet(`/project/${shortName}/tasks/export`, {
        responseType: 'arraybuffer',
        params: {
          type: type,
          format: format
        }
      }).reply(200, randomData)
      return pybossa.exportData(shortName, type, format).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getBrowseTasks', () => {
      const shortname = 'my_project'
      const page = 42
      const url = `/project/${shortname}/tasks/browse/${page}`
      mockAxios.onGet(url).reply(200, randomData)
      return pybossa.getBrowseTasks(shortname, page).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getTaskImporter', () => {
      const shortname = 'my_project'
      const type = 'csv'
      mockAxios.onGet(`/project/${shortname}/tasks/import`, {
        params: {
          type: type
        }
      }).reply(200, randomData)
      return pybossa.getTaskImporter(shortname, type).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for importTasks', () => {
      const shortname = 'my_project'
      mockAxios.onPost(`/project/${shortname}/tasks/import`, {
        params: form
      }).reply(200, randomData)
      return pybossa.importTasks(shortname, form).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })

    it('makes the correct request for getTutorial', () => {
      const shortname = 'my_project'
      mockAxios.onGet(`/project/${shortname}/tutorial`).reply(200, randomData)
      return pybossa.getTutorial(shortname).then(r => {
        expect(r.data).toEqual(randomData)
      })
    })
  })
})
