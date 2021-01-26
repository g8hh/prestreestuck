/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Loading...': '加载中...',
    'Play Again': '重玩',
    'points': '点数',
    'Genesis -': '创世记-',
    'Keep Going': '继续',
    'Offline Time': '离线时间',
    'Multipliers': '倍数',
    'Time Power': '时间力量',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    'made by ducdat': '由ducdat制作',
    'BUT WHY THOUGH': '但是为什么要思想',
    'T: Absorb Time Power': 'T: 吸取时间的力量',
    'server of the person who made the original game': '最初的游戏制作者的服务器',
    'COOL AND NEW INCREMENTAL GAME': '很酷的新增量游戏',
    'Homosuck': '绿帽色',
    'Aqua': '水色',
    'NEVER': '从不',
    'INCOMPLETE': '部分',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'ALWAYS': '一直',
    'SHOWN': '显示',
    'ON': '开启',
    'OFF': '关闭',
    'Default': '默认',
    'Export to clipboard': '导出到剪贴板',
    'UNDEFINED': '未定义',
    'Save': '保存',
    'Import': '导入',
    'HARD RESET': '硬重置',
    'The Prestige Tree Modfinder': '声望树修改器',
    'COOL AND NEW PRESTIGE TREE': '酷和新的声望树',
    'Changelog': '更新日志',
    'Acknowledgements': '鸣谢',
    'a mod of The Prestige Tree made by Jacorb and Aarex': 'Jacorb和Aarex制作的The Prestige Tree的mod',
    'wall of text saying I do not own most of this': '文字墙说我不拥有大部分',
    'using The Modding Tree': '使用改装树',
    'This is made entirely for entertainment and parody purposes, no income is generated from this nor it\'s made to steal anybody\'s original works.': '这完全是出于娱乐和模仿目的而制作的，因此不会产生任何收入，也不会窃取任何人的原创作品。',
    'suggest everything and talk about how bad this mod is here': '建议一切并谈论这个mod有多糟糕',
    'in case you\'re already sick of this': '万一你已经厌倦了这个',
    'see what happened throughout this thing\'s history': '看看这件事的历史发生了什么',
    'Hotkeys': '快捷键',
    'Time Boosters': '时间助推器',
    'Absorb +': '吸收 +',
    'Beginner tip: Hold T to automatically absorb Time Power': '初学者提示：按住T可自动吸收时间能量',
    'You have': '你有',
    'The Prestreestuck': '卡住声望树',
    'The Modding Tree Discord': '改装树Discord',
    'The game is currently being updated.': '游戏正在更新中。',
    'Please check the Discord to see if there are new content updates!': '请检查Discord，看看是否有新的内容更新！',
    'Main Prestige Tree server': '主声望树服务器',

    //原样
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    "Time Multiplier": "时间倍数",
    "Time Played: ": "游戏时长：",
    "based on Homestuck by Andrew Hussie (of course)": "基于Andrew Hussie的Homestuck（当然）",
    "Offline Prod: ": "离线产出: ",
    "Theme: ": "主题: ",
    "Autosave: ": "自动保存: ",
    "Completed Challenges: ": "完成的挑战：",
    "High-Quality Tree: ": "高质量树：",
    "Show Milestones: ": "显示里程碑：",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    " ": "",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    "\n": "",
    "If you can see this message, that means the game has detected inconsistent version number between files.": "如果您看到此消息，则表明游戏检测到文件之间的版本号不一致。",
    "Please try again later, or if this screen has been up for more than 30 minutes, please contact the mod author.": "请稍后再试，或者如果该屏幕显示超过30分钟，请与mod作者联系。",
    "This can be caused by the website currently being updated and not ready yet or there is an error causing the files to be read incorrectly.": "这可能是由于当前正在更新的网站尚未准备就绪引起的，或者是由于错误导致文件读取不正确。",
    "If you can see this something bad must've happened!": "如果您看到此错误，则必定发生了坏事！",
    "Massive Slowdown": "大规模减速",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^x?\d+(\.\d+)?[A-Za-z%]{0,2}(\s.C)?\s*$/, //12.34K,23.4 °C
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /^\s*$/, //纯空格
    /^\d+(\.\d+)?[A-Za-z]{0,2}.?\(?([+\-]?(\d+(\.\d+)?[A-Za-z]{0,2})?)?$/, //12.34M (+34.34K
    /^(\d+(\.\d+)?[A-Za-z]{0,2}\/s)?.?\(?([+\-]?\d+(\.\d+)?[A-Za-z]{0,2})?\/s\stot$/, //2.74M/s (112.4K/s tot
    /^\d+(\.\d+)?(e[+\-]?\d+)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?$/, //2.177e+6 (+4.01+4
    /^(\d+(\.\d+)?(e[+\-]?\d+)?\/s)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?\/s\stot$/, //2.177e+6/s (+4.01+4/s tot
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^(\d+) Royal points$/, '$1 皇家点数'],
    [/^(\d+) layers remaining$/, '$1 层剩余'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^([\d\.]+)\/sec$/, '$1\/秒'],
    [/^Next at (.+) points$/, '下一个在 $1 点'],
    [/^(.+)Try reloading the page, and if it don't help, contact the mod author!\n(.+)$/, '尝试重新加载页面，如果没有帮助，请联系mod作者!'],
    [/^which are boosting your point gain by (.+).\n(.+)Cost: (.+) Time Power$/, '从而使您的点数增加$1。\n$2成本：$3 时间力量'],
    [/^which are making all Time Multipliers (.+) cheaper.\n(.+)Req: (.+) Time Power$/, '从而使全部时间倍数便宜$1。\n$2需要：$3 时间力量'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);