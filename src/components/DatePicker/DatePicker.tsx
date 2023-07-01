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
  daysOfTheWeek, getValueWithZero, getInputValueFromDate, isValidDateString
} from './utils'

interface IDatePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}




const DatePicker = ({value, onChange, min, max}: IDatePickerProps) => {
  const [showPopup, setShowPopup] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')

  useLayoutEffect(() => {
    setInputValue(getInputValueFromDate(value))
  }, [value])

  // const inputValue = useMemo(() => {
  //   const date = getValueWithZero(value.getDate())
  //   const month = getValueWithZero(value.getMonth())
  //   const year = value.getFullYear()
  //
  //   return `${date}-${month}-${year}`
  // }, [value])

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

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trim())
  }

  const onFocus = () => {
    setShowPopup(true)
  }

  const updateValueFromInputValue = () => {
    if (!isValidDateString(inputValue)) {
      return
    }

    const [date, month, year] = inputValue.split('-').map(v => parseInt(v, 10))

    const dateObj = new Date(year, month - 1, date)

    onChange(dateObj)
  }

  const inputValueDate = useMemo(() => {
    if (!isValidDateString(inputValue)) {
      return
    }

    const [date, month, year] = inputValue.split('-').map(v => parseInt(v, 10))

    const dateObj = new Date(year, month - 1, date)

    return dateObj
  }, [inputValue])

  const onBlur = () => {
    updateValueFromInputValue()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') {
      return
    }

    updateValueFromInputValue()
  }

  return (
    <div className={styles.datePicker}
         ref={elementRef}
    >
      <input value={inputValue}
             onChange={onInputValueChange}
             type="text"
             onFocus={onFocus}
             onBlur={onBlur}
             onKeyDown={onKeyDown}
      />

      {showPopup && (
        <div className={styles.popup}>
          <DatePickerPopupContent selectedValue={value}
                                  onChange={onChange}
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
        Выбранная дата: {getValueWithZero(day)} {getValueWithZero(month)} {year} {hour}:{getValueWithZero(minute)}
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
