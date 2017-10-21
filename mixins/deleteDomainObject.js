import capitalize from 'capitalize'
import pybossa from '@/api/pybossa'

export const deleteDomainObject = {
  methods: {
    deleteDomainObject (type, id, callback) {
      const terminology = type === 'category' ? 'collection' : type
      this.$swal({
        title: `Delete ${capitalize(terminology)}`,
        text: `Are you sure you want to delete this ${terminology}?`,
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return pybossa.client.delete(`/api/${type}/${id}`)
        }
      }).then(r => {
        callback()
      }, (dismiss) => {
        this.$swal.close()
      })
    }
  }
}
