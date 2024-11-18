module.exports = (req, res, next) => {
    if (!req.session.username) {
      // 若未登入，重定向到登入頁面
      return res.redirect('/web/login');
    }
    // 已登入，繼續處理下一個中間件或路由
    next();
  };