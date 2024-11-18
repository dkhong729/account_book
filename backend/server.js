require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/db'); // 匯入 MongoDB 連線文件
const accountRouter = require('./api/account'); // 匯入帳戶路由
const authRouter = require('./web/auth')
const authApiRouter = require('./api/login')
const session = require("express-session")
const MongoStore = require('connect-mongo')
const {DBHOST, DBPORT, DENAME} = require("./config/config")
const app = express();

// 中間件
app.use(cors({ origin: 'http://localhost:3000' ,
  credentials:true,
}));
app.use(bodyParser.json());

app.use(session({
  name: 'sid',
  secret: 'atguigu',
  saveUninitialized: false,
  resave: false, // 設定為 false，以避免不必要的 session 儲存
  store: MongoStore.create({
    mongoUrl: `mongodb://${DBHOST}:${DBPORT}/${DENAME}`,
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 天的有效期
  },
}));


// 使用帳戶路由
app.use('/api', accountRouter);
app.use('/web', authRouter)
app.use('/api',authApiRouter)
// 連接 MongoDB
connectDB(() => console.log('MongoDB 連接成功！'));

// 啟動伺服器
const PORT = 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error('伺服器啟動失敗', err);
  } else {
    console.log(`服務器運行在 http://localhost:${PORT}`);
  }
});
