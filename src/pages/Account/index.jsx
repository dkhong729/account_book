import React, { Component } from 'react';
import './index.css'; // 自訂的 CSS

export default class Account extends Component {

  // 刪除帳目項目
  handleDelete = (index) => {
    this.props.onDeleteAccount(index);
  };

  render() {
    const { accounts } = this.props;

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-lg-8 col-lg-offset-2">
            <h2>記帳本</h2>
            <hr />
            <div className="accounts">
              {accounts.map((account, index) => (
                <div
                  className={`panel panel-${account.type === 1 ? 'success' : 'danger'}`}
                  key={index}
                >
                  {/* 使用 toLocaleDateString 顯示日期 */}
                  <div className="panel-heading">{new Date(account.time).toLocaleDateString()}</div>
                  <div className="panel-body">
                    <div className="col-xs-6">{account.title}</div>
                    <div className="col-xs-2 text-center">
                      <span className={`label label-${account.type === 1 ? 'success' : 'warning'}`}>
                        {account.type === 1 ? '收入' : '支出'}
                      </span>
                    </div>
                    <div className="col-xs-2 text-right">{account.account}</div>
                    <div className="col-xs-2 text-right">
                      <span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={() => this.handleDelete(index)}></span>
                    </div>
                  </div>
                  {/* 顯示備註 */}
                  {account.remark && (
                    <div className="panel-footer">
                      <small>備註: {account.remark}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
