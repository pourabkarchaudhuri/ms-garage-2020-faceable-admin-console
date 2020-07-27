import React from "react";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";
import {CircularProgressbar} from "react-circular-progressbar";

const RadialProgressCard = ({
  title = "title",
  detail="detail",
  //  isSortable = false
}) => {
  return (
    <Card>
      {
        <CardHeader className="p-0 position-relative">
          <div className="position-absolute handle card-icon">
            <i className="simple-icon-shuffle" />
          </div>
        </CardHeader>
      }
      <CardBody className="d-flex justify-content-between align-items-center">
        <CardTitle className="mb-0">{title}</CardTitle>
        <div > 
        <strong className="text-large bold text-blue" >{detail}</strong>
         </div> 
      </CardBody>
    </Card>
  );
};
export default RadialProgressCard;
