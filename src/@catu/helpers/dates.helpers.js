export function getDefaultDates() {
  let date_start, date_end;
  const today = new Date();
  const thisMonth = today.getMonth() + 1;
  const thisYear = today.getFullYear();
  if (thisMonth >= 10) {
    date_start = new Date(thisYear, 9, 1);
    date_end = new Date(thisYear + 1, 8, 30);
  } else {
    date_start = new Date(thisYear, 9, 1);
    date_end = new Date(thisYear, 8, 30);
  }
  return [date_start, date_end];
}

/**
 * Returns an array of Date objects of a the week
 * of a given data starting with sunday
 * @param Date current
 * @author Mohheddine K.
 * @returns Array<Date>
 */
export function daysOfAWeek(current) {
  const week = [];
  const dd = new Date(current);
  if (!isValidDate(dd)) {
    return week;
  }
  let daysToSunday = dd.getDate() - dd.getDay();
  const pointer = new Date(dd.setDate(daysToSunday));
  for (let i = 0; i < 7; i++) {
    const e = new Date(pointer.setDate(pointer.getDate() + 1));
    week.push(e);
  }
  return week;
}

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export function isSameDay(day, today) {
  if (!day || !today) return false;
  return (
    today.getDate() === day.getDate() &&
    today.getMonth() === day.getMonth() &&
    today.getFullYear() === day.getFullYear()
  );
}

export function formatLongDate(date, withTime) {
  if (!isValidDate(date)) {
    return null;
  }

  const d = new Date(date);
  let string;

  string = d.getFullYear();
  string = string + "-" + ("0" + (d.getMonth() + 1)).slice(-2);
  string = string + "-" + ("0" + d.getDate()).slice(-2);

  if (!withTime) return string;

  string = string + " " + ("0" + d.getHours()).slice(-2);
  string = string + ":" + ("0" + d.getMinutes()).slice(-2);
  string = string + ":" + ("0" + d.getSeconds()).slice(-2);

  return string;
}
