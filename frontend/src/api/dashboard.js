
/**
 * Gal 2019.09.14
 * Dashboard
 */
import request from '@/utils/request'

export function fetchStatistics(data) {
  return request({
    url: '/api/dashboard/statistics',
    method: 'post',
    data
  })
}

export function fetchVisits(data) {
  return request({
    url: '/api/dashboard/visits',
    method: 'post',
    data
  })
}
