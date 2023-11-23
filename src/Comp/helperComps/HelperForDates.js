export function getDatesInWeek(startingDateStr) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const startDate = new Date(startingDateStr);
  const currentYear = startDate.getFullYear();
  const currentMonth = startDate.getMonth();
  const currentDate = startDate.getDate();
  
  const datesInWeek = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentYear, currentMonth, currentDate + i);
    const day = daysOfWeek[i];
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1 and pad with 0 if needed
    const day1 = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day1}`;
    
    const monthAndYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
    
    datesInWeek.push({ day, monthAndYear , date:formattedDate });
  }

  return datesInWeek;
}






export function getMondayOfCurrentWeek() {
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const monday = new Date(today);

  // Calculate how many days to subtract to get to the previous Monday
  const daysToSubtract = (currentDayOfWeek === 0) ? 6 : currentDayOfWeek - 1;
  monday.setDate(today.getDate() - daysToSubtract);

  // Format the date as "YYYY-MM-DD"
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}




export function getMondayOfPreviousWeek(mondayDateStr) {
  const inputMonday = new Date(mondayDateStr);
  const previousMonday = new Date(inputMonday);

  // Subtract 7 days to get the Monday of the previous week
  previousMonday.setDate(inputMonday.getDate() - 7);

  // Format the date as "YYYY-MM-DD"
  const year = previousMonday.getFullYear();
  const month = String(previousMonday.getMonth() + 1).padStart(2, '0');
  const day = String(previousMonday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}





export function getMondayOfNextWeek(startingDateStr) {
  const startDate = new Date(startingDateStr);
  const nextMonday = new Date(startDate);
  nextMonday.setDate(startDate.getDate() + 7); // Add 7 days to move to the next week

  // Ensure the date is on a Monday (if not already)
  const currentDayOfWeek = nextMonday.getDay();
  const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  nextMonday.setDate(nextMonday.getDate() - daysToSubtract);

  // Format the date as "YYYY-MM-DD"
  const year = nextMonday.getFullYear();
  const month = String(nextMonday.getMonth() + 1).padStart(2, '0');
  const day = String(nextMonday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


export function getTitle(Mdate) {
  if (getMondayOfCurrentWeek() === Mdate) {
    return "This Week";
  } else if (getMondayOfPreviousWeek(getMondayOfCurrentWeek()) === Mdate) {
    return "Prev Week";
  } else {
    const sun = formatDate0(getSundayOfCurrentWeek(Mdate));
    return `${Mdate}   ⇌   ${sun}`;
  }
}

function getSundayOfCurrentWeek(MondayDate) {
  const sunday = new Date(MondayDate);
  sunday.setDate(sunday.getDate() + 6);
  return sunday;
}


function formatDate0(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export function formatDate(inputDate) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(inputDate);
  return date.toLocaleDateString('en-US', options);
}


export function getFormattedTodaysDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so we add 1
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


export function getFormattedTodaysDateModified(inputDate) {

  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const [year, month, day] = inputDate.split('-');
  const monthName = months[parseInt(month) - 1];

  return `${day} ${monthName} ${year}`;
}



export  function getThisWeekDatesArrayWithDay(mondayDate) {
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
export  function getThisWeekDatesArray(mondayDate) {
    const datesArray = [];
    const startDate = new Date(mondayDate);
  
    // Loop through the days of the week (0 = Monday, 6 = Sunday)
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      datesArray.push(formattedDate);
    }
  
    return datesArray;
  }
  
  export function getMondayDateOfAnyDayInTheWeek(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Calculate the difference in days
    date.setDate(diff); // Set the date to the Monday of that week
  
    // Format the result as "YYYY-MM-DD"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${dayOfMonth}`;
  }


  export function getSundayOfThisWeek(date) {
    const currentDate = new Date(date);
    const nextSunday = new Date(currentDate);
    nextSunday.setDate(currentDate.getDate() + 6);
  
    // Format the date as "YYYY-MM-DD"
    const formattedDate = nextSunday.toISOString().split('T')[0];
    return formattedDate;
  }