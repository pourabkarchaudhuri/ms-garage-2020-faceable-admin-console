import React, { Component } from "react";
import axios from "axios";

import { Alert } from 'reactstrap';
import { NotificationManager } from "../../../components/common/react-notifications";

function collect(props) {
    return { data: props.data };
}
const apiUrl = 'http://localhost:5000/api/v1/wfh/approvedeny';

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
        console.log(document.location.href);
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

        const url_string = window.location.href;
        const url = new URL(url_string);
        const requestDecision = url.searchParams.get("request");
        const empId = url.searchParams.get("empid");

        if (requestDecision == 'approve') {
            const data = {
               empId: empId,
               deviceName: url.searchParams.get("devicename"),
               publicIP: url.searchParams.get("publicip")
            }
            const options = {
                method: 'put',
                url: apiUrl,
                data: data,
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`
                }
            }

            axios(options)
                .then(response => {
                    console.log(response.data);
                    const data = {
                        empId: empId,
                        message: 'You have approved the request for IP whitelisting for employee ID '
                    }
        
                    this.setState({
                        isLoading: true,
                        items: data
                    });
                   
                })
                .catch((err) => {
                    console.log(err.response);
                    const data = {
                        empId: empId,
                        message: 'Something went wrong. Cannot approve your request for EmployeeId '
                    }
        
                    this.setState({
                        isLoading: true,
                        items: data
                    });
                    NotificationManager.error(
                        "",
                        "Something went wrong while approving the request",
                        6000,
                        null,
                        null,
                        ''
                    );
                })
        } else {
            // request has been denied.

            const data = {
                empId: empId,
                message: 'You have denied the request of IP whitelisting for employee ID '
            }

            this.setState({
                isLoading: true,
                items: data
            });
        }
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
                <div style={{ "textAlign": "center", margin: "0px auto", width: "50%", "fontSize": "30px" }}>
                    <Alert color="success">
                        {items.message}{items.empId}
      </Alert>
                </div>
            );
    }
}
export default ImageListPages;
