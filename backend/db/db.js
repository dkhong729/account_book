// db.js

module.exports = function(success, error) {
    if (typeof error !== 'function') {
      error = () => {
        console.log('連接失敗');
      };
    }
  
    const mongoose = require('mongoose');
    const { DBHOST, DBPORT, DBNAME } = require('../config/config'); // 修正變數拼寫
  
    mongoose.set('strictQuery', true);
    
    // 加入更多連接選項
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 設定連線超時時間
    });
  
    // 設置回調
    mongoose.connection.once('open', () => {
      console.log('MongoDB 連接成功');
      success();
    });
  
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB 連接失敗:', err);
      error();
    });
  
    mongoose.connection.on('close', () => {
      console.log('MongoDB 連接已關閉');
    });
  };
  