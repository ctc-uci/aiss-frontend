import PlannedEvent from './PlannedEvent';

export function generateTimestamps() {
  const timeLabels = [];

  for (
    let hourIndex = PlannedEvent.EARLIEST_HOUR;
    hourIndex <= PlannedEvent.LATEST_HOUR;
    hourIndex++
  ) {
    const isPM = hourIndex >= 12;
    const hour12Format = hourIndex > 12 ? hourIndex - 12 : hourIndex;

    const newTime = `${hour12Format}:00 ${isPM ? 'PM' : 'AM'}`;
    timeLabels.push(newTime);
  }

  return timeLabels;
}

export function minutesInFormattedTime(minutes) {
  const hourIndex = Math.floor(minutes / MINUTES_PER_HOUR);
  const minuteAmount = minutes % MINUTES_PER_HOUR;

  const isPM = hourIndex >= 12;
  const hour12Format = hourIndex > 12 ? hourIndex - 12 : hourIndex;

  return `${hour12Format}:${minuteAmount < 10 ? '0' : ''}${minuteAmount} ${isPM ? 'PM' : 'AM'}`;
}

export const MINUTES_PER_HOUR = 60;
