const QueueExpiry = Number(process.env.QUEUE_EXPIRY);
const QueueHourStart = Number(process.env.QUEUE_HRSTART);
const QueueMinStart = Number(process.env.QUEUE_MINSTART);

/** Validates If the time is between 0 and the queue start time**/
const ValidateTime = 
  new Date().getHours() >= QueueHourStart
  && (new Date().getHours() > QueueHourStart || new Date().getMinutes() >= QueueMinStart)
  ? new Date().getHours() : QueueExpiry;

export const remainingTime = QueueExpiry - ValidateTime;