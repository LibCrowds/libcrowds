import axios from 'axios'

class Explicates {
  constructor (options) {
    this.baseURL = options.baseURL
    this.accept = options.accept
    this.client = this._createAxiosClient()
  }

  /**
   * Create an AnnotationCollection.
   * @param {Object} data
   *   The AnnotationCollection data.
   * @param {String} slug
   *   A suggestion for the IRI path segment.
   */
  createCollection (data, slug = null) {
    const endpoint = '/annotations/'
    const headers = {}
    if (slug) {
      headers['Slug'] = slug
    }
    return this.client.post(endpoint, data, {
      headers: headers
    })
  }

  /**
   * Get an AnnotationCollection.
   * @param {String} iri
   *   The IRI of the AnnotationCollection.
   * @param {Boolean} minimal
   *   Prefer a minimal container.
   * @param {Boolean} iris
   *   Prefer contained IRIs.
   */
  getCollection (iri, minimal = false, iris = false) {
    const headers = {
      prefer: this._getPreferHeader(minimal, iris)
    }
    return this.client.get(iri, {
      headers: headers
    })
  }

  /**
   * Update an AnnotationCollection.
   * @param {String} iri
   *   The IRI of a the AnnotationCollection.
   * @param {Object} data
   *   The AnnotationCollection data.
   */
  updateCollection (containerIri, data) {
    return this.client.put(containerIri, data)
  }

  /**
   * Delete an AnnotationCollection.
   * @param {String} iri
   *   The IRI of a the AnnotationCollection.
   */
  deleteCollection (iri) {
    return this.client.delete(iri)
  }

  /**
   * Create an Annotation.
   * @param {String} containerIri
   *   The IRI of an AnnotationCollection.
   * @param {Object} data
   *   The Annotation data.
   * @param {String} slug
   *   Suggestion for the IRI path segment.
   */
  createAnnotation (containerIri, data, slug = null) {
    const headers = {}
    if (slug) {
      headers['Slug'] = slug
    }
    return this.client.post(containerIri, data, {
      headers: headers
    })
  }

  /**
   * Get an Annotation.
   * @param {String} iri
   *   The IRI of a the Annotation.
   */
  getAnnotation (iri) {
    return this.client.get(iri)
  }

  /**
   * Update an Annotation.
   * @param {String} iri
   *   The IRI of a the Annotation.
   * @param {Object} data
   *   The Annotation data.
   */
  updateAnnotation (containerIri, data) {
    return this.client.put(containerIri, data)
  }

  /**
   * Delete an Annotation.
   * @param {String} iri
   *   The IRI of a the Annotation.
   */
  deleteAnnotation (iri) {
    return this.client.delete(iri)
  }

  /**
   * Search for AnnotationCollections.
   * @param {Object} params
   *   The query parameters.
   * @param {Boolean} minimal
   *   Prefer a minimal container.
   * @param {Boolean} iris
   *   Prefer contained IRIs.
   */
  searchCollections (params, minimal = false, iris = false) {
    return this._search('collection', params, minimal, iris)
  }

  /**
   * Search for Annotations.
   * @param {Object} params
   *   The query parameters.
   * @param {Boolean} minimal
   *   Prefer a minimal container.
   * @param {Boolean} iris
   *   Prefer contained IRIs.
   */
  searchAnnotations (params, minimal = false, iris = false) {
    return this._search('annotation', params, minimal, iris)
  }

  /**
   * Perform a search.
   * @param {Object} table
   *   The table to search.
   * @param {Object} params
   *   The query parameters.
   * @param {Boolean} minimal
   *   Prefer a minimal container.
   * @param {Boolean} iris
   *   Prefer contained IRIs.
   */
  _search (table, params, minimal, iris) {
    const endpoint = '/search/' + table + '/'
    const headers = {
      prefer: this._getPreferHeader(minimal, iris)
    }
    return this.client.get(endpoint, {
      params: params,
      headers: headers
    })
  }

  /**
   * Return the Prefer header.
   * @param {Boolean} minimal
   *   Prefer a minimal container.
   * @param {Boolean} iris
   *   Prefer contained IRIs.
   */
  _getPreferHeader (minimal, iris) {
    const ns = ['http://www.w3.org/ns/oa#PreferContainedDescriptions']

    if (iris) {
      ns[0] = 'http://www.w3.org/ns/oa#PreferContainedIRIs'
    }
    if (minimal) {
      ns.push('http://www.w3.org/ns/ldp#PreferMinimalContainer')
    }

    return 'return=representation; include="' + ns.join(' ') + '"'
  }

  /**
   * Return a configured axios instance.
   */
  _createAxiosClient () {
    const instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Accept': this.accept
      },
      withCredentials: true
    })

    // Enable response debugger
    if (this.debug) {
      instance.interceptors.response.use(resp => {
        // eslint-disable-next-line no-console
        console.log('Response:', resp)
        return resp
      })
    }

    // Internal request helpers ($get, $post, $put, $delete)
    for (let m in ['get', 'post', 'put', 'delete']) {
      instance['$' + m] = function () {
        return this[m].apply(this, arguments).then(res => res && res.data)
      }.bind(instance)
    }

    return instance
  }
}

export default (ctx, inject) => {
  const options = {
    baseURL: '<%= options.baseURL %>',
    accept: '<%= options.accept %>'
  }

  // Create a new Explicates instance
  const explicates = new Explicates(options)

  // Inject as $explicates
  ctx.$explicates = explicates
  inject('explicates', explicates)
}
