import { toast } from 'react-toastify'

export const successNotification = (message: string) =>
  toast(message, { theme: 'dark', type: 'success' })

export const errorNotification = (message: string) =>
  toast(message, { theme: 'dark', type: 'error' })
