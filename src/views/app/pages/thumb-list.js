import React, { Component, Fragment } from "react";
import { Row, CustomInput, Card, Badge } from "reactstrap";
import axios from "axios";
import { ContextMenuTrigger } from "react-contextmenu";

import { servicePath } from "../../../constants/defaultValues";

import DataListView from "../../../containers/pages/DataListView";
import Pagination from "../../../containers/pages/Pagination";
import ContextMenuContainer from "../../../containers/pages/ContextMenuContainer";
import ListPageHeading from "../../../containers/pages/ListPageHeading";
import ImageListView from "../../../containers/pages/ImageListView";
import ThumbListView from "../../../containers/pages/ThumbListView";
import AddNewModal from "../../../containers/pages/AddNewModal";
import { Colxx } from "../../../components/common/CustomBootstrap";
import classnames from "classnames";
import { NotificationManager } from "../../../components/common/react-notifications";

function collect(props) {
  return { data: props.data };
}
const apiUrl = process.env.REACT_APP_API_URL + '/wfh';
// const apiUrl = 'http://localhost:5000/api/v1/wfh';

class ImageListPages extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require('mousetrap');
    this.state = {
      displayMode: "datalist",

      selectedPageSize: 10,
      orderOptions: [
        { column: "title", label: "Product Name" },
        { column: "category", label: "Category" },
        { column: "status", label: "Status" }
      ],
      pageSizes: [10, 20, 24],

      categories: [],

      selectedOrderOption: { column: "title", label: "Product Name" },
      dropdownSplitOpen: false,
      modalOpen: false,
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: "",
      selectedItems: [],
      lastChecked: null,
      isLoading: false,

      empId: "",
      email: "",
      empName: "",
      startDateRange: null,
      endDateRange: null,
      photo1: "",
      photo2: "",
      buttonLoader: false,
      selectedValue: ""
    };
  }

  componentDidMount() {
    this.dataListRender();
    this.mouseTrap.bind(["ctrl+a", "command+a"], () =>
      this.handleChangeSelectAll(false)
    );
    this.mouseTrap.bind(["ctrl+d", "command+d"], () => {
      this.setState({
        selectedItems: []
      });
      return false;
    });
  }

  componentWillUnmount() {
    this.mouseTrap.unbind("ctrl+a");
    this.mouseTrap.unbind("command+a");
    this.mouseTrap.unbind("ctrl+d");
    this.mouseTrap.unbind("command+d");
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      empName: "",
      email: "",
      startDateRange: null,
      endDateRange: null
    });
  };

  changeOrderBy = column => {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        )
      },
      () => this.dataListRender()
    );
  };
  changePageSize = size => {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1
      },
      () => this.dataListRender()
    );
  };
  changeDisplayMode = mode => {
    this.setState({
      displayMode: mode
    });
    return false;
  };
  onChangePage = page => {
    this.setState(
      {
        currentPage: page
      },
      () => this.dataListRender()
    );
  };

  onSearchKey = e => {
    if (e.key === "Enter") {
      this.setState(
        {
          search: e.target.value.toLowerCase()
        },
        () => this.dataListRender()
      );
    }
  };

  onCheckItem = (event, id) => {
    if (
      event.target.tagName === "A" ||
      (event.target.parentElement && event.target.parentElement.tagName === "A")
    ) {
      return true;
    }
    if (this.state.lastChecked === null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = this.state.selectedItems;
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.setState({
      selectedItems
    });

    if (event.shiftKey) {
      var items = this.state.items;
      var start = this.getIndex(id, items, "id");
      var end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.setState({
        selectedItems
      });
    }
    document.activeElement.blur();
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }
  handleChangeSelectAll = isToggle => {
    if (this.state.selectedItems.length >= this.state.items.length) {
      if (isToggle) {
        this.setState({
          selectedItems: []
        });
      }
    } else {
      this.setState({
        selectedItems: this.state.items.map(x => x.id)
      });
    }
    document.activeElement.blur();
    return false;
  };


  dataListRender() {
    const headers = {
      'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTQ2Nzg1NDMyMiwiaWF0IjoxNTk0MTQ5MTY2LCJleHAiOjE1OTY3NDExNjZ9.dMw_rasVAoytpP9q2mz0xfcinDV5c8iiGJMAyl5sfoc"
    }
    axios
      .get(
        `${apiUrl}?search=${this.state.search}`, { headers }
      )
      .then(res => {
        console.log(res.data);
        return res.data;
      })
      .then(data => {
        this.setState({
          totalPage: data.totalPage,
          items: data.data,
          selectedItems: [],
          totalItemCount: data.totalItem,
          isLoading: true
        });
        // document.getElementById('checkAll').style.visibility = 'hidden';
      });
  }

  onContextMenuClick = (e, data, target) => {
    console.log(
      "onContextMenuClick - selected items",
      this.state.selectedItems
    );
    console.log("onContextMenuClick - action : ", data.action);
  };

  onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!this.state.selectedItems.includes(clickedProductId)) {
      this.setState({
        selectedItems: [clickedProductId]
      });
    }

    return true;
  };

  // Methods for add new WFH Records.


  fetchEmpRecord = (e) => {
    this.setState({
      buttonLoader: true
    })
    const headers = {
      'Authorization': `Bearer ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`

    };
    axios.get(`${process.env.REACT_APP_API_URL}/employee/${this.state.empId}`, { headers })
      .then(response => {
        this.setState({
          buttonLoader: false,
          empName: response.data.data.empName,
          email: response.data.data.email,
          categories: response.data.data.assetDetails
        })
        document.getElementById('empId').disabled = true;
        console.log(response.data.data.empName, this.state.empName);
      })
      .catch((err) => {
        this.setState({
          buttonLoader: false
        })
        console.log("error ", err);
        NotificationManager.error(
          "No entry found in the HRMS",
          [err.response.data.error],
          6000,
          null,
          null,
          ''
        );
      })
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeStart = date => {
    this.setState({
      startDateRange: date
    });
  };

  handleChangeEnd = date => {
    this.setState({
      endDateRange: date
    });
  };

  handleFile = (e) => {
    if (e.target.files.length === 2) {
      this.setState({
        photo1: e.target.files[0],
        photo2: e.target.files[1],
      });
    }
    return;
  }

  handleSubmit = (e) => {
    // Call WFH enable API with required data.

    const data = new FormData();
    if (this.state.photo1 != null && this.state.photo1 != "") {
      data.append('photo1', this.state.photo1);
      data.append('photo2', this.state.photo2);
    }

    if (this.state.empId && this.state.startDateRange && this.state.endDateRange && this.state.selectedValue) {
      data.set('empId', this.state.empId);
      data.set('startDate', String(this.state.startDateRange));
      data.set('endDate', String(this.state.endDateRange));
      data.set('projectId', "PRJ-4607");
      data.set('deviceName', this.state.selectedValue);
      console.log(data);
      this.setState({
        modalOpen: !this.state.modalOpen,
        isLoading: false,
        empName: "",
        email: "",
        startDateRange: {},
        endDateRange: {}
      });
  
      const options = {
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/wfh/enable`,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`
        }
      }
  
      axios(options)
        .then(response => {
          console.log(response.data);
          this.setState({
            isLoading: true,
          });
          this.dataListRender();
          NotificationManager.success(
            "WFH Record inserted Successfully",
            "Employee " + [response.data.data.empId] + " is enabled to work at home",
            6000,
            null,
            null,
            ''
          );
        })
        .catch((err) => {
          console.log(err.response);
          this.setState({
            isLoading: true,
          });
          NotificationManager.error(
            "Unable to insert WFH entry",
            [err.response.data.error],
            6000,
            null,
            null,
            ''
          );
        })
    } else {
      NotificationManager.error(
        "",
        "Please fill all the required fields",
        6000,
        null,
        null,
        ''
      );
    }

  }

  handleSelectChange = (e) => {
    this.setState({
      selectedValue: e.value
    })
  }

  handleDelete = () => {
    if (this.state.selectedItems.length == 0) {
      // No record has been selected.
      NotificationManager.warning(
        "",
        "Please select at least 1 record to proceed",
        6000,
        null,
        null,
        ''
      );
    } else {
      this.setState({
        isLoading: false
      });
      // Call delete API and delete the selected records.
      const options = {
        method: 'delete',
        url: `${process.env.REACT_APP_API_URL}/wfh`,
        data: {
          wfhList: this.state.selectedItems
        },
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`
        }
      }

      axios(options)
        .then(response => {
          console.log(response.data);
          setTimeout(() => {
            this.setState({
              isLoading: true,
            });
            this.dataListRender();
            NotificationManager.success(
              "",
              "WFH Record(s) deleted Successfully",
              6000,
              null,
              null,
              ''
            );
          }, 3000)
        })
        .catch((err) => {
          console.log(err.response);
          this.setState({
            isLoading: true,
          });
          NotificationManager.error(
            "",
            "Unable to delete WFH entry",
            6000,
            null,
            null,
            ''
          );
        })
    }
  }

  render() {
    const {
      currentPage,
      items,
      displayMode,
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      selectedItems,
      orderOptions,
      pageSizes,
      modalOpen,
      categories
    } = this.state;
    const { match } = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;

    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
        <Fragment>
          <div className="disable-text-selection">
            <ListPageHeading
              heading="menu.wfhrecords"
              displayMode={displayMode}
              changeDisplayMode={this.changeDisplayMode}
              handleChangeSelectAll={this.handleChangeSelectAll}
              changeOrderBy={this.changeOrderBy}
              changePageSize={this.changePageSize}
              selectedPageSize={selectedPageSize}
              totalItemCount={totalItemCount}
              selectedOrderOption={selectedOrderOption}
              match={match}
              startIndex={startIndex}
              endIndex={endIndex}
              selectedItemsLength={selectedItems ? selectedItems.length : 0}
              selectedItems={selectedItems}
              handleDelete={this.handleDelete}
              itemsLength={items ? items.length : 0}
              onSearchKey={this.onSearchKey}
              orderOptions={orderOptions}
              pageSizes={pageSizes}
              toggleModal={this.toggleModal}
            />
            <AddNewModal
              modalOpen={modalOpen}
              toggleModal={this.toggleModal}
              categories={categories}
              handleInputChange={this.handleInputChange}
              fetchEmpRecord={this.fetchEmpRecord}
              empName={this.state.empName}
              email={this.state.email}
              handleChangeEnd={this.handleChangeEnd}
              handleChangeStart={this.handleChangeStart}
              startDateRange={this.state.startDateRange}
              endDateRange={this.state.endDateRange}
              handleFile={this.handleFile}
              handleSubmit={this.handleSubmit}
              buttonLoader={this.state.buttonLoader}
              handleSelectChange={this.handleSelectChange}
            />
            <Row>
              <Colxx xxs="12" className="mb-3">
                <ContextMenuTrigger id="menu_id" data='1' collect={collect}>
                  <Card style={{ background: '#dad9d9' }}
                    onClick={event => this.onCheckItem(event, '1')}
                    className={classnames("d-flex flex-row", {
                      active: true
                    })}
                  >
                    <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                      <div style={{ fontWeight: '600' }} className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                        {/* <NavLink to={`?p=${product.id}`} className="w-40 w-sm-100">
                <p className="list-item-heading mb-1 truncate">
                  {product.empId}
                </p>
              </NavLink> */}
                        <p className="mb-2 text-medium w-15 w-sm-100">
                          Employee ID
                </p>
                        <p className="mb-2 text-medium w-15 w-sm-100">
                          Project ID
                </p>
                        <p className="mb-2 text-medium w-15 w-sm-100">
                          WFH Start Date
              </p>
                        <p className="mb-1  text-medium w-15 w-sm-100">
                          WFH End Date
              </p>
                        <p className="mb-2 text-medium w-15 w-sm-100">
                          Status
              </p>

                      </div>
                      <div id="checkAll" className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                        {false ?<CustomInput
                className="item-check mb-0"
                type="checkbox"
                id='check_1'
                
                onChange={() => {}}
                label=""
              />: <div style={{width:"25px"}}></div>}
                      </div>
                    </div>
                  </Card>
                </ContextMenuTrigger>
              </Colxx>
              {this.state.items.map(product => {
                if (this.state.displayMode === "imagelist") {
                  return (
                    <ImageListView
                      key={product.id}
                      product={product}
                      isSelect={this.state.selectedItems.includes(product.id)}
                      collect={collect}
                      onCheckItem={this.onCheckItem}
                    />
                  );
                } else if (this.state.displayMode === "thumblist") {
                  return (
                    <ThumbListView
                      key={product.id}
                      product={product}
                      isSelect={this.state.selectedItems.includes(product.id)}
                      collect={collect}
                      onCheckItem={this.onCheckItem}
                    />
                  );
                } else {
                  return (
                    <DataListView
                      key={product.id}
                      product={product}
                      isSelect={this.state.selectedItems.includes(product.id)}
                      onCheckItem={this.onCheckItem}
                      collect={collect}
                    />
                  );
                }
              })}{" "}
              <Pagination
                currentPage={this.state.currentPage}
                totalPage={this.state.totalPage}
                onChangePage={i => this.onChangePage(i)}
              />
              <ContextMenuContainer
                onContextMenuClick={this.onContextMenuClick}
                onContextMenu={this.onContextMenu}
              />
            </Row>
          </div>
        </Fragment>
      );
  }
}
export default ImageListPages;
