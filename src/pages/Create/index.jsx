import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        item: '',
        time: '',
        type: '',
        account: '',
        remarks: '',
      },
    };
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({
      formData: { ...this.state.formData, [id]: value },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { item, time, type, account, remarks } = this.state.formData;
  
    const newAccount = {
      title: item,
      time: new Date(time),
      type: type === '收入' ? 1 : -1, // 如果是收入，設為 1；否則設為 -1
      account: parseFloat(account),
      remark: remarks,
    };
  
    // 調用父組件傳遞的回調函數，添加新賬戶記錄
    this.props.onAddAccount(newAccount);
  
    // 跳轉到成功頁面
    this.props.navigate('/success');
  
    // 清空表單
    this.setState({
      formData: {
        item: '',
        time: '',
        type: '',
        account: '',
        remarks: '',
      },
    });
  };
  
  render() {
    const { formData } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-lg-8 col-lg-offset-2">
            <h2>添加记录</h2>
            <hr />
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="item">事项</label>
                <input
                  type="text"
                  className="form-control"
                  id="item"
                  value={formData.item}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">发生时间</label>
                <input
                  type="text"
                  className="form-control"
                  id="time"
                  value={formData.time}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">类型</label>
                <select
                  className="form-control"
                  id="type"
                  value={formData.type}
                  onChange={this.handleChange}
                >
                  <option value="支出">支出</option>
                  <option value="收入">收入</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="account">金额</label>
                <input
                  type="text"
                  className="form-control"
                  id="account"
                  value={formData.account}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="remarks">备注</label>
                <textarea
                  className="form-control"
                  id="remarks"
                  value={formData.remarks}
                  onChange={this.handleChange}
                ></textarea>
              </div>
              <hr />
              <button type="submit" className="btn btn-primary btn-block">添加</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default (props) => {
  const navigate = useNavigate();
  return <Create {...props} navigate={navigate} />;
};
