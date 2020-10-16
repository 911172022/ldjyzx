import DOCpng from '@/assets/table/DOC.png'
import JPGpng from '@/assets/table/JPG.png'
import PDFpng from '@/assets/table/PDF.png'
import PNGpng from '@/assets/table/PNG.png'
import PPTpng from '@/assets/table/PPT.png'
import XLSpng from '@/assets/table/XLS.png'
import ZIPpng from '@/assets/table/ZIP.png'
import TXTpng from '@/assets/table/TXT.png'
import DLLpng from '@/assets/table/DLL.png'
import VIDEOpng from "@/assets/table/VIDEO.png"
import AUDIOpng from "@/assets/table/AUDIO.png"
import currencypng from '@/assets/table/currency.png'

/**
 * 判断文档类型
 * @param {String} title 文档名称
 * @return {String} icon 路径
 */

export const AddTypeIcon = (title) => {
    let StringtoBig = '', imgUrl = ''
    if (!title) {
        StringtoBig = ''
    } else {
        let arrTitle = title.split('.')
        // arrTitle.pop() 取最后一个数组资料
        // toUpperCase 转大写
        StringtoBig = ((arrTitle.pop()).toUpperCase())
    }
    if (StringtoBig === 'DOCX' || StringtoBig === 'DOC') {
        imgUrl = DOCpng
    } else if (StringtoBig === 'JPG') {
        imgUrl = JPGpng
    } else if (StringtoBig === 'PDF') {
        imgUrl = PDFpng
    } else if (StringtoBig === 'PNG') {
        imgUrl = PNGpng
    } else if (StringtoBig === 'PPT' || StringtoBig === 'PPTX') {
        imgUrl = PPTpng
    } else if (StringtoBig === 'XLSX' || StringtoBig === 'XLS') {
        imgUrl = XLSpng
    } else if (StringtoBig === 'ZIP' || StringtoBig === 'RAR') {
        imgUrl = ZIPpng
    } else if (StringtoBig === 'TXT') {
        imgUrl = TXTpng
    } else if (StringtoBig === 'DLL') {
        imgUrl = DLLpng
    } else if (["MP4", "MOV", '3GP', 'MPEG', 'AVI', 'FLV', 'WMV', 'RM', 'RMVB'].indexOf(StringtoBig) != -1) {
        // 2020.4.21-8 视频格式
        imgUrl = VIDEOpng
    } else if (StringtoBig === 'MP3') {
        // 音频格式
        imgUrl = AUDIOpng
    }
    else {
        imgUrl = currencypng
    }
    return imgUrl
}

export const statusIcon = (status) => {
    if (status === '检入') {
        return require("../assets/table/status/检入.png")
    } else if(status === '输出') {
        return require('@/assets/table/status/输出.png')
    } else if(status === '锁定') {
        return require('@/assets/table/status/锁定.png')
    } else if(status === '已打开') {
        return require('@/assets/table/status/已打开.png')
    } else if(status === '只读') {
        return require('@/assets/table/status/只读.png')
    } else if(status === '最终状态') {
        return require('@/assets/table/status/最终状态.png')
    } else if (status === '检出') {
        return require("@/assets/table/status/检出.png")
    }
}