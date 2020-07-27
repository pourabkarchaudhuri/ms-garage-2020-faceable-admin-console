import React from "react";
import {
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label
} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";

import { useState } from 'react';

const AddNewModal = ({ modalOpen, toggleModal, categories, handleInputChange, fetchEmpRecord, empId, empName, email,
  handleChangeStart, handleChangeEnd, startDateRange, endDateRange, handleFile, handleSubmit, buttonLoader, handleSelectChange }) => {


    const [selectedValue, setSelectedValue] = useState(3);

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="Create New WFH Record" />
      </ModalHeader>
      <ModalBody>
        <Label>
          <IntlMessages id="Emp ID" />
        </Label>
        <div>
          <Input id="empId" type="text" name="empId" value={empId} onChange={handleInputChange} />
          <br />
          <Button id="fetchButton" color="primary" onClick={fetchEmpRecord} disabled={buttonLoader}>
            {/* <IntlMessages id="Fetch" /> */}
            {buttonLoader && (
            <i
              className="simple-icon-refresh"
              style={{ marginRight: "5px" }}
            />
          )}
          {buttonLoader && <span>Fetch</span>}
          {!buttonLoader && <span>Fetch</span>}
          </Button>
        </div>
        <Label className="mt-4">
          <IntlMessages id="Employee Name" />
        </Label>
        <Input type="text" name="empName" value={empName} disabled="disabled" />
        <Label className="mt-4">
          <IntlMessages id="Employee Email" />
        </Label>
        <Input type="text" name="email" value={email} disabled="disabled" />
        <Label className="mt-4">
          <IntlMessages id="Select Device" />
        </Label>
        <Select
          components={{ Input: CustomSelectInput }}
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-name"
          options={categories}
          value={categories.find(obj => obj.value === selectedValue)}
          onChange={handleSelectChange}
        />
        <Label className="mt-4">
          <IntlMessages id="Upload Employee Photos (2)" />
        </Label>
        <Input type="file" name="images" id="imgid" className="imgcls" onChange={handleFile} multiple></Input>
        <Label className="mt-4">
          <IntlMessages id="WFH Start Date" />
        </Label>
        <DatePicker
          selected={startDateRange}
          selectsStart
          startDate={startDateRange}
          endDate={endDateRange}
          onChange={handleChangeStart}
        // placeholderText={messages["form-components.start"]}
        />
        <Label className="mt-4">
          <IntlMessages id="WFH End Date" />
        </Label>
        <DatePicker
          selected={endDateRange}
          selectsEnd
          startDate={startDateRange}
          endDate={endDateRange}
          onChange={handleChangeEnd}
        // placeholderText={messages["form-components.end"]} 
        />
        {/* <Label className="mt-4">
          <IntlMessages id="pages.status" />
        </Label>
        <CustomInput
          type="radio"
          id="exCustomRadio"
          name="customRadio"
          label="ON HOLD"
        />
        <CustomInput
          type="radio"
          id="exCustomRadio2"
          name="customRadio"
          label="PROCESSED"
        /> */}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          <IntlMessages id="pages.submit" />
        </Button>{" "}
      </ModalFooter>
    </Modal>
  );
};

export default AddNewModal;
