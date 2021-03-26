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

export const updateOrderItemWithQuantity = (quantity, orderId, orderItemId, token) => {
  return axios({
    url: apiUrl + '/orders/' + orderId + '/orderItem/' + orderItemId,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      orderItem: {
        quantity: quantity
      }
    }
  })
}

export const createNewOrderItemWithData = (orderId, token, product) => {
  return axios({
    url: apiUrl + '/orders/' + orderId + '/orderItem',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      orderItem: {
        productName: product.name,
        price: product.price,
        quantity: 1,
        productId: product._id.toString()
      }
    }
  })
}

export const createNewOrder = token => {
  return axios({
    url: apiUrl + '/orders',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      order: {
        status: 'cart'
      }
    }
  })
}

export const deleteOrderItem = (orderId, orderItemId, token) => {
  return axios({
    url: apiUrl + '/orders/' + orderId + '/orderItem/' + orderItemId,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
