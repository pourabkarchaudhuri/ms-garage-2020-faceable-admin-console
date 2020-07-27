import React from "react";
import { Card, CustomInput, Badge } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { ContextMenuTrigger } from "react-contextmenu";
import { Colxx } from "../../components/common/CustomBootstrap";
import moment from 'moment';

const DataListView = ({ product, isSelect, collect, onCheckItem }) => {
  return (
    <Colxx xxs="12" className="mb-3">
      <ContextMenuTrigger id="menu_id" data={product.id} collect={collect}>
        <Card
          onClick={event => onCheckItem(event, product.id)}
          className={classnames("d-flex flex-row", {
            active: isSelect
          })}
        >
          <div className="pl-2 d-flex flex-grow-1 min-width-zero">
            <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
              {/* <NavLink to={`?p=${product.id}`} className="w-40 w-sm-100">
                <p className="list-item-heading mb-1 truncate">
                  {product.empId}
                </p>
              </NavLink> */}
              <p className="mb-1  text-medium w-15 w-sm-100">
                  {product.empId}
                </p>
                <p className="mb-1  text-medium w-15 w-sm-100">
                  {product.projectId}
                </p>
              <p className="mb-1  text-medium w-15 w-sm-100">
                {moment(product.startDate).format('MM-DD-YYYY')}
              </p>
              <p className="mb-1  text-medium w-15 w-sm-100">
              {moment(product.endDate).format('MM-DD-YYYY')}
              </p>
              <div className="mb-1  text-medium w-15 w-sm-100">
                <Badge color={product.isActive ? "primary" : "secondary"} pill>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
              <CustomInput
                className="item-check mb-0"
                type="checkbox"
                id={`check_${product.id}`}
                checked={isSelect}
                onChange={() => {}}
                label=""
              />
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(DataListView);
