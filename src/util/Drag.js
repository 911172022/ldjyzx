// export function Drag(resize, resize2, left, main, right, home) {
export function Drag(resize, left, main, right, home) {
  // 左点击触发
  resize.onmousedown = (e) => {
    // 当前位置
    let startX = e.clientX
    let ReduceWidth = resize.offsetWidth + right.offsetWidth
    let TotalWidth = home.clientWidth
    resize.left = resize.offsetLeft
    // 移动鼠标
    document.onmousemove = function (e) {
      // 移动位置
      let endX = e.clientX
      // 左边总宽 
      let moveLen = resize.left + (endX - startX)
      // 总宽 maxT 左边 + 中间
      let maxT = TotalWidth - ReduceWidth
      if (moveLen > maxT - 500) {
        moveLen = maxT - 500
      } else if (moveLen < 230) {
        moveLen = 230
      }
      let mwidth = maxT - moveLen
      resize.style.left = moveLen
      left.style.width = `${moveLen}px`
      main.style.width = `${mwidth}px`
    }
    // 放开鼠标
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null
      resize.releaseCapture && resize.releaseCapture()
    }
    // 鼠标的位置
    resize.setCapture && resize.setCapture()
    return false
  }
  // 右点击触发
  // resize2.onmousedown = (e) => {
  //   // 当前位置
  //   let startX = e.clientX
  //   let ReduceWidth = resize.offsetWidth + resize2.offsetWidth + left.offsetWidth
  //   let TotalWidth = home.clientWidth
  //   resize2.left = right.offsetLeft
  //   let iframe = parent.document.getElementById('iframeMask')
  //   if (iframe !== null) {
  //     iframe.style.opacity = 1
  //     iframe.style.zIndex = 2001
  //   }
    
  //   // 移动鼠标
  //   document.onmousemove = (e) => {
  //     // 移动位置
  //     let endX = e.clientX
  //     // 右边总宽 
  //     let moveLen = TotalWidth - (resize2.left + (endX - startX))
  //     // 总宽 maxT 右边 + 中间 - 左边
  //     let maxT = TotalWidth - ReduceWidth
  //     if (moveLen > maxT - 500) {
  //       moveLen = maxT - 500
  //     } else if (moveLen < 230) {
  //       moveLen = 230
  //     }
  //     let mwidth = maxT - moveLen
  //     resize2.style.left = moveLen
  //     right.style.width = `${moveLen}px`
  //     main.style.width = `${mwidth}px`
  //   }
    
  //   // 放开鼠标
  //   document.onmouseup = function () {
  //     document.onmousemove = null
  //     document.onmouseup = null
  //     if (iframe !== null) {
  //       iframe.style.opacity = 0
  //       iframe.style.zIndex = -1
  //     }
  //     resize2.releaseCapture && resize2.releaseCapture()
  //   }
  //   resize2.setCapture && resize2.setCapture()
  //   return false
  // }
  return
}
