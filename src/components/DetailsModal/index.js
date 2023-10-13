// type can be Badge
import { Badge } from "react-bootstrap";
import closeIcon from "../../assets/close.svg";

export const DetailsModal = ({ data, type, setShow }) => {
  return (
    <div
      className={`details-modal-container ${
        type === "workspace" ? "workspace-modal-details" : ""
      } ${type === "workspace-users" ? "workspace-users-details" : ""}`}
    >
      {type === "workspace-users" && (
        <div
          className="modal-close-btn-container"
          onClick={() => {
            setShow({ show: false, userId: null });
          }}
        >
          <img src={closeIcon} className="details-modal-close-btn" />
        </div>
      )}
      {type === "badge" && data && data.map((item) => <Badge>{item}</Badge>)}
      {type === "workspace" &&
        data &&
        data.map((item) => <Badge>{item.workspace}</Badge>)}
      {type === "workspace-users" && (
        <div className="user-details-container">
          <div className="detail-group">Email: {data.email}</div>
          <div className="detail-group">First Name: {data.firstName}</div>
          <div className="detail-group">Last Name: {data.lastName}</div>
          <div className="detail-group">Login Id: {data.loginId}</div>
          <div className="detail-group">Plan Id: {data.planId}</div>
          <div className="detail-group">
            Payment Schedule: {data.paymentSchedule}
          </div>
          <div className="detail-group">Trial Period: {data.trialPeriod}</div>
          <div className="detail-group">User type: {data.userType}</div>

          <div className="detail-group">
            Trial: {data.isTrial ? "True" : "False"}
          </div>
        </div>
      )}
    </div>
  );
};
