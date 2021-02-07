// import store from '../store/index.js'
import Vue from 'vue'
// import {connectionWebSocket} from '@/util/WebSocket'

// 跨域
const  {
    BASE_URL
}  =  require("../const.js");

/**
 * 目录树前方图标切换
 * isleaf 返回 true or false
 * true 表示没有子目录 显示 LeafIcon
 * false 表示有子目录 显示 noLeafIcon
 * @param {boolean} isleaf 显示对应的图标
 * @returns {base64} 返回图片格式
 */
export const Doc_TreeIconChange = isleaf => {
    let LeafIcon = ''
    if (isleaf) LeafIcon = 'huang'
    else LeafIcon = 'Smallfolder'
    let imgUrl = require(`@/assets/tree/${LeafIcon}.png`)
    return imgUrl
}


/**
 * 模板选择前方图标切换
 * isleaf 返回 true or false
 * true 表示没有子目录 显示 LeafIcon
 * false 表示有子目录 显示 noLeafIcon
 * @param {boolean} isleaf 显示对应的图标
 * @returns {base64} 返回图片格式
 */

// TemplateFirstTime 第一次进来获取 isleaf 时使用
let TemplateFirstTime = true
export const Doc_TemplateIconChange = isleaf => {
    let LeafIcon = ''
    if (isleaf) LeafIcon = 'Document'
    else if (isleaf === 'Root') LeafIcon = 'Root'
    else LeafIcon = 'Project'
    if (TemplateFirstTime) {
        // 第一次进来的参数是 所有模板
        LeafIcon = 'Root'
        TemplateFirstTime = false
    }
    let imgUrl = require(`@/assets/templateIcon/${LeafIcon}.png`)
    return imgUrl
}


// 下载文件
export const File_Download = (fileUrl, fileName) => {
    // 新建一个不可见的a标签节点，设置他的属性，再模拟点击
    const a = document.createElement('a')

    // let i1 = fileUrl.lastIndexOf('?')
    // let i2 = fileUrl.lastIndexOf('/', i1)

    // fileUrl = fileUrl.slice(0, i2 + 1) + encodeURIComponent(fileUrl.slice(i2 + 1, i1)) + fileUrl.slice(i1)
    console.log(fileUrl)

    a.download = fileName
    a.href = fileUrl
    a.click()
    a.remove()
}


// 用来过滤 desc__name 这样的字段的，去掉 desc
export function filterName(v) {
    // __ 的下标
    let index1 = v.indexOf("__")
    let index2 = v.slice(0, index1).lastIndexOf('\n')
    if (index2 === -1) {
        index2 = v.slice(0, index1).lastIndexOf(' ')
        if (index2 === -1) {
            return v.slice(index1 + 2)
        }
    }
    return v.slice(0, index2 + 1) + v.slice(index1 + 2)
}



