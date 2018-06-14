import React, { Component } from 'react';
import { withRouter as WithRouter, Link } from 'react-router-dom';
import { Breadcrumb, Button, Select, Table } from 'element-react';
import Request from '@/common/request';

import './dash-folder.scss';

class DashFolder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchLoading: false,

      dataList: {},
      folder: {},
      dataKeyList: [],

      dataKeySelect: '',
      showColumns: [],
      showList: [],
    }
  }

  componentDidMount() {
    this.fetchList();
  }

  async fetchList(value) {
    if (this.state.fetchLoading) return;

    this.setState({
      fetchLoading: true,
    });

    let dataList = {};
    let folder = {};
    let dataKeyList = [];
    let dataKeySelect = value;

    try {
      const data = await Request('/inner/dashboard/dataList', {
        _id: this.props.match.params.id,
        dataKeySelect: dataKeySelect || '',
      });
      dataList = data.dataList;
      folder = data.folder;
      dataKeyList = data.dataFileList;
    } catch (err) {
      console.log(err);
      this.setState({
        fetchLoading: false,
      });
      return;
    }

    if (!dataKeySelect) dataKeySelect = dataKeyList[0] || '';

    const showColumns = folder.showColumns
      .split('|').map((columns, cIndex) => {
        const columnInfo = columns.split('-');
        if (!cIndex) {
          return {
            type: 'expand',
            expandPannel: data => {
              return (
                <div className="expand-wrap">
                  <div>{columnInfo[0]}: </div>
                  <div dangerouslySetInnerHTML={{ __html: data.input}} />
                </div>
              )
            },
          };
        }

        const columnObject = {
          label: columnInfo[0],
          prop: `${cIndex}`,
        };

        if (columnInfo[1]) columnObject.width = Number(columnInfo[1]);

        return columnObject;
      });
    const showList = dataList;

    this.setState({
      fetchLoading: false,
      dataList,
      folder,
      dataKeyList,
      dataKeySelect,
      showColumns,
      showList,
    });
  }

  onDataSelectChange(value) {
    if (!value) return;

    this.fetchList(value);
  }

  render() {
    return (
      <div className="inner dash-folder">
        <div className="breadcrumb">
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <Link to="/inner/dashboard">主控面板</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {this.state.folder.projectName}
              {` - `}
              {this.state.folder.folderName}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="top-btns-bar">
          <Button
            loading={this.state.fetchLoading}
            type="primary"
            size="small"
            onClick={this.fetchList.bind(this)}
          >刷新</Button>

          <Select
            value={this.state.dataKeySelect}
            onChange={this.onDataSelectChange.bind(this)}
          >
            {
              this.state.dataKeyList.map(el => {
                return (
                  <Select.Option
                    key={el}
                    label={el}
                    value={el} />
                );
              })
            }
          </Select>
        </div>

        <Table
          columns={this.state.showColumns}
          data={this.state.showList}
          border={true} />
      </div>
    )
  }

}

export default WithRouter(DashFolder);
