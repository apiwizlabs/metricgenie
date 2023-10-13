import { Dropdown, DropdownButton } from "react-bootstrap";

export const TaskFilter = ({
  filters,
  setFilters,
  filterType,
  filterOptions,
}) => {

  return (
    <DropdownButton
      id={`task-filter-${filterType}`}
      title={
        `Filter by ${filterType}`
      }
    >
      {filterOptions.map((option) => {
        const optionPosInFilter =filters[filterType].indexOf(option)
        return (
        <div
          key={option}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="filters-checkbox"
        >
         {option==="NONE" ?   
         <input type="checkbox" id={`${filterType}-${option}`}          
            checked={ filters[filterType].length === 0 && true}
            name={`${filterType}-${option}`} onChange={(e)=>{
            if(e.target.checked){
              setFilters((prev) => ({
                ...prev,
                [filterType]: [],
              }));
            }
          }} /> : 
          <input type="checkbox" id={`${filterType}-${option}`}          
            checked={ optionPosInFilter > -1 && true}
            name={`${filterType}-${option}`} onChange={(e)=>{
            if(e.target.checked){
              setFilters((prev) => ({
                ...prev,
                [filterType]: prev[filterType].concat(option),
              }));
            }else{
              filters[filterType].splice(optionPosInFilter, 1)
              const newFilters = filters[filterType]
              if(optionPosInFilter > -1){
                setFilters((prev) => ({
                  ...prev,
                  [filterType]: newFilters
                }));
              }
            }
          }} />
        }
          <label for={`${filterType}-${option}`}>{option.toLowerCase()}</label>       
        </div>
      )})}
    </DropdownButton>
  );
};
