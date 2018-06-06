import React, { Component } from 'react';
import { Breadcrumb, Button, Dialog, Form, Input, Table, Message, Popover } from 'element-react';
// import Qs from 'query-string';
import Request from '@/common/request';

import './dashboard.scss';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addDialog: false,

      fetchLoading: false,
      addLoading: false,
      delLoading: '',
      popovering: '',

      root: '/',

      folderColumns: [
        {
          type: 'expand',
          expandPannel: data => {
            return (
              data.regexps.map((regexp, index) => {
                return (
                  <div
                    key={regexp.key}
                  >{index}: {regexp.value}</div>
                )
              })
            )
          },
        },
        { label: '模块名称', prop: 'projectName' },
        { label: '目录名称', prop: 'folderName' },
        { label: '目录地址', prop: 'address' },
        {
          label: '操作',
          render: data => {
            return (
              <span
                key={data._id}>
                <Button
                  plain={true}
                  type="info"
                  size="small"
                  onClick={this.openDialog.bind(this, data)}
                >编辑</Button>

                <Popover
                  key={data._id}
                  placement="top"
                  width="160"
                  trigger="hover"
                  visible={this.state.popovering === data._id}
                  content={(
                    <div>
                      <p>确定删除吗？</p>
                      <div
                        className="pop-in-btn">
                        <Button
                          size="mini"
                          type="text"
                          onClick={this.closePopover.bind(this)}
                        >取消</Button>
                        <Button
                          type="danger"
                          size="mini"
                          onClick={this.folderDel.bind(this, data._id)}
                        >确定</Button>
                      </div>
                    </div>
                  )}
                >
                  <Button
                    loading={this.delLoading === data._id}
                    className="pop-out-btn"
                    type="danger"
                    size="small"
                    onClick={this.openPopover.bind(this, data._id)}
                  >删除</Button>
                </Popover>
              </span>
            )
          },
        },
      ],
      folderList: [],

      addinfo: {
        projectName: '',
        folderName: '',
        address: '',
        regexps: [{
          key: Date.now(),
          value: '',
        }],
      },
      addinfoReset: {},
      addregexp: {
        key: '',
        value: '',
      },
      addrules: {
        projectName: [
          { required: true, message: '请填写', trigger: 'blur change' },
        ],
        folderName: [
          { required: true, message: '请填写', trigger: 'blur change' },
        ],
      },
    };
  }

  componentDidMount() {
    this.fetchList();
    const addinfoReset = JSON.parse(JSON.stringify(this.state.addinfo));
    this.setState({
      addinfoReset,
    });
  }

  async fetchList() {
    if (this.state.fetchLoading) return;

    this.setState({
      fetchLoading: true,
    });

    let folderList = [];
    try {
      folderList = await Request('/inner/dashboard/folderList');
    } catch (err) {
      console.log(err);
      this.setState({
        fetchLoading: false,
      });
      return;
    }

    this.setState({
      fetchLoading: false,
      folderList,
    });
  }

  openDialog(data, e) {
    e.preventDefault();

    const openData = {
      addDialog: true,
    }

    if (data) openData.addinfo = JSON.parse(JSON.stringify(data));
    this.setState(openData);
  }

  closeDialog(e) {
    if (e) e.preventDefault();

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
      key: Date.now(),
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

  closePopover(e) {
    if (e) e.preventDefault();

    this.setState({
      popovering: '',
    });
  }

  openPopover(id, e) {
    e.preventDefault();

    this.setState({
      popovering: id,
    });
  }

  async folderUpdate(e) {
    e.preventDefault();

    if (this.state.addLoading) return;

    try {
      await new Promise((resolve, reject) => {
        this.refs.addinfo.validate(
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
      addLoading: true,
    });

    let postData = JSON.parse(JSON.stringify(this.state.addinfo));
    try {
      await Request('/inner/dashboard/folderAdd', postData);
    } catch (err) {
      console.log(err);
      this.setState({
        addLoading: false,
      });
      return;
    }

    this.setState({
      addLoading: false,
    });

    this.closeDialog();
    this.fetchList();
  }

  async folderDel(id, e) {
    e.preventDefault();

    this.closePopover();

    if (!id) {
      Message({
        type: 'warning',
        message: '请选择要删除的数据',
        duration: 2000,
      });
      return;
    }

    if (this.state.delLoading === id) return;

    this.setState({
      delLoading: id,
    });

    try {
      await Request('/inner/dashboard/folderDel', {
        _id: id,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        delLoading: '',
      });
      return;
    }

    this.setState({
      delLoading: '',
    });

    this.fetchList();
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
            loading={this.state.fetchLoading}
            type="primary"
            size="small"
            onClick={this.fetchList.bind(this)}
          >刷新</Button>

          <Button
            type="primary"
            size="small"
            onClick={this.openDialog.bind(this, '')}
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
                prop="projectName">
                <Input
                  value={this.state.addinfo.projectName}
                  onChange={this.onSettingChange.bind(this, 'projectName')} />
              </Form.Item>

              <Form.Item
                label="目录名称"
                prop="folderName">
                <Input
                  value={this.state.addinfo.folderName}
                  onChange={this.onSettingChange.bind(this, 'folderName')} />
              </Form.Item>

              <Form.Item
                label="目录地址"
                prop="address">
                <Input
                  value={this.state.addinfo.address}
                  onChange={this.onSettingChange.bind(this, 'address')} />
              </Form.Item>

              {
                this.state.addinfo.regexps.map((regexp, index) => {
                  return (
                    <Form.Item
                      key={regexp.key}
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

                      {index > 0 &&
                        <Button
                          type="danger"
                          onClick={this.removeRegexp.bind(this, regexp)}
                        >删除</Button>
                      }
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
              loading={this.state.addLoading}
              onClick={this.closeDialog.bind(this)}
            >取消</Button>

            <Button
              loading={this.state.addLoading}
              type="primary"
              onClick={this.folderUpdate.bind(this)}
            >确定</Button>

          </Dialog.Footer>
        </Dialog>

        <Table
          columns={this.state.folderColumns}
          data={this.state.folderList}
          border={true} />
      </div>
    )
  }

}

export default Dashboard;
