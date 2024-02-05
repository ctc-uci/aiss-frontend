import { MINUTES_PER_HOUR } from './chrono';

export default class PlannedEvent {
  static EARLIEST_HOUR = 6; // 6:00 AM (6:00 military)
  static LATEST_HOUR = 22; // 10:00 PM (22:00 military time)
  id; // string
  name; // string
  startTime; // number (minutes since midnight - e.g. 60 * 10 = 10AM)
  endTime; // number (minutes since midnight - e.g. 60 * 10 = 10AM)
  isTentative; // boolean

  constructor(id, name, startTime, endTime, isTentative = false) {
    this.id = id;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.isTentative = isTentative;
  }

  calculateGridStyles() {
    const earliestHourInMinutes = PlannedEvent.EARLIEST_HOUR * MINUTES_PER_HOUR;

    const gridRowCell = Math.floor((this.startTime - earliestHourInMinutes) / MINUTES_PER_HOUR) + 1;

    // TODO: increase column start to 3 if overlapping
    const gridColumnStart = 2;

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
