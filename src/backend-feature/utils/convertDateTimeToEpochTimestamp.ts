export function convertDateTimeToEpochTimestamp(dateTime: Date): number {
  return new Date(dateTime).getTime() / 1000;
}
