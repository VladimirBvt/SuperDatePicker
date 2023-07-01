import {useEffect, useMemo, useRef, useState} from "react";
import styles from './DatePicker.module.scss'
import {IDateCellItem,
  getPreviousMonthDays,
  getCurrentMonthDays,
  getNextMonthDays,
  getMinute,
  getDaysAmountInAMonth,
  months,
  daysOfTheWeek} from './utils'

interface IDatePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}


const DatePicker = ({ value, onChange, min, max }: IDatePickerProps) => {
  const [showPopup, setShowPopup] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current

    if (!element) return

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      if (element.contains(target)) {
        return;
      }

      setShowPopup(false)
    }

    document.addEventListener('click', onDocumentClick)

    return () => {
      document.removeEventListener('click', onDocumentClick)
    }

  }, [])

  const onFocus = () => {
    setShowPopup(true)
  }

  return (
    <div className={styles.datePicker}
         ref={elementRef}
    >
      <input type="text" onFocus={onFocus} />

      {showPopup && (
        <div className={styles.popup}>
          <DatePickerPopupContent value={value}
                                  onChange={onChange}
                                  min={min}
                                  max={max}
          />
      </div>
      )}

    </div>
  )
}

const DatePickerPopupContent = ({ value, onChange, min, max }: IDatePickerProps) => {
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

  return (
    <div>
      DatePicker
      <div>
        {months[fieldMonth]} {fieldYear}
      </div>
      <div>
        Выбранная дата: {day} {month} {year} {hour}:{getMinute(minute)}
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
