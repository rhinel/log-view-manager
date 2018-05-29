import React, { Component } from 'react';
import { Card, Form, Input, Button } from 'element-react';
// import Md5 from 'md5';
import packageConfig from '../../../package.json';

import './login.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: packageConfig.version,
      logininfo: {
        name: '',
        pwd: '',
        loading: false,
      },
      loginrules: {
        name: [
          { required: true, message: '请填写', trigger: 'blur change' },
        ],
        pwd: [
          { required: true, message: '请填写', trigger: 'blur change' },
          { min: 3, message: '太短了', trigger: 'blur' },
        ],
      },
    };
  }

  onSubmit(e) {
    e.preventDefault();

    this.refs.logininfo.validate((valid) => {
      if (valid) {
        alert('submit!');
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  onChange(key, value) {
    this.setState({
      logininfo: Object.assign({}, this.state.logininfo, { [key]: value })
    });
  }

  render() {
    return (
      <div className="page">
        <div className="main-wrap">
          <Card className="login-wrap">
            <div className="login-hello">
              Hello { this.state.logininfo.name } <i />
            </div>

            <Form
              ref="logininfo"
              model={this.state.logininfo}
              rules={this.state.loginrules}
              onSubmit={this.onSubmit.bind(this)}>
              <Form.Item prop="name">
                <Input
                  value={this.state.logininfo.name}
                  maxLength={10}
                  placeholder="Name"
                  icon="star-on"
                  onChange={this.onChange.bind(this, 'name')} />
              </Form.Item>
              <Form.Item prop="pwd">
                <Input
                  value={this.state.logininfo.pwd}
                  type="password"
                  placeholder="Pwd"
                  icon="star-on"
                  onChange={this.onChange.bind(this, 'pwd')} />
              </Form.Item>
              <Button
                loading={this.state.logininfo.loading}
                className="login-go"
                type="primary"
                nativeType="submit">
                登陆
              </Button>
            </Form>

            <div className="beian">
              <div>v{this.state.version}</div>
              <a
                href="http://www.miitbeian.gov.cn/"
                rel="noopener noreferrer"
                target="_blank">
                粤ICP备17164727号
              </a>
            </div>

          </Card>
        </div>
      </div>
    );
  }
}

export default Login;
