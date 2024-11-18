import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        formData: { username: '', password: '' },
        errorMessage: '',
    };
  }

  handleNavigateToRegister = () => {
    this.props.navigate('/reg');
  };  

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({
        formData: { ...this.state.formData, [id]: value },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state.formData;

    if (!username || !password) {
        this.setState({ errorMessage: '所有字段都是必填的' });
        return;
    }

    try {
      // 從 onLogin 方法中取得登入結果
      const success = await this.props.onLogin({ username, password });
      
      if (success) {
          const response = await fetch('/web/check-login', {
            method: 'GET',
            credentials: 'include', // 確保請求包含 cookie 資訊
          });
          const result = await response.json();

          if (result.code === '1012') {
            // 用戶已登入，跳轉到 success 頁面
            this.props.navigate('/success');
          }
      } else {
          this.setState({ errorMessage: '登入失敗，請檢查用戶名和密碼' });
      }
      } catch (error) {
          console.error('登录请求失败:', error);
          this.setState({ errorMessage: '登录过程发生错误，请稍后再试' });
      }

    this.setState({ formData: { username: '', password: '' } });
  };


  render() {
    const { formData, errorMessage } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-lg-8 col-lg-offset-2">
            <h2>Login</h2>
            <hr />
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={formData.username}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={this.handleChange}
                />
              </div>
              <hr />
              <button type="submit" className="btn btn-primary btn-block">Login</button>
            </form>
            <hr />
            <button onClick={this.handleNavigateToRegister} className="btn btn-secondary btn-block">
              未註冊？點擊此處註冊
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const LoginWithNavigate = (props) => {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
};

export default LoginWithNavigate;

