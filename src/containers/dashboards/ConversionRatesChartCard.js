import React from "react";
import {
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";

import IntlMessages from "../../helpers/IntlMessages";
import {BarChart} from "../../components/charts";

import { conversionChartData } from "../../data/charts";

const ConversionRatesChartCard = ({chartData}) => {

  // conversionChartData.labels = chartData.monthArray;
  conversionChartData.datasets[0].data = chartData.yearValuesArray;
  return (
    <Card className="dashboard-filled-line-chart">
      <CardBody>
        <div className="float-left float-none-xs">
          <div className="d-inline-block">
            <h5 className="d-inline">
              <IntlMessages id="dashboards.event-chart" />
            </h5>
            <span className="text-muted text-small d-block">
              <IntlMessages id="dashboards.event-year" />
            </span>
          </div>
        </div>

        <div className="btn-group float-right float-none-xs mt-2">
          <UncontrolledDropdown>
            <DropdownToggle color="secondary" className="btn-xs" outline>
              <IntlMessages id="dashboards.this-year" />
            </DropdownToggle>
          </UncontrolledDropdown>
        </div>
      </CardBody>

      <div className="chart card-body pt-0">
        <BarChart shadow data={conversionChartData} />
      </div>
    </Card>
  );
};

export default ConversionRatesChartCard;
