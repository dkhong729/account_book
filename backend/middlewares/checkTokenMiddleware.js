const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;  // 從環境變量中獲取密鑰

module.exports = (req, res, next) => {
    const token = req.get('Authorization')?.split(' ')[1];

    if (!token) {
        return res.json({
            code: '2005',
            msg: 'token缺失',
            data: null,
        });
    }

    console.log('Received Token:', token);  // 打印 token 以便檢查

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded);  // 打印解碼結果
        req.user = decoded;  // 保存解碼後的用戶資料
        next();
    } catch (err) {
        console.error('Token验证失败:', err);
        res.json({
            code: '2006',
            msg: '无效的token',
            data: null,
        });
    }
};
