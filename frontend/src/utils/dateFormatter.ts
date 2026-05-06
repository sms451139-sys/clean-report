export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`
}
