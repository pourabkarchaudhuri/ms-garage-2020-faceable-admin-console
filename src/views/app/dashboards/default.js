import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import axios from "axios";

import { Colxx } from '../../../components/common/CustomBootstrap';
import WebsiteVisitsChartCard from '../../../containers/dashboards/WebsiteVisitsChartCard';
import ConversionRatesChartCard from '../../../containers/dashboards/ConversionRatesChartCard';
import RadialProgressCard from "../../../components/cards/RadialProgressCard";

const apiUrl = `${process.env.REACT_APP_API_URL}/stats`;

class DefaultDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees_assigned_wfh: null,
      number_of_failure_events: null,
      number_of_active_machines: null,
      chartData: "",
      isLoading: false
    };
  }

  async componentDidMount() {
    this.dataListRender();
    try {
      setInterval(async () => {
        this.dataListRender()
      }, 3000000);
    } catch (e) {
      console.log(e);
    }
  }



  dataListRender() {
    const headers = {
      'Authorization': `Bearer ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`
    }
    axios
      .get(
        `${apiUrl}`, { headers }
      )
      .then(res => {
        console.log(res.data);
        return res.data;
      })
      .then(data => {
        this.setState({
          employees_assigned_wfh: data.data.wfhEmployees,
          number_of_failure_events: data.data.events,
          number_of_active_machines: data.data.activeMachines,
          chartData: data.data.chartData,
          isLoading: true
        });
      });
  }
  render() {
    const { messages } = this.props.intl;

    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
        <Fragment>
          <Row>
            <Colxx xl="4" lg="6" className="mb-4">
              <RadialProgressCard
                title={messages["dashboards.total-wfh"]}
                detail={`${this.state.employees_assigned_wfh}`}

              />
            </Colxx>
            <Colxx xl="4" lg="6" className="mb-4">
              <RadialProgressCard
                title={messages['dashboards.total-failure-events']}
                detail={`${this.state.number_of_failure_events}`}

              />
            </Colxx>
            <Colxx xl="4" lg="6" className="mb-4">
              <RadialProgressCard
                title={messages['dashboards.total-active-machine']}
                detail={`${this.state.number_of_active_machines}`}
              />
            </Colxx>
          </Row>
          <Row>
            <Colxx sm="12" md="6" className="mb-4">
              <WebsiteVisitsChartCard chartData={this.state.chartData} />
            </Colxx>
            <Colxx sm="12" md="6" className="mb-4">
              <ConversionRatesChartCard chartData={this.state.chartData} />
            </Colxx>
          </Row>
          <Row>
          </Row>
        </Fragment>
      )
  }
}
export default injectIntl(DefaultDashboard);
