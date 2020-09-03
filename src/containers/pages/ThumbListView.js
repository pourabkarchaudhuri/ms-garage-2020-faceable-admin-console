import React from "react";
import { Card, CustomInput, Badge } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { ContextMenuTrigger } from "react-contextmenu";
import { Colxx } from "../../components/common/CustomBootstrap";

const ThumbListView = ({ product, isSelect, collect, onCheckItem }) => {
  return (
    <Colxx xxs="12" key={product.id} className="mb-3">
      <ContextMenuTrigger id="menu_id" data={product.id} collect={collect}>
        <Card
          onClick={event => onCheckItem(event, product.id)}
          className={classnames("d-flex flex-row", {
            active: isSelect
          })}
        >
          {/* <NavLink to={`?p=${product.id}`} className="d-flex">
          <img
              alt={product.title}
              src={product.snapshots[0].imageURL}
              style={{margin: '5px 81px 0px 25px', width: 70, height: 70, borderRadius: 100}}
            />
          </NavLink> */}
          <div className="pl-2 d-flex flex-grow-1 min-width-zero">
            <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
              {/* <NavLink to={`?p=${product.id}`} className="w-40 w-sm-100">
                <p className="list-item-heading mb-1 truncate">
                  {product.empId}
                </p>
              </NavLink> */}
              <p  className="mb-2 text-medium w-15 w-sm-100">
                {product.empId}
              </p>
              <p  className="mb-2 text-medium w-15 w-sm-100">
                {product.eventName}
              </p>
              <p  className="mb-2 text-medium w-15 w-sm-100">
                {product.publicIP}
              </p>
              <p className="mb-2 text-medium w-15 w-sm-100">
                {product.city}
              </p>
              <p style={{margin: '0px 23px 0px 0px'}} className="mb-2 text-medium w-15 w-sm-100">
               { product.DeviceName ? product.DeviceName : "devicename"}
              </p>
              {/* <p className="mb-2 text-medium w-15 w-sm-100">
               
              </p> */}
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ThumbListView);
