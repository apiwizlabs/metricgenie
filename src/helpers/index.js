import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const objectDeepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  }
  catch(err) {
    return obj;
  }
}

const FRONTEND_DEVELOPERS = ["Arpan Mondal", "Deva Prakash", "Nihal Ahamed M S", "Sireesha Chelluri", "Shashil Sravan"]

const filterByFrontend = (el) => {
  return FRONTEND_DEVELOPERS.includes(el.assignee)
}

export const helpers = {
  getCSVDownloadableLink: function (data) {
    if (data) {
      const titleKeys = Object.keys(data[0]);

      const refinedData = [];

      refinedData.push(titleKeys);

      data.slice(1).forEach((item) => {
        refinedData.push(Object.values(item));
      });

      let csvContent = "";

      refinedData.forEach((row) => {
        csvContent += row.join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
      const objUrl = URL.createObjectURL(blob);

      return objUrl;
    }
    return "";
  },

  exportSprintDataToExcel: function ({ data, fileName }) {
    if (data && data.milestones?.length > 0) {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "metric-genie-dashboard";
      workbook.created = new Date();


      const worksheet = workbook.addWorksheet('Milestones data', {
        views: [
          {
            state: "frozen",
            xSplit: 1,
            ySplit: 1,
          },
        ],
      })

      const milestones = objectDeepClone(data.milestones).map(el => {
        let tasks = [];
        if(el.tasks && el.tasks.length)
        {
          for(let task of el.tasks)
          {
            if(task.subTasks && task.subTasks.length) tasks.push(...task.subTasks);
            else tasks.push(task);
          }
        }
        // el.tasks = tasks.filter(filterByFrontend);
        el.tasks = tasks;
        return el;
      });

      worksheet.columns = [
        { header: "Milestone", key: "Milestone" },
        { header: "Tasks", key: "Tasks" },
        { header: "Owner", key: "Owner" },
        { header: "Assignee", key: "Assignee" },
        { header: "Start Date", key: "Start_Date" },
        { header: "End Date", key: "End_Date" },
        { header: "Type", key: "Type" },
        { header: "Priority", key: "Priority" },
        { header: "Status", key: "Status" },
        { header: "Estimated Effort", key: "Estimated Effort" },
        { header: "Effort Spent", key: "Effort Spent" },
      ];

      let startRow = 2
      // let endRow = 2
      milestones.forEach(milestone => {
        if(milestone?.tasks?.length){
          let rowsData = []
          let temp = []

          milestone?.tasks?.forEach((task, index) => {
            temp = []
            /*
            if(index == 0){
              temp.push(milestone.name);
            }else{
              temp.push("")
            }
            */
            temp.push(milestone.name);
            temp.push(task.name);
            temp.push(task.owner);
            temp.push(task.assignee);
            temp.push(task.startDate.split("-").reverse().join("-"));
            temp.push(task.endDate.split("-").reverse().join("-"));
            temp.push(task.type);
            temp.push(task.priority);
            temp.push(task.status);
            temp.push(task.estimatedEffort);
            temp.push(task.effortSpent);
            rowsData.push(temp);
          })

          worksheet.addRows(rowsData)
          //let endRow = startRow + (milestone.tasks.length - 1)
          //worksheet.mergeCells(`A${startRow}:A${endRow}`);
          //startRow = endRow + 1
        }
      })

      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          saveAs(new Blob([buffer]), fileName);
        })
        .catch((err) => console.log("Error writing excel export", err));
    }
  },
};

export const getShortObjId = (objId) => {
  
  const symbols = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-".split("");
  let timestamp = parseInt(objId.substring(0, 8),10).toString()
  let counter = parseInt(objId.slice(-6),16)
  counter = parseInt(counter.toString().slice(-3), 10);
  timestamp = timestamp + counter;
  let temp;
  let conversion = "";

  while (timestamp > 0) {
    temp = Math.floor(timestamp / 64);
    conversion = symbols[(timestamp - (64 * temp))] + conversion;
    timestamp = temp;
}
return conversion

}
export const filterArrayByName = (array) => {
  let copyOfArray = [...array];
  return copyOfArray?.sort((a, b) => a.name?.localeCompare(b.name));
};

export function joinUrlPaths(paths) {
  let _url = "";
  for (let p of paths) {
    if (_url.endsWith("/") && p.startsWith("/")) _url += p.substring(1);
    else _url += p;
  }
  return _url;
}


export const formatEditorText = (text) => {
  let _text = text.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, `"`)
  if(_text.startsWith('"')) _text = _text.substring(1)
  if(_text.endsWith('"')) _text = _text.substring(0, _text.length-1);
  return _text;
}