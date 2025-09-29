import request from '@/utils/request'

// 查询护理计划列表
export function listNursingPlan(query) {
  return request({
    url: '/nursing/plan/list',
    method: 'get',
    params: query
  })
}

// 查询护理计划详细
export function getNursingPlan(id) {
  return request({
    url: '/nursing/plan/' + id,
    method: 'get'
  })
}

// 新增护理计划
export function addNursingPlan(data) {
  return request({
    url: '/nursing/plan',
    method: 'post',
    data: data
  })
}

// 修改护理计划
export function updateNursingPlan(data) {
  return request({
    url: '/nursing/plan',
    method: 'put',
    data: data
  })
}

// 修改护理计划
export function planStatus(data) {
  return request({
    url: '/nursing/plan',
    method: 'put',
    data: data
  })
}

// 删除护理计划
export function delNursingPlan(id) {
  return request({
    url: '/nursing/plan/' + id,
    method: 'delete'
  })
}

export function getPlanAll() {
  return request({
    url: '/nursing/plan/all',
    method: 'get'
  })
}