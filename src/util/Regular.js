/**
 * @description 验证手机号是否是有效手机号
 * @param {String} telephone 需要验证的手机号码
 * @returns {Boolean}
 * @see https://blog.csdn.net/u011415782/article/details/85601655
 */
const TEL_REG_EXP = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
export function isTelephoneValid(telephone) {
    // 是否為數值
    if (!Number.isInteger(telephone)) {
        return false
    } else {
        // 長度不為 11
        if (telephone.toString().length !== 11) {
            return false
        } else {
            return TEL_REG_EXP.test(telephone)
        }
    }
}
