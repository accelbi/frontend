function getThisWeekDatesArrayWithDay(mondayDate) {
  const datesArray = [];
  const startDate = new Date(mondayDate);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Loop through the days of the week (0 = Monday, 6 = Sunday)
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}-${daysOfWeek[i]}`;
    datesArray.push(formattedDate);
  }

  return datesArray;
}
function excelFormattedDatas(data)  {
    const arr = getThisWeekDatesArrayWithDay(data.MonDate); 

    const transformedData = jsonData.data.map((item) => {
        const transformedItem = {
          project: item.project,
          projectCode: item.projectCode,
          task: item.task,
          taskCode: item.taskCode,
          taskDesc: item.taskDesc,
        };
      
        dateHeaders.forEach((dateHeader, index) => {
          transformedItem[dateHeader] = item.hours[index];
        });
      
        return transformedItem;
    });
    return transformedData;
}