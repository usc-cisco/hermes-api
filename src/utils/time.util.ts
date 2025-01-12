export const getJwtExpiry = (queueStartTime: string, queueEndTime: string): number => {
  const [startHours, startMinutes] = queueStartTime.split(':').map(Number);
  const [endHours, endMinutes] = queueEndTime.split(':').map(Number);

  const currentTime = new Date();

  // calculate start time and end time in milliseconds (compared to current day)
  const startMillis = new Date(currentTime).setHours(startHours, startMinutes, 0, 0);
  const endMillis = new Date(currentTime).setHours(endHours, endMinutes, 0, 0);

  if (currentTime.getTime() < startMillis) {
    return 0;
  }
  // convert to seconds
  const remainingTime = (endMillis - currentTime.getTime()) / 1000; 
  // condition to avoid time format error in case its passed the end time
  return remainingTime > 0 ? remainingTime : 0;
}