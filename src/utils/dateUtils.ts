import { format, addMonths, addWeeks } from 'date-fns';

export const calculatePayoutDate = (
  startDate: string | Date,
  cycleIndex: number,
  frequency: string
) => {
  const start = new Date(startDate);
  let payoutDate = start;

  if (frequency === 'MONTHLY') {
    payoutDate = addMonths(start, cycleIndex);
  } else if (frequency === 'WEEKLY') {
    payoutDate = addWeeks(start, cycleIndex);
  } else if (frequency === 'BI-WEEKLY') {
    payoutDate = addWeeks(start, cycleIndex * 2);
  }

  return format(payoutDate, 'MMM dd, yyyy');
};
