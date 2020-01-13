import request from '../utils/request';

export function getAllUser() {
  return request({
    url: '/api/user',
    method: 'get',
  });
}
export function addUser(userInfo) {
  return request({
    url: '/api/user',
    method: 'post',
    data: userInfo,
  });
}

export function delUser(userId) {
  return request({
    url: `/api/user/${userId}`,
    method: 'delete',
  });
}
