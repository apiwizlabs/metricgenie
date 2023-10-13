import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSprintUsersThunk } from "../../app/features/SprintPlanning/AsyncThunks";
import {
  getBugsThunk,
  deleteBugThunk,
} from "../../app/features/Bugs/AsyncThunks";
import { SideNav } from "../../components/SideNav/SideNav";
import Style from "./bugs.module.css";
import { BugForm } from "./Components/BugForm";
import { Loader } from "../../components/Loader";
import { Table } from "react-bootstrap";
import { ToolTip } from "../../components/Tooltip";
import deleteIcon from "../../assets/delete.svg";
import attachmentIcon from "../../assets/attachment.svg";
import { EditViewBugModal } from "./Components/EditViewBugModal";
import { isFulfilled } from "@reduxjs/toolkit";
import { AttachmentModal } from "./Components/AttachmentModal";
import searchIcon from "../../assets/search.svg";
import closeIcon from "../../assets/close.svg";

export const Bugs = (props) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentEditableBug, setCurrentEditablebug] = useState(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const dispatch = useDispatch();

  const { actionStatus, bugsData } = useSelector((state) => state.bugs);
  const [allBugs, setAllBugs] = useState(bugsData ? bugsData : null);
  const [searchStr, setSearchStr] = useState("");
  const [searchOpen, setSearchOpen] = useState(true);

  const getFilteredbugs = (allBugs, searchStr) => {
    if (searchStr.length === 0) {
      return allBugs;
    } else {
      return allBugs.filter(
        (bug) =>
          bug.owner.toLowerCase().includes(searchStr.toLowerCase()) ||
          bug.reportedBy.toLowerCase().includes(searchStr.toLowerCase())
      );
    }
  };

  const searchBugsHandler = (evt) => {
    setSearchStr(evt.target.value);
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const filteredBugs = getFilteredbugs(bugsData, evt.target.value);
      setAllBugs(filteredBugs);
    }, 500);
  };

  useEffect(() => {
    dispatch(getBugsThunk());
    dispatch(getSprintUsersThunk());
  }, []);

  useEffect(() => {
    setAllBugs(bugsData);
  }, [bugsData]);

  const deletebugHandler = async (evt, bugId) => {
    evt.stopPropagation();
    const action = await dispatch(deleteBugThunk({ bugId }));

    if (isFulfilled(action)) {
      dispatch(getBugsThunk());
    }
  };

  console.log({ allBugs });

  return (
    <>
      <SideNav />
      <div className="main-content">
        <h1 className={Style["page-title"]}>Active Bugs</h1>
        <button
          className={`${Style["btn"]} ${Style["btn-primary"]} ${Style["new-bug-btn"]}`}
          onClick={() => setShowCreateModal((prev) => !prev)}
        >
          New Bug
        </button>
        {actionStatus.getBugs === "fulfilled" && bugsData.length === 0 && (
          <p>No Bugs found</p>
        )}
        {actionStatus.getBugs === "loading" && <Loader />}
        {actionStatus.getBugs === "fulfilled" && bugsData.length > 0 && (
          <div className="details-table__container">
            <div className="table-filters__container">
              <div className="search-container">
                <input
                  value={searchStr}
                  onChange={searchBugsHandler}
                  className={`search-input ${!searchOpen ? "show" : ""}`}
                  placeholder="Search by owner or reporter"
                  autoFocus={true}
                />
                <img
                  src={searchOpen ? searchIcon : closeIcon}
                  className="search-icon"
                  onClick={() => {
                    setSearchOpen((prev) => !prev);
                    if (!searchOpen) {
                      setSearchStr("");
                      setAllBugs(bugsData);
                    }
                  }}
                />
              </div>
            </div>
            <Table striped hover>
              <thead className="details-table-heading__container">
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Reporter</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="detail-body__container">
                {allBugs &&
                  allBugs?.map((bug, index) => (
                    <tr
                      key={bug._id}
                      className="detail-row"
                      onClick={() => {
                        setShowViewModal(true);
                        setCurrentEditablebug(bug);
                      }}
                    >
                      <td className="detail-item">{bug.name}</td>
                      <td className="detail-item">
                        <p>{bug.owner}</p>
                        <p>{bug.ownerEmail}</p>
                      </td>
                      <td className="detail-item">
                        <p>{bug.reportedBy}</p>
                        <p>{bug.reportedByEmail}</p>
                      </td>
                      <td className="detail-item">{bug.status}</td>
                      <td className="detail-item">{bug.priority}</td>
                      <td className="detail-item">
                        <div className="actions__container d-flex gap-2">
                          <ToolTip name={"Delete"}>
                            <img
                              src={deleteIcon}
                              className="edit-icon"
                              onClick={(evt) => {
                                evt.stopPropagation()
                                if(window.confirm("Are you sure you want to delete this item?")){
                                  deletebugHandler(evt, bug._id)
                                }
                              }}
                            />
                          </ToolTip>

                          <ToolTip name={"Attach"}>
                            <img
                              src={attachmentIcon}
                              className="edit-icon"
                              onClick={(evt) => {
                                evt.stopPropagation();
                                setShowAttachmentModal({
                                  bugId: bug._id,
                                  show: true,
                                });
                              }}
                            />
                          </ToolTip>
                        </div>
                      </td>
                    </tr>
                  ))}

                {allBugs && allBugs.length === 0 && (
                  <tr className="detail-row">No data found</tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>
      <BugForm showModal={showCreateModal} setShowModal={setShowCreateModal} />
      <EditViewBugModal
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        existingBug={currentEditableBug}
      />
      <AttachmentModal
        showModal={showAttachmentModal}
        setShowModal={setShowAttachmentModal}
      />
    </>
  );
};
