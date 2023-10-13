import { Dropdown, DropdownButton } from "react-bootstrap";
import { useEffect } from "react";

export const ViewFilter = ({
  viewFilters,
  setViewFilters,
  viewOptions,
}) => {
  return (

    <DropdownButton
      id={`col-filter`}
      title={
        `Show Columns`
      }
    >
      {viewOptions.map((option) => {
         const optionPosInFilter = viewFilters.indexOf(option)
        return (
        <div
          key={option}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="filters-checkbox"
        >
          {option==="NONE" ?
          <input type="checkbox" id={`columns-${option}`}
          checked={ viewFilters.length === 0 && true}
          name={`columns-${option}`} 
          onChange={(e)=>{
           if(e.target.checked){
             setViewFilters([]);
           }
         }} />
          : <input type="checkbox" id={`columns-${option}`}
           checked={ optionPosInFilter > -1}
           name={`columns-${option}`} 
           onChange={(e)=>{
            if(e.target.checked){
              setViewFilters((prev) => ([
                ...prev,
                option,
              ]));
            }else{
              const optionIndex = viewFilters.indexOf(option)
              viewFilters.splice(optionIndex, 1)
              let newViewFilters = [...viewFilters]
              if(optionIndex > -1){
                setViewFilters(newViewFilters);
              }
            }
          }} />}
          
          <label for={`columns-${option}`}> {option.toLowerCase()} </label>       
        </div>
      )})}
    </DropdownButton>
  );
};
