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
import { AreaChart } from "../../components/charts";

import { areaChartData } from "../../data/charts"; 

const WebsiteVisitsChartCard = ({ className = "", controls = true, chartData }) => {
  console.log(chartData);
  areaChartData.labels = chartData.daysArray;
  areaChartData.datasets[0].data = chartData.valuesArray;
  return (
    <Card className={`${className} dashboard-filled-line-chart`}>
      <CardBody>
        <div className="float-left float-none-xs">
          <div className="d-inline-block">
            <h5 className="d-inline">
              <IntlMessages id="dashboards.event-logs" />
            </h5>
            <span className="text-muted text-small d-block">
              <IntlMessages id="dashboards.per-day" />
            </span>
          </div>
        </div>
        {controls && (
          <div className="btn-group float-right float-none-xs mt-2">
            <UncontrolledDropdown>
              <DropdownToggle color="primary" className="btn-xs" outline>
                <IntlMessages id="dashboards.this-week" />
              </DropdownToggle>
            </UncontrolledDropdown>
          </div>
        )}
      </CardBody>

      <div className="chart card-body pt-0">
        <AreaChart shadow data={areaChartData} />
      </div>
    </Card>
  );
};

export default WebsiteVisitsChartCard;
