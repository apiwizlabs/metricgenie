export const ActivityCard = ({ type, count, cardIcon }) => {

  return (
    <div className="card-container">
      <div className="card-body">
        <div className="card-icon-bg">
          <img src={cardIcon} className="card-icon" />
        </div>
        <div className="card-text">
          <p className="card-heading">{type}</p>
          <p className="card-value">{count ? count : 0}</p>
        </div>
      </div>
    </div>
  );
};
