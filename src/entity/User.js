/**
 * @description 用户类
 */
class User {
  /**
   * @param {String} guid 登录凭据
   * @param {String} username 用户名
   * @param {String} userdesc 用户描述
   * @param {Boolean} isRememberMe 是否关闭浏览器后仍记得用户登录状态
   * @param {Number} expires 过期时间
   */
  constructor(user, isRememberMe) {
    this.sid = user.guid
    this.userkeyword = user.userkeyword
    this.username = user.username
    this.userdesc = user.userdesc
    this.isRememberMe = isRememberMe
    // this.expires = expires
  }
}

export default User
