import addCsrfHeader from '@/api/pybossa/interceptors/addCsrfHeader'
import handleErrors from '@/api/pybossa/interceptors/handleErrors'
import handleFlash from '@/api/pybossa/interceptors/handleFlash'
import capitalize from 'capitalize'

describe('Interceptors', () => {
  let mockNotify = null
  let mockCtx = null

  beforeEach(() => {
    mockNotify = jest.fn()
    mockCtx = {
      app: {
        $notify: mockNotify
      }
    }
  })

  describe('addCsrfHeader', () => {
    it('adds the CSRF header when it exists', () => {
      const token = 'token'
      const request = {
        data: {
          csrf: token
        },
        headers: {}
      }
      addCsrfHeader(request)
      expect(request.headers['X-CSRFToken']).toBe(token)
    })

    it('does not add the CSRF header when it does not exist', () => {
      const request = {
        data: {},
        headers: {}
      }
      addCsrfHeader(request)
      expect(request.headers['X-CSRFToken']).toBe(undefined)
    })
  })

  describe('handleErrors', () => {
    it('handles non-200 errors', () => {
      const error = {
        response: {
          status: 404,
          statusText: 'Uh oh'
        }
      }
      return handleErrors(error).catch(err => {
        expect(err.statusCode).toBe(error.response.status)
        expect(err.message).toBe(error.response.statusText)
      })
    })

    it('handles network errors', () => {
      const error = {
        request: {}
      }
      return handleErrors(error).catch(err => {
        expect(err.statusCode).toBe(598)
        expect(err.message).toBe('Network Error')
      })
    })

    it('handles request setup errors', () => {
      const error = {}
      return handleErrors(error).catch(err => {
        expect(err.statusCode).toBe(500)
        expect(err.message).toBe('Axios Error')
      })
    })
  })

  describe('handleFlash', () => {
    it('dispatches notification from flash message', () => {
      const response = {
        data: {
          status: 'info',
          flash: 'Something happened'
        }
      }
      handleFlash(response, mockCtx)
      expect(mockNotify).toHaveBeenCalledWith({
        title: capitalize(response.data.status),
        text: response.data.flash,
        type: response.data.status
      })
    })

    it('does not dispatch notification for error flash message', () => {
      const response = {
        data: {
          status: 'error',
          flash: 'Something bad happened'
        }
      }
      handleFlash(response, mockCtx)
      expect(mockNotify).not.toHaveBeenCalled()
    })
  })
})
