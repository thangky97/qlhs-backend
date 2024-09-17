const StaffRoute = require('./StaffRoute');


module.exports = [
  { method: 'POST', path: '/staff/login', options: StaffRoute.loginStaff },
  { method: 'POST', path: '/staff/register', options: StaffRoute.registerStaff },
  { method: 'POST', path: '/staff/update', options: StaffRoute.updateById },
  { method: 'POST', path: '/staff/delete', options: StaffRoute.deleteById },
  { method: 'POST', path: '/staff/get-list', options: StaffRoute.find },
  { method: 'POST', path: '/staff/insert', options: StaffRoute.insert },
  { method: 'GET', path: '/staff/get-detail', options: StaffRoute.findById },
  { method: 'POST', path: '/staff/reset-password', options: StaffRoute.resetPasswordStaff },
  { method: 'POST', path: '/staff/change-password', options: StaffRoute.changePasswordStaff },
]