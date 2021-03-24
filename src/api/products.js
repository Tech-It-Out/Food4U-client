import apiUrl from '../apiConfig'
import axios from 'axios'

function getProductsFromApi () {
  return axios.get(apiUrl + '/products')
}

export {
  getProductsFromApi
}
