/**
 * 计算文件大小
 * @param {Number} size 文件大小
 * @return {String} 文件大小
 */
export function FormatFileSize(size) {
    let fileSizeByte = size
    let fileSizeMsg = ''

    // 1kb 1024
    // 1mb 1024 ** 2 = 


    if (fileSizeByte < 1024) {
        fileSizeMsg = fileSizeByte + "B"
    } else if (fileSizeByte < 1024 ** 2) {
        fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB"
    } else if (fileSizeByte >= 1024 ** 2 && fileSizeByte <= 1024 ** 3) {
        fileSizeMsg = (fileSizeByte / (
            1024 * 1024)).toFixed(2) + "MB"
    }
    else if (fileSizeByte > 1024 ** 3 && fileSizeByte < 1024 ** 4) { fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB" }
    return fileSizeMsg
}
