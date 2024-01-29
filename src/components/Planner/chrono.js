export const generateTimestamps = () => {
  // Range of timeline from 6AM - 10PM
  const EARLIEST_HOUR = 6;
  const LATEST_HOUR = 22;

  const timeLabels = [];

  for (let hourIndex = EARLIEST_HOUR; hourIndex <= LATEST_HOUR; hourIndex++) {
    const isPM = hourIndex >= 12;
    const hour12Format = hourIndex > 12 ? hourIndex - 12 : hourIndex;

    const newTime = `${hour12Format}:00 ${isPM ? 'PM' : 'AM'}`;
    timeLabels.push(newTime);
  }

  return timeLabels;
};
