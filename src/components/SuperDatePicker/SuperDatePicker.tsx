import DatePicker from "../DatePicker/DatePicker";
import {useState} from "react";

const SuperDatePicker = () => {

  const [date, setDate] = useState(() => new Date())

  console.log(date)

  return (
    <div>

      <DatePicker value={date} onChange={setDate} />
    </div>
  );
};

export default SuperDatePicker;
