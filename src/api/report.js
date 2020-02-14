import request from '../utils/request';

export function getReportByUserId(userId) {
  return request({
    url: '/api/report',
    method: 'get',
    params: { userId },
  });
}

export function deleteReport(reportId) {
  return request({
    url: `/api/report/${reportId}`,
    method: 'delete',
  });
}

export function sendReport(reportId) {
  return request({
    url: `/api/report/${reportId}`,
    method: 'put',
  });
}
