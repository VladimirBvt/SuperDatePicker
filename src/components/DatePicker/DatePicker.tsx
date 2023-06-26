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

const daysOfTheWeek = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun'
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

  for (let i = prevMonthCellsAmount - 1; i >= 0; i --) {
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
    const currentMonth = value.getMonth()
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

  const onDateSelect = (item: IDateCellItem) => {
    onChange(new Date(item.year, item.month, item.date))
  }

  const nextYear = () => {
    setFieldYear(fieldYear + 1)
  }

  const prevYear = () => {
    setFieldYear(fieldYear - 1)
  }

  const nextMonth = () => {
    if (fieldMonth === 11) {
      setFieldMonth(0)
      setFieldYear(fieldYear + 1)
    } else {
      setFieldMonth(fieldMonth + 1)
    }
  }

  const prevMonth = () => {
    if (fieldMonth === 0) {
      setFieldMonth(11)
      setFieldYear(fieldYear - 1)
    } else {
      setFieldMonth(fieldMonth - 1)
    }
  }

  const getMinute = (minute: number) => {
    if (minute < 10) {
      return `0${minute}`
    } else {
      return minute
    }
  }

  return (
    <div>
      DatePicker
      <div>
        Сейчас {day} {month} {year} {hour}:{getMinute(minute)}
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={prevYear}>Prev Year</button>
        <button className={styles.button} onClick={prevMonth}>Prev Month</button>
        <button className={styles.button} onClick={nextMonth}>Next Month</button>
        <button className={styles.button} onClick={nextYear}>Next Year</button>
      </div>
      <div className={styles.calendar}>
        {daysOfTheWeek.map(weekDay => (
          <div key={weekDay} className={styles.date}>{weekDay}</div>
        ))}
        {dateCells.map(cell => {
          const isCurrentDay = cell.year === year && cell.month === month && cell.date === day
          return (
            <div key={`${cell.date}-${cell.month}-${cell.year}`}
                 className={isCurrentDay ? styles.dateCurrent : styles.date}
                 onClick={() => onDateSelect(cell)}
            >
            {cell.date}
          </div>
          )
        })}
      </div>
    </div>
  );
};

export default DatePicker;
