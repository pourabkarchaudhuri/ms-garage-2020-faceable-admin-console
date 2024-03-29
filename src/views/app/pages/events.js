import React, { Component, Fragment } from "react";
import { Row, CustomInput, Card, Badge } from "reactstrap";
import axios from "axios";
import { ContextMenuTrigger } from "react-contextmenu";

import { servicePath } from "../../../constants/defaultValues";

import DataListView from "../../../containers/pages/DataListView";
import Pagination from "../../../containers/pages/Pagination";
import ContextMenuContainer from "../../../containers/pages/ContextMenuContainer";
import ListPageHeading from "../../../containers/pages/EventsListPageHeading";
import ImageListView from "../../../containers/pages/ImageListView";
import ThumbListView from "../../../containers/pages/ThumbListView";
//import AddNewModal from "../../../containers/pages/AddNewModal";
import { Colxx } from "../../../components/common/CustomBootstrap";
import classnames from "classnames";

function collect(props) {
  return { data: props.data };
}
const apiUrl = `${process.env.REACT_APP_API_URL}/events`;

class Events extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require('mousetrap');
    this.state = {
      displayMode: "thumblist",

      selectedPageSize: 6,
      orderOptions: [
        { column: "title", label: "Product Name" },
        { column: "category", label: "Category" },
        { column: "status", label: "Status" }
      ],
      pageSizes: [6, 12, 24],

      categories: [
        { label: "Cakes", value: "Cakes", key: 0 },
        { label: "Cupcakes", value: "Cupcakes", key: 1 },
        { label: "Desserts", value: "Desserts", key: 2 }
      ],

      selectedOrderOption: { column: "title", label: "Product Name" },
      dropdownSplitOpen: false,
      modalOpen: false,
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: "",
      selectedItems: [],
      lastChecked: null,
      isLoading: false
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
      modalOpen: !this.state.modalOpen
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
            heading="menu.events"
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
            itemsLength={items ? items.length : 0}
            onSearchKey={this.onSearchKey}
            orderOptions={orderOptions}
            pageSizes={pageSizes}
            toggleModal={this.toggleModal}
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
              {/* <p className="mb-2 text-medium w-15 w-sm-100">
                          Snapshots
                </p> */}
                        <p style={{margin: '0px 21px 0px 0px'}} className="mb-2 text-medium w-15 w-sm-100">
                          Assigned Employee
                </p>
                        <p style={{margin: '0px 25px 0px 0px'}} className="mb-2 text-medium w-15 w-sm-100">
                        &nbsp;Event Name
                </p>
                        <p style={{margin: '0px 15px 0px 0px'}} className="mb-2 text-medium w-15 w-sm-100">
                          Public IP
              </p>
                        <p style={{margin: '0px 19px 0px 0px'}} className="mb-1  text-medium w-15 w-sm-100">
                          &nbsp;Region
              </p>
                        <p style={{margin: '0px 19px 0px 0px'}} className="mb-2 text-medium w-15 w-sm-100">
                          Device Name
              </p>

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
export default Events;
