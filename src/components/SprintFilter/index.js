import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getSprintByStatusThunk,
  getSprintInfoThunk,
} from "../../app/features/SprintPlanning/AsyncThunks";
import filterIcon from "../../assets/filter.svg";
import { ToolTip } from "../Tooltip";

const CustomToggle = React.forwardRef(({ onClick, type }, ref) => (
  <ToolTip
    name={
      type === "Milestone"
        ? "Filter Milestones by Status"
        : "Filter Sprint by Status"
    }
    align="top"
  >
    <img
      ref={ref}
      className="filter-icon"
      src={filterIcon}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    />
  </ToolTip>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        {children}
      </div>
    );
  }
);

export const SprintFilter = () => {
  const [currentFilter, setCurrentFilter] = useState("NONE");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Dropdown show={show} onToggle={() => setShow((prev) => !prev)}>
      <p className="current-filter">
        {currentFilter !== "NONE" && `Displaying ${currentFilter} sprints`}
      </p>

      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
      <Dropdown.Menu as={CustomMenu}>
        <p>Filter by Sprint Status</p>
        <Dropdown.Divider />
        <ul className="list-unstyled">
          {["ACTIVE", "INACTIVE"].map((status) => (
            <Form.Check
              label={status}
              name="sprint-status"
              type="radio"
              id={status}
              checked={currentFilter === status}
              onChange={() => {
                setCurrentFilter(status);
                dispatch(getSprintByStatusThunk({ status }));
                setSearchParams({});
              }}
            />
          ))}
        </ul>
        <div className="d-grid">
          <Button
            variant="light"
            onClick={() => {
              setCurrentFilter("NONE");
              dispatch(getSprintInfoThunk());
              setShow((prev) => !prev);
            }}
          >
            Clear All
          </Button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};
