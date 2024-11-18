import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

class Reg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username: '',
        gmail: '',
        password: '',
      },
      errorMessage: '', // 用于显示错误信息
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
  
    const { username, gmail, password } = this.state.formData;
  
    // 验证必填字段是否为空
    if (!username || !gmail || !password) {
      this.setState({
        errorMessage: '所有字段都是必填的', // 设置错误提示信息
      });
      return; // 阻止表单提交
    }
  
    const newUser = {
      username,
      gmail,
      password,
    };
  
    // 调用父组件传递的回调函数，添加新用户
    this.props.onAddUser(newUser)
      .then(response => {
        // 根据后端返回的 code 来判断注册是否成功
        if (response.code === '1003') {
          // 注册成功后，跳转到成功页面
          this.props.navigate('/success');
        } else {
          // 注册失败，根据返回的 msg 显示错误信息
          this.setState({
            errorMessage: response.msg || '注册失败，请稍后重试。',
          });
        }
      })
      .catch(error => {
        console.error("注册失败:", error);
        this.setState({
          errorMessage: '注册失败，请稍后重试。',
        });
      });
  
    // 清空表单
    this.setState({
      formData: {
        username: '',
        gmail: '',
        password: '',
      },
      errorMessage: '', // 清空错误信息
    });
  };
  

  render() {
    const { formData, errorMessage } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-lg-8 col-lg-offset-2">
            <h2>新增用户</h2>
            <hr />
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* 显示错误信息 */}
            <form onSubmit={this.handleSubmit} method="post" action="/reg">
              <div className="form-group">
                <label htmlFor="username">用户名</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={formData.username}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="gmail">Gmail</label>
                <input
                  type="email"
                  className="form-control"
                  id="gmail"
                  value={formData.gmail}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">密码</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={this.handleChange}
                />
              </div>
              <hr />
              <button type="submit" className="btn btn-primary btn-block">添加用户</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const RegWithNavigate = (props) => {
  const navigate = useNavigate();
  return <Reg {...props} navigate={navigate} />;
};

export default RegWithNavigate;
