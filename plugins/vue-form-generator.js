import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import fieldArray from '@/components/forms/fields/Array.vue'

Vue.use(VueFormGenerator)

Vue.component('fieldArray', fieldArray)
