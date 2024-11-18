import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Success from './pages/Success';
import Account from './pages/Account';
import Create from './pages/Create';
import Reg from './pages/Reg';
import Login from './pages/Login';

// 設置 axios 攔截器，自動攜帶 token 並處理錯誤
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        console.log('Sending Token:', token);  // 打印 Token 以便檢查
        config.headers['Authorization'] = `Bearer ${token}`;
    } else {
        console.error('Token is missing or invalid');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('登录状态已过期，请重新登录');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 为 Success 组件创建包装器以使用 navigate
function SuccessWithNavigate() {
    const navigate = useNavigate();
    return <Success navigate={navigate} />;
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            users: [],
            currentUser: null,
        };
    }

    componentDidMount() {
        // 获取账户数据
        axios.get('/api/accounts')
            .then(response => {
                console.log('獲取用戶數據返回',response.data);
                this.setState({ accounts: response.data.data || [] });
            })
            .catch(error => console.error(error));

        // 检查当前用户是否已登录
        axios.get('/web/check-login')
            .then(response => {
                if (response.data.code === '1012') {
                    this.setState({ currentUser: response.data.data.username });
                }
            })
            .catch(error => console.error('检查登录状态失败:', error));
    }

    handleAddAccount = (newAccount) => {
        axios.post('/api/accounts', newAccount)
            .then(response => {
                this.setState((prevState) => ({
                    accounts: [...prevState.accounts, response.data]
                }));
            })
            .catch(error => console.error(error));
    };

    handleDeleteAccount = (index) => {
        const accountToDelete = this.state.accounts[index];
        axios.delete(`/api/accounts/${accountToDelete.id}`)
            .then(() => {
                this.setState((prevState) => {
                    const updatedAccounts = [...prevState.accounts];
                    updatedAccounts.splice(index, 1);
                    return { accounts: updatedAccounts };
                });
            })
            .catch(error => console.error(error));
    };

    handleAddUser = (newUser) => {
        return axios.post('/web/reg', newUser)
            .then(response => {
                const { code, msg, data } = response.data;
                console.log('加用戶返回',response.data);
                if (code === '1003') {
                    alert(msg);
                    this.setState((prevState) => ({
                        users: [...prevState.users, data]
                    }));
                    return response.data;
                } else {
                    alert(msg);
                    throw new Error(msg);
                }
            })
            .catch(error => {
                console.error('注册失败:', error);
                alert('注册失败，请稍后重试');
                throw error;
            });
    };

    handleLogin = async (loginData) => {
        try {
            localStorage.removeItem('token');
            this.setState({ currentUser: null });
            const response = await axios.post('/web/login', loginData);
            console.log('登入返回',response.data);
            if (response.data.code === '1008') {
                const token = response.data.data.token;
                localStorage.setItem('token', token);
                this.setState({ currentUser: response.data.data.username });
                return true;
            } else {
                console.error("登录失败:", response.data.msg);
                return false;
            }
        } catch (error) {
            console.error("登录错误:", error);
            return false;
        }
    };

    handleLogout = () => {
        axios.post('/web/logout')
            .then(response => {
                console.log('登出返回',response.data);
                if (response.data.code === '1011') {
                    localStorage.removeItem('token');
                    this.setState({ currentUser: null });
                    alert('已成功登出');
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('登出请求失败:', error);
                alert('登出请求失败，请稍后再试');
            });
    };

    render() {
        return (
            <Router>
                <div>
                    <nav>
                        <NavLink to="/account">
                            <button>查看記帳本</button>
                        </NavLink>
                        <NavLink to="/create">
                            <button>创建帳單</button>
                        </NavLink>
                        {this.state.currentUser ? (
                            <div>
                                <span>欢迎, {this.state.currentUser}!</span>
                                <button onClick={this.handleLogout}>登出</button>
                            </div>
                        ) : (
                            <NavLink to="/login">
                                <button>登录</button>
                            </NavLink>
                        )}
                    </nav>

                    <Routes>
                        <Route path="/account" element={<Account accounts={this.state.accounts} onDeleteAccount={this.handleDeleteAccount} />} />
                        <Route path="/create" element={<Create onAddAccount={this.handleAddAccount} />} />
                        <Route path="/reg" element={<Reg onAddUser={this.handleAddUser} />} />
                        <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
                        <Route path="/success" element={<SuccessWithNavigate />} />
                    </Routes>
                </div>
            </Router>
        );
    }
}
