const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  ipaddress: state => state.user.ipaddress,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  wallet: state => state.user.wallet,
  wallet_btc: state => state.user.wallet_btc,
  is_logged_in: state => state.user.token !== undefined && state.user.token !== '',
  is_admin_logged_in: state => state.admin.token !== undefined && state.admin.token !== '',
  user_id: state => state.user.user_id,
  crash_server_url: state => state.app.crash_server_url,
  detail_id: state => state.app.detail_id,
  chat_server_url: state => state.app.chat_server_url,
  crash_chat: state => state.app.crash_chat,
  permission_routes: state => state.permission.routes
}
export default getters
