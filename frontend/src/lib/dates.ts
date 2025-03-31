export const datesValidator = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) {
    return true;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};
