import axios from 'axios'
import apiUrl from '../apiConfig'

export const getOrderHistoryFromAPI = token => {
  return axios({
    url: apiUrl + '/orders',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
