const express = require('express');
const bcrypt = require('bcrypt'); // 用于加密密码
const UserModel = require('../models/UserModel'); // 匯入 MongoDB 用户模型
const moment = require('moment'); // 用于处理日期

const router = express.Router();

// 注册新用户
router.post('/reg', async (req, res) => {
  try {
    const { username, gmail, password } = req.body;
    console.log(req.body);  // 确保请求的 body 有正确的数据

    // 检查必填字段
    if (!username || !gmail || !password) {
      return res.json({
        code: '1001',
        msg: '所有字段都是必填的',
        data: null,
      });
    }

    // 检查用户名或 Gmail 是否已被使用
    const existingUser = await UserModel.findOne({ $or: [{ username }, { gmail }] });
    if (existingUser) {
      return res.json({
        code: '1002',
        msg: '用户名或 Gmail 已被使用',
        data: null,
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户对象
    const newUser = new UserModel({
      username,
      gmail,
      password: hashedPassword, // 保存加密后的密码
      created_at: moment().toDate(), // 添加创建时间
    });

    // 保存到数据库
    await newUser.save();

    // 返回成功的响应格式
    res.json({
      code: '1003',
      msg: '注册成功',
      data: {
        username: newUser.username,
        gmail: newUser.gmail,
        created_at: newUser.created_at,
      },
    });
  } catch (err) {
    console.error('注册失败:', err.message);

    // 返回错误的响应格式
    res.json({
      code: '1004',
      msg: '注册失败',
      data: null,
    });
  }
});

// 登陆页
router.get('/login', (req, res) => {
  res.json({ msg: 'Please provide login details via POST' });
});

// 登入操作
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with:', req.body); // 打印前端传来的数据

  if (!username || !password) {
    return res.json({
      code: '1005',
      msg: '用户名和密码不能为空',
      data: null,
    });
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.json({
        code: '1006',
        msg: '用户名不存在',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        code: '1007',
        msg: '密码错误',
        data: null,
      });
    }

    // 保存用户信息至 session
    req.session.username = user.username;
    req.session._id = user._id;

    res.json({
      code: '1008',
      msg: '登陆成功',
      data: {
        username: user.username,
        gmail: user.gmail,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('登录失败:', err.message);
    res.json({
      code: '1009',
      msg: '登录失败，系统错误',
      data: null,
    });
  }
});

// 登出操作
router.post('/logout', (req, res) => {
  console.log('登出請求接收到的資料:', req.body); 
  req.session.destroy((err) => {
    if (err) {
      return res.json({
        code: '1010',
        msg: '登出失敗',
        data: null,
      });
    }

    // 清除指定的 Cookie 名称
    res.clearCookie(req.session.cookie.name || 'sid');
    res.json({
      code: '1011',
      msg: '登出成功',
      data: null,
    });
  });
});

// 检查登录状态
router.get('/check-login', (req, res) => {
  if (req.session.username) {
    // 如果用户已经登录，返回用户信息
    res.json({
      code: '1012',
      msg: '已登录',
      data: {
        username: req.session.username,
      },
    });
  } else {
    // 如果用户没有登录，返回未登录状态
    res.json({
      code: '1013',
      msg: '未登录',
      data: null,
    });
  }
});

module.exports = router;
