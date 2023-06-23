import {useMemo, useState} from "react";

interface IDatePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dec'
]

interface IDateCellItem {
  day: number;
  month: number;
  year: number;

  isToday: boolean;
  isSelected: boolean;
}

const getNumberOfDaysInAMonth = (year: number, month: number) => {
  const nextMonthDate = new Date(year, month + 1, 1)
  const lastDayInMonth = nextMonthDate.setMinutes(-1)
  return new Date(lastDayInMonth)
}


const DatePicker = ({ value, onChange, min, max }: IDatePickerProps) => {
  const [fieldYear, setFieldYear] = useState(() => value.getFullYear())
  const [fieldMont, setFieldMont] = useState(() => value.getMonth())
  const [fieldDay, setFieldDay] = useState(() => value.getDate())
  const [fieldHour, setFieldHour] = useState(() => value.getHours())
  const [fieldMinute, setFieldMinute] = useState(() => value.getMinutes())

  const [year, month, day, hour, minute] = useMemo(() => {
    const currentYear = value.getFullYear()
    const currentMonth = months[value.getMonth()]
    const currentDay = value.getDate()
    const currentHour = value.getHours()
    const currentMinute = value.getMinutes()

    return [currentYear, currentMonth, currentDay, currentHour, currentMinute]
  }, [value])

  const dateCells = useMemo(() => {
    const items: IDateCellItem[] = []

    const fieldDate = new Date(fieldYear, fieldMont, 1, fieldHour, fieldMinute)

    return items
  }, [fieldYear, fieldMont])

  const nextYear = () => {

  }

  const prevYear = () => {

  }

  const nextMonth = () => {

  }

  const prevMonth = () => {

  }

  return (
    <div>
      DatePicker
      <div>{day} {month} {year} {hour}:{minute}</div>
    </div>
  );
};

export default DatePicker;
