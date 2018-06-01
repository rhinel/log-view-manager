import React, { Component } from 'react';
import { withRouter as WithRouter } from 'react-router-dom';
import { Card, Form, Input, Button, Message } from 'element-react';
import Md5 from 'md5';
import Qs from 'query-string';
import C from '@/common/config';
import Request from '@/common/request';
import PackageConfig from '@/../package.json';

import './login.scss';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      version: PackageConfig.version,
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

  componentDidMount() {
    localStorage.removeItem(`${C.Storage}token`);
  }

  async onSubmit(e) {
    e.preventDefault();

    if (this.state.logininfo.loading) return;

    try {
      await new Promise((resolve, reject) => {
        this.refs.logininfo.validate(
          result => result
            ? resolve()
            : reject()
          );
      });
    } catch (err) {
      console.log(err);
      return;
    }

    this.setState({
        logininfo: Object.assign(
        {},
        this.state.logininfo,
        { loading: true },
      ),
    });

    let token = '';
    try {
      token = await Request('/outer/log/login', {
        name: this.state.logininfo.name,
        pwd: Md5(this.state.logininfo.pwd),
      });
    } catch (err) {
      console.log(err);
      this.setState({
        logininfo: Object.assign(
          {},
          this.state.logininfo,
          { loading: false },
        ),
      });
      return;
    }

    localStorage.setItem(
      `${C.Storage}token`,
      token,
    )

    Message({
      type: 'success',
      message: '登陆成功',
      duration: 2000,
    });

    const search = Qs.parse(this.props.location.search);
    if (search.backurl) {
      this.props.history
        .push(search.backurl);
    } else {
      this.props.history
        .push('/inner');
    }
  }

  onChange(key, value) {
    this.setState({
      logininfo: Object.assign(
        {},
        this.state.logininfo,
        { [key]: value },
      )
    });
  }

  render() {
    return (
      <div className="login-wrap">
        <Card className="login-card">
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
    );
  }
}

export default WithRouter(Login);
