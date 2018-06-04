import React, { Component } from 'react';
import { Breadcrumb, Button, Dialog, Form, Input } from 'element-react';

import './dashboard.scss';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addDialog: false,

      root: '/server-node/data-json/',

      folderList: [],

      addinfo: {
        project: '',
        folderName: '',
        address: '',
        regexps: [],
      },
      addinfoReset: {},
      addregexp: {
        key: '',
        value: ''
      },
      addrules: {
        project: [
          { required: true, message: '请填写', trigger: 'blur change' },
        ],
        folderName: [
          { required: true, message: '请填写', trigger: 'blur change' },
        ],
      },
    };
  }

  componentDidMount() {
    const addinfoReset = JSON.parse(JSON.stringify(this.state.addinfo));
    this.setState({
      addinfoReset,
    });
  }

  openDialog() {
    this.setState({
      addDialog: true,
    });
  }

  closeDialog() {
    this.refs.addinfo.resetFields();
    const addinfo = JSON.parse(JSON.stringify(this.state.addinfoReset));

    this.setState({
      addDialog: false,
      addinfo,
    });
  }

  onSettingChange(key, value) {
    this.setState({
      addinfo: Object.assign(
        {},
        this.state.addinfo,
        { [key]: value },
      )
    });
  }

  addRegexp(e) {
    e.preventDefault();

    this.state.addinfo.regexps.push({
      key: this.state.addinfo.regexps.length,
      value: '',
    });
    this.forceUpdate();
  }

  onRegexpChange(index, value) {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.addinfo.regexps[index].value = value;
    this.forceUpdate();
  }

  removeRegexp(item, e) {
    e.preventDefault();

    var index = this.state.addinfo.regexps.indexOf(item);
    if (index !== -1) {
      this.state.addinfo.regexps.splice(index, 1);
      this.forceUpdate();
    }
  }

  async onSubmit(e) {
    e.preventDefault();

    this.closeDialog();
  }

  render() {
    return (
      <div className="inner dashboard">
        <div className="breadcrumb">
          <Breadcrumb separator="/">
            <Breadcrumb.Item>主控面板</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="top-btns-bar">
          <Button
            type="primary"
            size="small"
            onClick={this.openDialog.bind(this)}
          >新增日志目录</Button>
        </div>

        <Dialog
          title="新增日志目录"
          size="small"
          customClass="add-dialog"
          visible={this.state.addDialog}
          closeOnClickModal={false}
          lockScroll={false}
          onCancel={this.closeDialog.bind(this)}>
          <Dialog.Body>

            <Form
              ref="addinfo"
              labelWidth="100"
              model={this.state.addinfo}
              rules={this.state.addrules}>

              <Form.Item
                label="模块名称"
                prop="project">
                <Input
                  value={this.state.addinfo.project}
                  onChange={this.onSettingChange.bind(this, 'project')} />
              </Form.Item>

              <Form.Item
                label="目录名称"
                prop="folderName">
                <Input
                  value={this.state.addinfo.folderName}
                  onChange={this.onSettingChange.bind(this, 'folderName')} />
              </Form.Item>

              {
                this.state.addinfo.regexps.map((regexp, index) => {
                  return (
                    <Form.Item
                      key={index}
                      label={`正则${index}`}
                      prop={`regexps:${index}`}
                      rules={{
                        type: 'object',
                        required: true,
                        fields: {
                          value: {
                            required: true,
                            message: '请填写',
                            trigger: 'blur change'
                          }
                        }
                      }}
                    >
                      <Input
                        value={regexp.value}
                        type="textarea"
                        autosize={true}
                        onChange={this.onRegexpChange.bind(this, index)} />
                      <Button
                        type="danger"
                        onClick={this.removeRegexp.bind(this, regexp)}
                      >删除</Button>
                    </Form.Item>
                  )
                })
              }

              <Form.Item>
                <Button
                  type="primary"
                  onClick={this.addRegexp.bind(this)}
                >新增正则</Button>
              </Form.Item>

            </Form>

          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">

            <Button
              onClick={this.closeDialog.bind(this)}
            >取消</Button>
            <Button
              type="primary"
              onClick={this.onSubmit.bind(this)}
            >确定</Button>

          </Dialog.Footer>
        </Dialog>
      </div>
    )
  }

}

export default Dashboard;
