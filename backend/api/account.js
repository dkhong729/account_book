const express = require('express');
const shortid = require('shortid');
const moment = require('moment');
const AccountModel = require('../models/AccountModel'); // MongoDB 模型
const jwt = require('jsonwebtoken');
const router = express.Router();

let checkLoginMiddleWare = require('../middlewares/checkTokenMiddleware')

// JWT 密钥（请将此值放在环境变量中）
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// 取得帳戶紀錄 (GET /accounts)
router.get('/accounts', checkLoginMiddleWare, async (req, res) => {
  try {
    const userId = req.user._id; // 使用从token中获取的userId
    const mongoData = await AccountModel.find({ userId }).sort({ time: -1 }).exec();

    res.json({
      code: '0000',
      msg: '讀取成功',
      data: mongoData,
    });
  } catch (err) {
    console.error('讀取失敗:', err);
    res.json({
      code: '0001',
      msg: '讀取失敗',
      data: null,
    });
  }
});

// 新增帳戶紀錄 (POST /accounts)
router.post('/accounts', checkLoginMiddleWare, async (req, res) => {
  try {
    const userId = req.user._id; // 使用从token中获取的userId
    const newAccount = {
      ...req.body,
      id: shortid.generate(),
      time: moment(req.body.time).toDate(),
      userId,
    };

    await AccountModel.create(newAccount);

    res.json({
      code: '0002',
      msg: '插入成功',
      data: newAccount,
    });
  } catch (err) {
    console.error('插入失敗:', err);
    res.json({
      code: '0003',
      msg: '插入失敗',
      data: null,
    });
  }
});

// 刪除帳戶紀錄 (DELETE /accounts/:id)
router.delete('/accounts/:id', checkLoginMiddleWare, async (req, res) => {
  const accountId = req.params.id;
  const userId = req.user._id; // 使用从token中获取的userId

  try {
    const mongoResult = await AccountModel.deleteOne({ id: accountId, userId });

    if (mongoResult.deletedCount > 0) {
      res.json({
        code: '0004',
        msg: '刪除成功',
        data: null,
      });
    } else {
      res.json({
        code: '0005',
        msg: '刪除失敗：找不到該記錄或無權限',
        data: null,
      });
    }
  } catch (err) {
    console.error('刪除失敗:', err);
    res.json({
      code: '0006',
      msg: '刪除失敗',
      data: null,
    });
  }
});

// 更新帳戶紀錄 (PATCH /account/:id)
router.patch('/account/:id', checkLoginMiddleWare, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // 使用从token中获取的userId

  try {
    const updatedAccount = await AccountModel.findOneAndUpdate(
      { id, userId },
      req.body,
      { new: true }
    );

    if (!updatedAccount) {
      return res.json({
        code: '0010',
        msg: '找不到該帳單記錄，或無權限更新',
        data: null,
      });
    }

    res.json({
      code: '0011',
      msg: '更新成功',
      data: updatedAccount,
    });
  } catch (err) {
    console.error('更新失敗:', err);
    res.json({
      code: '0012',
      msg: '更新失敗',
      data: null,
    });
  }
});

// 获取单条帐户记录 (GET /accounts/:id)
router.get('/accounts/:id', checkLoginMiddleWare, async (req, res) => {
  const accountId = req.params.id; // 从 URL 参数中获取 accountId
  const userId = req.user._id; // 使用从 token 中获取的 userId

  try {
    // 查找指定的帐户记录
    const account = await AccountModel.findOne({ id: accountId, userId });

    if (!account) {
      return res.json({
        code: '0015',
        msg: '找不到该记录，或无权限访问',
        data: null,
      });
    }

    res.json({
      code: '0000',
      msg: '读取成功',
      data: account,
    });
  } catch (err) {
    console.error('获取单条记录失败:', err);
    res.json({
      code: '0016',
      msg: '获取单条记录失败',
      data: null,
    });
  }
});


module.exports = router;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEiLCJnbWFpbCI6IjFAZ21haWwuY29tIiwiY3JlYXRlZF9hdCI6IjIwMjQtMTEtMTNUMDk6NDg6NDQuNjkyWiIsImlhdCI6MTczMTgyOTM1NSwiZXhwIjoxNzMxOTE1NzU1fQ.9gAlX7ReikUjWK_4mz3MaK1Eyxw59dl6_YVP6xnIK1o

