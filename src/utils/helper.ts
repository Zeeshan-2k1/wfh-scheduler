import { EMAIL_VALIDATE_REGEX } from './constants'

export type WeekDayWithDate = {
  day: string
  date: string
}

export const getCurrentWeekDaysWithDates = (
  limit: number = 7,
  abbr: boolean = false
): WeekDayWithDate[] => {
  const today = new Date()
  const startOfWeek = new Date(
    today.setDate(today.getDate() - today.getDay() + 1)
  )
  const weekDaysWithDates: WeekDayWithDate[] = []

  for (let i = 0; i < limit; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    weekDaysWithDates.push({
      day: date.toLocaleDateString('en-US', {
        weekday: abbr ? 'short' : 'long',
      }),
      date: abbr
        ? date.toISOString().split('T')[0].slice(-2)
        : date.toISOString().split('T')[0],
    })
  }

  return weekDaysWithDates
}

export function shuffleList(list: string[]): string[] {
  const shuffledList = [...list]

  for (let i = shuffledList.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))

    ;[shuffledList[i], shuffledList[randomIndex]] = [
      shuffledList[randomIndex],
      shuffledList[i],
    ]
  }

  return shuffledList
}

export const validateUserInput = (
  name: string | null,
  email: string | null
): boolean => {
  return (
    typeof name === 'string' &&
    name.length >= 3 &&
    typeof email === 'string' &&
    EMAIL_VALIDATE_REGEX.test(email)
  )
}

export function getDayName(dayIndex: number): string {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]
  if (dayIndex < 0 || dayIndex > 6) {
    throw new Error(
      'Invalid day index. Please provide a number between 0 and 6.'
    )
  }
  return days[dayIndex]
}
