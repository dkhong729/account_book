const express = require('express');
const bcrypt = require('bcrypt'); // 用于加密密码
const UserModel = require('../models/UserModel'); // 匯入 MongoDB 用户模型
const moment = require('moment'); // 用于处理日期
const jwt = require('jsonwebtoken'); // 用于生成和验证 JWT
const router = express.Router();

// JWT 密钥（应存放在环境变量中）
const JWT_SECRET = process.env.JWT_SECRET;

// 登录操作
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with:', req.body); // 打印前端传来的数据
  console.log('JWT_SECRET:', JWT_SECRET);

  if (!username || !password) {
    return res.json({
      code: '2001',
      msg: '用户名和密码不能为空',
      data: null,
    });
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.json({
        code: '2002',
        msg: '用户名不存在',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        code: '2003',
        msg: '密码错误',
        data: null,
      });
    }

    // 生成 JWT
    const token = jwt.sign(
      {
        username: user.username,
        gmail: user.gmail,
        //created_at: user.created_at,
      },
      JWT_SECRET, // 密钥
      { expiresIn: 60 * 60 * 24 } // 1天后过期
    );

    res.json({
      code: '2004',
      msg: '登陆成功',
      data: token, // 返回生成的token
    });
  } catch (err) {
    console.error('登录失败:', err.message);
    res.json({
      code: '2005',
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