//数字金额转中文大写金额
export function ConvertMoneyToChineseCapital(money) {
    let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
    let cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
    let cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
    let cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
    let cnInteger = "整"; //整数金额时后面跟的字符
    let cnIntLast = "元"; //整型完以后的单位
    let maxNum = 999999999999999.9999; //最大处理的数字
    let IntegerNum; //金额整数部分
    let DecimalNum; //金额小数部分
    let ChineseStr = ""; //输出的中文金额字符串
    let parts; //分离金额后用的数组，预定义
    if (money == "") {
        return "";
    }
    money = parseFloat(money);
    if (money >= maxNum) {
        alert('超出最大处理数字');
        return "";
    }
    if (money == 0) {
        ChineseStr = cnNums[0] + cnIntLast + cnInteger;
        return ChineseStr;
    }
    money = money.toString(); //转换为字符串
    if (money.indexOf(".") == -1) {
        IntegerNum = money;
        DecimalNum = '';
    } else {
        parts = money.split(".");
        IntegerNum = parts[0];
        DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
        let zeroCount = 0;
        let IntLen = IntegerNum.length;
        for (let i = 0; i < IntLen; i++) {
            let n = IntegerNum.substr(i, 1);
            let p = IntLen - i - 1;
            let q = p / 4;
            let m = p % 4;
            if (n == "0") {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    ChineseStr += cnNums[0];
                }
                zeroCount = 0; //归零
                ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                ChineseStr += cnIntUnits[q];
            }
        }
        ChineseStr += cnIntLast;
        //整型部分处理完毕
    }
    if (DecimalNum != '') { //小数部分
        let decLen = DecimalNum.length;
        for (let i = 0; i < decLen; i++) {
            let n = DecimalNum.substr(i, 1);
            if (n != '0') {
                ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (ChineseStr == '') {
        ChineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (DecimalNum == '') {
        ChineseStr += cnInteger;
    }
    return ChineseStr;
}



/**
 * 接受一个 Date 对象，将时间转换成类似 2020/6/23 10:01:00 这样的格式
 * 
 */

export function timeFormat(date) {
    return `${date.toLocaleDateString()} ${date.toTimeString().slice(0, 9)}`
}

/**
 * 根据文件名判断文件类型
 * 
 */
export function checkFileType(fileName) {
    let suffix = fileName.split(".").pop().toUpperCase();
    let previewType = ''
    if (['PNG', "JPG", "JPGE", "JPEG"].includes(suffix)) {
        previewType = 'IMAGE'
    } else if (['DOC', "DOCX", "XLSX", "XLS", "PPTX", "PPT", "PDF", "TXT", "PDF"].includes(suffix)) {
        previewType = 'DOC'
    } else if (['MP4', "WEBM", "OGG"].includes(suffix)) {
        previewType = 'VIDEO'
    }
    return previewType
}



/**
 * 设置拖拽事件
 * @param {Boolean} v 是增加事件监听还是移除
 * @param {Node} node DOM node DOM节点
 * @param {Function} enter 拖拽进入事件
 * @param {Function} leave 拖拽离开事件
 * @param {Function} drop 拖拽放下事件
 * 
 */
export function setDragEventListener(v, node, enter = () => { }, leave = () => { }, drop = () => { }){
    if (!node) return;
    if (v) {
        let lastEnter = null;
        // 设置
        node.ondragenter = (e) => {
            if (lastEnter === null) {
                enter(e)
            }
            lastEnter = e.target
            e.preventDefault()
            // e.stopPropagation()
        }
        node.ondragleave = (e) => {
            if (e.target === lastEnter) {
                leave(e)
                lastEnter = null
            }

            e.preventDefault()
            // e.stopPropagation()
        }
        node.ondrop = (e) => {
            drop(e)
            e.preventDefault()
            // e.stopPropagation()
        }
        node.ondragover = (e) => {
            e.preventDefault()
            // e.stopPropagation()
        }
    } else {
        // 移除
        node.ondragover = null
        node.ondragenter = null
        node.ondragleave = null
        node.drop = null
    }
}

/**
 * 一个promise形式的，动态显示dialog的方法
 * @param {Obejct} option 
 * {
 *  title: dialog标题,
 *  content: dialog正文,
 *  operation: [{
 *  text: 按钮文本,
 *  value: 按钮回调值 
 *  }]
 * 
 * }
 */
export async function makeDialog(option) {
    return new Promise((resolve) => {
        let dom = document.createElement("div")
        document.getElementsByTagName('body')[0].appendChild(dom)
        let tpl = 
        '<el-dialog \
            class="width-25" \
            v-if="show"\
            :close-on-click-modal="false" \
            :custom-class="customClass" \
            :title="title" \
            :visible.sync="show" \
            :before-close="handleClose" \
        > \
            {{ content }}\
            <template v-slot:footer>\
            <el-button type="primary" v-for="(i, index) in operation" :key="index" @click="confirmDialog(i.value)">{{ i.text }}</el-button>\
            </template>\
        </el-dialog>'
        new Vue({
            el: dom,
            data() {
                return {
                    title: option.title || '提示',
                    show: true,
                    content: option.content || '',
                    operation: option.operation
                }
            },
            template: tpl,
            computed: {
                customClass() {
                    return ''
                }
            },
            methods: {
                handleClose(done) {
                    // 用户手动关闭
                    resolve({
                        success: false,
                        result: ''
                    })
                    done()
                },
                closeDialog() {
                    this.show = false
                },
                confirmDialog(result) {
                    resolve({
                        success: true,
                        result,
                    })
                    this.show = false
                } 
            }
        })
    })
}