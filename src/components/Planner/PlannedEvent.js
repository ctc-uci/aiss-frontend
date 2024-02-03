export class PlannedEvent {
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
}
