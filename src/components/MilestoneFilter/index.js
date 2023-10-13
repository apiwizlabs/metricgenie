import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import {
  getMilestonebyStatusThunk,
  getMilestonesOfSprintThunk,
} from "../../app/features/SprintPlanning/AsyncThunks";
import filterIcon from "../../assets/filter.svg";
import { ToolTip } from "../Tooltip";

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <ToolTip name={"Filter Milestones by Status"} align="top">
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

export const MilestoneFilter = () => {
  const [currentFilter, setCurrentFilter] = useState("NONE");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const { currentSprintId } = useSelector((state) => state.sprintPlanning);

  return (
    <Dropdown show={show} onToggle={() => setShow((prev) => !prev)}>
      <Dropdown.Toggle
        as={CustomToggle}
      />
      <Dropdown.Menu as={CustomMenu}>
        <p>Filter by Milestone Status</p>
        <Dropdown.Divider />
        <ul className="list-unstyled">
          {["ACTIVE", "BACKLOG", "DEV", "QA", "PROD"].map((status) => (
            <Form.Check
              label={status}
              name="sprint-status"
              type="radio"
              id={`${status}-milestone`}
              checked={currentFilter === status}
              onChange={() => {
                setCurrentFilter(status);
                dispatch(
                  getMilestonebyStatusThunk({
                    sprintId: currentSprintId,
                    status,
                  })
                );
              }}
            />
          ))}
        </ul>
        <div className="d-grid">
          <Button
            variant="light"
            onClick={() => {
              setCurrentFilter("NONE");
              dispatch(
                getMilestonesOfSprintThunk({ sprintId: currentSprintId })
              );
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
