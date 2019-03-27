'use strict';

/**
 * 导入学籍(DBF格式)
 */
const _ = require('lodash');
const assert = require('assert');
const XLSX = require('xlsx');
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
// Connection URL
// const url = 'mongodb://root:Ziyouyanfa%23%40!@localhost:27017';
// const url = 'mongodb://root:Ziyouyanfa%23%40!@192.168.18.100:27018';
const url = 'mongodb://root:Ziyouyanfa%23%40!@192.168.1.170:27018';

// Database Name
const dbName = 'platform';

const FieldMap = { CX: 'cxsy', ZY: 'zymc', };

function log(message) {
  console.log(`【${moment().format('hh:mm:ss')}】${message}`);
}

function mapType(xldm = '31') {
  const flag = xldm.substr(0, 1);
  if (flag === '0' || flag === '1') {
    return '1'; // 研究生
  }
  if (flag === '5') {
    return '2'; // 中专
  }
  return '0'; // 本专科
}
const dict = {};
async function mapCode(category, code) {
  assert(category, 'category不能为空');
  assert(code, 'code不能为空');

  if (!dict[category]) {
    // TODO: 加载字典数据
    const res = await axios.get(`http://smart.jilinjobswx.cn/www/api/naf/code/${category}/list?level=3`);
    if (res.status !== 200) {
      console.error(`${res.status} ${res.message}`);
      console.debug(res.data);
      throw new Error(`网络错误:${res.status}`);
    }
    const { errcode, errmsg, data } = res.data;
    if (errcode !== 0) {
      throw new Error(`接口错误: ${errcode} - ${errmsg}`);
    }
    dict[category] = data.reduce((acc, item) => {
      acc[item.code] = item.name;
      if (_.isArray(item.children) && item.children.length > 0) {
        _.forEach(item.children, p => {
          acc[p.code] = p.name;
        });
      }
      return acc;
    }, {});
  }
  return dict[category][code] || code;
}

async function doWork() {
  const args = process.argv.splice(2);
  if (args.length !== 1) {
    console.log('请指定要导入的文件名:\n node import\dbf.js xxxx.dbf');
    return;
  }

  // TODO: 预加载字典数据
  log('正在加载字典数据...');
  await mapCode('xb', '0');
  await mapCode('mz', '0');
  await mapCode('zzmm', '0');
  await mapCode('pyfs', '0');
  await mapCode('xl', '0');
  await mapCode('xzqh', '0');

  log(`正在读取${args[0]}数据...`);
  const workbook = XLSX.readFile(args[0]);
  const ws = workbook.Sheets.Sheet1;
  const rs = XLSX.utils.sheet_to_json(ws);
  log(`共读取数据${rs.length}条!`);
  log('正在保存数据...');
  // Use connect method to connect to the Server
  const client = await MongoClient.connect(url, { poolSize: 10, useNewUrlParser: true });
  const db = client.db(dbName).collection('plat_user_infobase');
  let count = 0;
  let buf = [];
  const date = new Date();
  const meta = { state: 0, createdAt: date, updatedAt: date };
  for (let i = 0; i < rs.length; i++) {
    const item = rs[i];
    let data = {};
    for (const key in item) {
      const newKey = FieldMap[key] || key.toLowerCase();
      data[newKey] = item[key];
    }
    // TODO: 字典转换 xb, mz, syszd, xl, zzmm, pyfs
    try {
      const year = data.bysj.substr(0, 4);
      const type = mapType(data.xldm);
      data.xb = await mapCode('xb', data.xbdm || '0');
      data.mz = await mapCode('mz', data.mzdm || '0');
      data.zzmm = await mapCode('zzmm', data.zzmmdm || '0');
      data.pyfs = await mapCode('pyfs', data.pyfsdm || '0');
      data.xl = await mapCode('xl', data.xldm || '0');
      data.syszd = await mapCode('xzqh', data.syszddm || '0');
      data = { year, type, ...data, meta };
      // const { year, yxdm, sfzh } = data;
      // const entity = await db.findOne({ year, type, yxdm, sfzh });
      // if (!entity) {
      //   await db.insertOne(data);
      //   count++;
      // } else {
      //   await db.updateOne({ _id: entity._id }, { $set: data });
      //   log(`update: ${data.xm}`);
      // }
      buf.push(data);
      if ((++count) % 1000 === 0) {
        await db.insertMany(buf);
        log(`成功处理 ${count}条...`);
        buf = [];
      }
    } catch (err) {
      log(`处理错误： ${data.xm}`);
      console.error(err);
    }
  }
  // TODO: 处理剩余数据
  if (buf.length > 0) {
    await db.insertMany(buf);
    buf = [];
    log(`成功处理 ${count}条...`);
  }
  if (client) {
    client.close();
  }
  log(`导入完成，共导入${count}条数据！`);
}

doWork();

