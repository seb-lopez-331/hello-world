import { React, useState } from 'react';
import '../../style/DateRangePicker.css';
import { DateRangePicker } from 'react-date-range';
import { enUS } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';

const DateRangePickerComponent = () => {
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleChange = (ranges) => {
    setDate(ranges.selection);
  };

  const handleClick = () => {
    setOpenDate(!openDate);
  };

  return (
    <>
      {/*Change this into a calendar icon using react-icons*/}
      <span onClick={handleClick} className="calendar">
        {
          openDate ? 'CONFIRM SELECTION' : `${format(date.startDate, 'MMM,dd,yyyy')} to ${format(date.endDate, 'MMM,dd,yyyy')}`
        }
      </span>
      {openDate && <DateRangePicker
        className="dateRange"
        locale={ enUS }
        ranges={[date]}
        onChange={handleChange}
      />}
    </>
  );
};

export default DateRangePickerComponent;