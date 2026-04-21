const calendarDashedDatePattern = /^\d{4}-\d{2}-\d{2}$/
const calendarSlashedDatePattern = /^\d{4}\/\d{2}\/\d{2}$/

const isValidCalendarDateParts = (year: number, month: number, day: number) => {
  const candidate = new Date(Date.UTC(year, month - 1, day))

  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  )
}

const parseCalendarDateParts = (value: string, separator: '-' | '/') => {
  const [yearText, monthText, dayText] = value.split(separator)
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null
  }

  if (!isValidCalendarDateParts(year, month, day)) {
    return null
  }

  return { year, month, day }
}

export const isCalendarDashedDate = (value: string) => {
  return calendarDashedDatePattern.test(value) && parseCalendarDateParts(value, '-') !== null
}

export const isCalendarSlashedDate = (value: string) => {
  return calendarSlashedDatePattern.test(value) && parseCalendarDateParts(value, '/') !== null
}

export const toCalendarDashedDate = (value: string) => {
  if (isCalendarDashedDate(value)) {
    return value
  }

  if (!isCalendarSlashedDate(value)) {
    throw new Error('行事曆日期格式錯誤')
  }

  return value.replaceAll('/', '-')
}

export const toCalendarSlashedDate = (value: string) => {
  if (isCalendarSlashedDate(value)) {
    return value
  }

  if (!isCalendarDashedDate(value)) {
    throw new Error('行事曆日期格式錯誤')
  }

  return value.replaceAll('-', '/')
}
