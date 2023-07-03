import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import styles from './DatePicker.module.scss'
import {
  IDateCellItem,
  getPreviousMonthDays,
  getCurrentMonthDays,
  getNextMonthDays,
  getMinute,
  getDaysAmountInAMonth,
  months,
  daysOfTheWeek,
  addLeadingZeroIfNeeding,
  getInputValueFromDate,
  getDateFromInputValue, isToday
} from './utils'
import clsx from 'clsx';

interface IDatePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

function useLatest<T>(value: T) {
  const valueRef = useRef(value)

  useLayoutEffect(() => {
    valueRef.current = value
  }, [value])

  return valueRef
}


const DatePicker = ({value, onChange, min, max}: IDatePickerProps) => {
  const [showPopup, setShowPopup] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const elementRef = useRef<HTMLDivElement>(null)
  const latestInputValue = useLatest(inputValue)
  const latestValue = useLatest(value)

  useLayoutEffect(() => {
    setInputValue(getInputValueFromDate(value))
  }, [value])

  // outside click effect
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

      const dateFromInputValue = getDateFromInputValue(latestInputValue.current)
      if (dateFromInputValue) {
        onChange(dateFromInputValue)
      } else {
        setInputValue(getInputValueFromDate(latestValue.current))
      }
      setShowPopup(false)
    }

    document.addEventListener('click', onDocumentClick)

    return () => {
      document.removeEventListener('click', onDocumentClick)
    }

  }, [latestInputValue, latestValue])

  const handleChange = (value: Date) => {
    onChange(value)
    setShowPopup(false)
  }

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trim())
  }

  const onInputClick = () => {
    setShowPopup(true)
  }

  const inputValueDate = useMemo(() => {
    return getDateFromInputValue(inputValue)
  }, [inputValue])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') {
      return
    }

    const date = getDateFromInputValue(inputValue)

    if (!date) {
      setInputValue(getInputValueFromDate(value))
    } else {
      handleChange(date)
    }

    setShowPopup(false)
  }

  return (
    <div className={styles.datePicker}
         ref={elementRef}
    >
      <input value={inputValue}
             onChange={onInputValueChange}
             type="text"
             onClick={onInputClick}
             onKeyDown={onKeyDown}
      />

      {showPopup && (
        <div className={styles.popup}>
          <DatePickerPopupContent selectedValue={value}
                                  onChange={handleChange}
                                  min={min}
                                  max={max}
                                  inputValueDate={inputValueDate}
          />
        </div>
      )}

    </div>
  )
}


interface IDatePickerPopupContentProps {
  selectedValue: Date;
  inputValueDate?: Date;
  min?: Date;
  max?: Date;
  onChange: (value: Date) => void;
}

const DatePickerPopupContent = ({
                                  selectedValue,
                                  inputValueDate,
                                  onChange,
                                  min,
                                  max,
                                }: IDatePickerPopupContentProps) => {
  const [panelYear, setPanelYear] = useState(() => selectedValue.getFullYear())
  const [panelMonth, setPanelMonth] = useState(() => selectedValue.getMonth())
  const [panelDay, setPanelDay] = useState(() => selectedValue.getDate())
  const [panelHour, setPanelHour] = useState(() => selectedValue.getHours())
  const [panelMinute, setPanelMinute] = useState(() => selectedValue.getMinutes())
  const todayDate = useMemo(() => new Date(), [])

  useLayoutEffect(() => {
    if (!inputValueDate) {
      return
    }

    setPanelMonth(inputValueDate.getMonth())
    setPanelYear(inputValueDate.getFullYear())
    setPanelDay(inputValueDate.getDate())
  }, [inputValueDate])

  const [year, month, day, hour, minute] = useMemo(() => {
    const currentYear = selectedValue.getFullYear()
    const currentMonth = selectedValue.getMonth()
    const currentDay = selectedValue.getDate()
    const currentHour = selectedValue.getHours()
    const currentMinute = selectedValue.getMinutes()

    return [currentYear, currentMonth, currentDay, currentHour, currentMinute]
  }, [selectedValue])

  const dateCells = useMemo(() => {

    const daysInMonth = getDaysAmountInAMonth(panelYear, panelMonth)

    const currentMonthDays = getCurrentMonthDays(panelYear, panelMonth, daysInMonth)

    const prevMonthDays = getPreviousMonthDays(panelYear, panelMonth)
    const nextMonthDays = getNextMonthDays(panelYear, panelMonth)

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }, [panelYear, panelMonth])

  const onDateSelect = (item: IDateCellItem) => {
    console.log(item.year, item.month, item.date)
    onChange(new Date(item.year, item.month, item.date))
  }

  const nextYear = () => {
    setPanelYear(panelYear + 1)
  }

  const prevYear = () => {
    setPanelYear(panelYear - 1)
  }

  const nextMonth = () => {
    if (panelMonth === 11) {
      setPanelMonth(0)
      setPanelYear(panelYear + 1)
    } else {
      setPanelMonth(panelMonth + 1)
    }
  }

  const prevMonth = () => {
    if (panelMonth === 0) {
      setPanelMonth(11)
      setPanelYear(panelYear - 1)
    } else {
      setPanelMonth(panelMonth - 1)
    }
  }

  return (
    <div>
      DatePicker
      <div>
        {panelDay} {months[panelMonth]} {panelYear}
      </div>
      <div>
        Выбранная
        дата: {addLeadingZeroIfNeeding(day)} {addLeadingZeroIfNeeding(month)} {year} {hour}:{addLeadingZeroIfNeeding(minute)}
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={prevYear}>Prev Year</button>
        <button className={styles.button} onClick={prevMonth}>Prev Month</button>
        <button className={styles.button} onClick={nextMonth}>Next Month</button>
        <button className={styles.button} onClick={nextYear}>Next Year</button>
      </div>
      <div className={styles.calendar}>
        {daysOfTheWeek.map(weekDay => (
          <div key={weekDay} className={styles.calendarPanelItem}>{weekDay}</div>
        ))}
        {dateCells.map(cell => {
          const isSelectedDay = cell.year === year && cell.month === month && cell.date === day
          const isTodayDate = isToday(todayDate, cell)
          const isNotCurrent = cell.type !== 'current'
          return (
            <div key={`${cell.date}-${cell.month}-${cell.year}`}
                 className={clsx(
                   styles.calendarPanelItem,
                   isSelectedDay && styles.calendarPanelItemSelected,
                   isTodayDate && styles.calendarPanelItemToday,
                   isNotCurrent && styles.calendarPanelItemNotCurrent,
                 )}
                 onClick={() => onDateSelect(cell)}
            >
              <div className={styles.calendarPanelItemDate}>
                {cell.date}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default DatePicker;
