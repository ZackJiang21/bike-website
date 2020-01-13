import request from '../utils/request';

export function getBikesByUserId(userId) {
  return request({
    url: '/api/bike',
    method: 'get',
    params: { userId },
  });
}

export function deleteBikeById(bikeId) {
  return request({
    url: `/api/bike/${bikeId}`,
    method: 'delete',
  });
}

export function addBike(data, userId) {
  return request({
    url: '/api/bike',
    method: 'post',
    params: { userId },
    data,
  });
}
