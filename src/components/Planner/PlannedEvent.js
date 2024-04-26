import { MINUTES_PER_HOUR } from './chrono';

export default class PlannedEvent {
  static EARLIEST_HOUR = 7; // 7:00 AM (7:00 military)
  static LATEST_HOUR = 22; // 10:00 PM (22:00 military time)
  id; // string
  name; // string
  startTime; // number (minutes since midnight - e.g. 60 * 10 = 10AM)
  endTime; // number (minutes since midnight - e.g. 60 * 10 = 10AM)
  hostName;
  isTentative; // boolean

  constructor(id, name, startTime, endTime, hostName, isTentative = false) {
    this.id = id;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.hostName = hostName;
    this.isTentative = isTentative;
  }

  calculateGridStyles(addEvents) {
    const earliestHourInMinutes = PlannedEvent.EARLIEST_HOUR * MINUTES_PER_HOUR;

    const gridRowCell = Math.floor((this.startTime - earliestHourInMinutes) / MINUTES_PER_HOUR) + 1;

    // TODO: increase column start to 3 if overlapping
    let gridColumnStart = 2;
    addEvents.forEach(({startTime, endTime}) => {
      if (this.startTime < endTime && this.endTime > startTime) {
          gridColumnStart = 3;
      }
    })

    // Offset from top border: (e.g. 50% from top if start is at 4:30PM)
    const offsetTop = (100 * (this.startTime % MINUTES_PER_HOUR)) / MINUTES_PER_HOUR;

    // Height of cell is difference in time ranges in hours * height of a single cell
    const cellHeight = 100 * ((this.endTime - this.startTime) / MINUTES_PER_HOUR);

    return {
      gridRowStart: gridRowCell,
      gridColumn: `${gridColumnStart}/-1`,
      top: `${offsetTop}%`,
      height: `${cellHeight}%`,
    };
  }
}

const convertTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").slice(0,2).map(Number);
  const totalMinutes = hours*MINUTES_PER_HOUR + minutes;
  return totalMinutes;
}

export { convertTimeToMinutes }
