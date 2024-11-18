import React, { Component } from 'react';

class Success extends Component {
  goToAccount = () => {
    // 检查 navigate 是否存在
    if (this.props.navigate) {
      this.props.navigate('/account'); // 使用传入的 navigate 进行导航
    } else {
      console.error("Navigate function is not available");
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-lg-8 col-lg-offset-2">
            <h2>添加成功！</h2>
            <hr />
            <button onClick={this.goToAccount} className="btn btn-success btn-block">
              回到记账本
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Success;
