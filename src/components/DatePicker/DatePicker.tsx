import {useMemo, useState} from "react";
import styles from './DatePicker.module.scss'

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
  date: number;
  month: number;
  year: number;

  isToday?: boolean;
  isSelected?: boolean;
}

const getDaysAmountInAMonth = (year: number, month: number) => {
  const nextMonthDate = new Date(year, month + 1, 1)
  nextMonthDate.setMinutes(-1)
  return nextMonthDate.getDate()
}

const getPreviousMonthDays = (year: number, month: number) => {
  const currentMonthFirstDay = new Date(year, month, 1)
  const dayOfTheWeek = currentMonthFirstDay.getDay()
  // сколько нужно взять дней из предыдущего месяца
  const prevMonthCellsAmount = dayOfTheWeek -1

  // количество дней в предыдущем месяце
  const daysAmountInPrevMonth = getDaysAmountInAMonth(year, month -1)

  const dateCells: IDateCellItem[] = []

  const [cellYear, cellMonth] = month === 0 ? [year -1, 11] : [year, month -1]

  for (let i = 0; i < prevMonthCellsAmount; i ++) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      date: daysAmountInPrevMonth - i,
    })
  }

  return dateCells
}

const VISIBLE_CELLS_AMOUNT = 7 * 6

const getNextMonthDays = (year: number, month: number) => {
  //
  const currentMonthFirstDay = new Date(year, month, 1)
  const dayOfTheWeek = currentMonthFirstDay.getDay()
  const prevMonthCellsAmount = dayOfTheWeek -1
  //

  const daysAmount = getDaysAmountInAMonth(year, month)

  const nextMonthDays = VISIBLE_CELLS_AMOUNT - daysAmount - prevMonthCellsAmount

  const [cellYear, cellMonth] = month === 11 ? [year +1, 0] : [year, month +1]

  const dateCells: IDateCellItem[] = []

  for (let i = 1; i <= nextMonthDays; i ++) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      date: i,
    })
  }

  return dateCells
}

const getCurrentMonthDays = (year: number, month: number, numberOfDays: number) => {
  const dateCells: IDateCellItem[] = []

  for (let i = 1; i <= numberOfDays; i ++) {
    dateCells.push({
      year,
      month,
      date: i,
    })
  }

  return dateCells
}


const DatePicker = ({ value, onChange, min, max }: IDatePickerProps) => {
  const [fieldYear, setFieldYear] = useState(() => value.getFullYear())
  const [fieldMonth, setFieldMonth] = useState(() => value.getMonth())
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

    const daysInMonth = getDaysAmountInAMonth(fieldYear, fieldMonth)

    const currentMonthDays = getCurrentMonthDays(fieldYear, fieldMonth, daysInMonth)

    const prevMonthDays = getPreviousMonthDays(fieldYear, fieldMonth)
    const nextMonthDays = getNextMonthDays(fieldYear, fieldMonth)

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }, [fieldYear, fieldMonth])

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
      <div>
        {day} {month} {year} {hour}:{minute}
      </div>
      <div className={styles.calendar}>
        {dateCells.map(cell => {

          return <div className={styles.date}>{cell.date}</div>
        })}
      </div>
    </div>
  );
};

export default DatePicker;
