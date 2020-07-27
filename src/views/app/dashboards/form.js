import React, { Component } from "react";
// import { injectIntl } from "react-intl";
import { Row, Card, CardBody, CardTitle } from "reactstrap";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from 'reactstrap';

import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx } from "../../../components/common/CustomBootstrap";
import axios from 'axios';

class Forms extends Component {
  constructor(props) {
    console.log("dsvdvds");
    super(props);
    this.state = {
      startDate: null,
      startDateTime: null,
      startDateRange: null,
      endDateRange: null,
      embeddedDate: moment(),
      empId: "",
      empName: '',
      phone: "",
      email: "",
      photo1: "",
      photo2: ""
    };
  }
  handleChangeEmbedded = date => {
    this.setState({
      embeddedDate: date
    });
  };

  handleChangeDate = date => {
    this.setState({
      startDate: date
    });
  };

  handleChangeDateTime = date => {
    this.setState({
      startDateTime: date
    });
  };

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

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleFile = (e) => {
    if (e.target.files.length === 2) {
      this.setState({
        photo1: e.target.files[0],
        photo2: e.target.files[1],
      });
    }
    return;
  }
  handleGetEmployeeData = (e) => {
    const headers = {
      'Authorization': `Bearer ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`

    };
    axios.get(`${process.env.REACT_APP_API_URL}/employee/${this.state.empId}`, { headers })
      .then(response => {
        this.setState({
          empName: response.data.data.empName,
          phone: response.data.data.phone,
          email: response.data.data.email,
        })
        console.log(response.data);
      })
      .catch((err) => {
        console.log("error ", err);
      })
  }

  handleSubmit = (e) => {
    // Call WFH enable API with required data.

    e.preventDefault();

    const data = new FormData();

    console.log(this.state.startDateRange);
    data.append('photo1', this.state.photo1);
    data.append('photo2', this.state.photo2);
    data.set('empId', this.state.empId);
    data.set('startDate', String(this.state.startDateRange));
    data.set('endDate', String(this.state.endDateRange));
    data.set('projectId', "PRJ-4607");

    console.log(data);
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
      })
      .catch((err) => {
        console.log(err.response);
      })

  }

  render() {
    // const { messages } = this.props.intl;

    return (
      <form onSubmit={this.handleSubmit}>
        <Row>
          <Colxx xxs="12" xl="8" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle>
                  Employee Form
              </CardTitle>
                <Row className="mb-6">
                  <Colxx xxs="12">
                    <input type="text" name='empId' onChange={this.handleChange} />
                    <Button onClick={this.handleGetEmployeeData}>FETCH</Button>
                  </Colxx>
                  <Colxx xxs="12">
                    <input type="text" name='empName' disabled='disabled' value={this.state.empName} onChange={this.handleChange} />
                  </Colxx>
                  <Colxx xxs="12">
                    <input type="text" name='phone' disabled='disabled' value={this.state.phone} onChange={this.handleChange} />
                  </Colxx>
                  <Colxx xxs="12">
                    <input type="text" name='email' disabled='disabled' value={this.state.email} onChange={this.handleChange} />
                  </Colxx>
                  <Colxx xxs="12">
                    <div>
                      <input type="file" name="images" id="imgid" className="imgcls" onChange={this.handleFile} multiple />
                    </div>
                  </Colxx>
                  <Colxx xxs="12">
                    <DatePicker
                      selected={this.state.startDateRange}
                      selectsStart
                      startDate={this.state.startDateRange}
                      endDate={this.state.endDateRange}
                      onChange={this.handleChangeStart}
                    // placeholderText={messages["form-components.start"]}
                    />
                  </Colxx>
                  <Colxx xxs="12">
                    <DatePicker
                      selected={this.state.endDateRange}
                      selectsEnd
                      startDate={this.state.startDateRange}
                      endDate={this.state.endDateRange}
                      onChange={this.handleChangeEnd}
                    // placeholderText={messages["form-components.end"]} 
                    />
                  </Colxx>
                  <Colxx xxs="12">
                    <input type="submit" value="Submit" onClick={this.handleSubmit} />
                  </Colxx>
                </Row>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </form>
    );
  }
}
export default Forms;
