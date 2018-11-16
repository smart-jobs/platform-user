module.exports = {
  "import": {
    "parameters": {
      "query": ["!year", "!type"],
    },
    "requestBody": [
      "ksh", // 考生号
      "!sfzh", // 身份证号
      "!xm", // 姓名
      "!xb", // 性别
      "xbdm", // 性别代码
      "!mz", // 民族
      "mzdm", // 民族代码
      "zzmmdm", // 政治面貌代码
      "zzmm", // 政治面貌代码
      "!yxdm", // 院校代码
      "!yxmc", // 院校名称
      "zydm", // 专业代码
      "zymc", // 专业名称
      "xldm", // 学历代码
      "xl", // 学历
      "syszddm", // 生源所在地代码
      "syszd", // 生源所在地
      "pyfsdm", // 培养方式代码
      "pyfs", // 培养方式
      "byrq", // 毕业日期
      "rxsj", // 入学时间
      "rxfsdm", // 入学方式代码
      "rxfs", // 入学方式
      "dxwpdw", // 定向委培单位
      "zylb", // 专业类别
      "sfslbdm", //	师范生类别代码
      "sfslb", //	师范生类别
      "knslbdm", //	困难生类别代码
      "knslb", //	困难生类别
      "cxsy", //	城乡生源
      "szyx", // 所在院系
      "szbj", // 所在班级
      "xh", // 学号
      "bz", // 备注
    ]
  },
  "findBySfzh": {
    "parameters": {
      "query": ["!year", "!sfzh"],
    },
    "service": "fetch",
  },
};
