function format (date, format) {
  if (!date) {
    return ''
  }

  const d = new Date(date)

  // 年
  if (/YYYY/.test(format)) {
    format = format.replace(/YYYY/, d.getFullYear())
  }
  // 月份
  const month = d.getMonth() + 1
  if (/MM/.test(format)) {
    const monthStr = month < 10 ? '0' + month : month
    format = format.replace(/MM/, monthStr)
  } else if (/M/.test(format)) {
    format = format.replace(/M/, month)
  }
  // 日期
  const dates = d.getDate()
  if (/DD/.test(format)) {
    const dateStr = dates < 10 ? '0' + dates : dates
    format = format.replace(/DD/, dateStr)
  } else if (/D/.test(format)) {
    format = format.replace(/D/, dates)
  }
  // 小时
  const hours = d.getHours()
  if (/HH/.test(format)) {
    const hoursStr = hours < 10 ? '0' + hours : hours
    format = format.replace(/HH/, hoursStr)
  } else if (/H/.test(format)) {
    format = format.replace(/H/, hours)
  } else if (/hh/.test(format)) {
    const hoursMin = hours > 12 ? hours - 12 : hours
    const hoursStr = hoursMin < 10 ? '0' + hoursMin : hoursMin
    format = format.replace(/hh/, hoursStr)
  } else if (/h/.test(format)) {
    const hoursMin = hours > 12 ? hours - 12 : hours
    format = format.replace(/h/, hoursMin)
  }
  // 分
  const minutes = d.getMinutes()
  if (/mm/.test(format)) {
    const minutesStr = minutes < 10 ? '0' + minutes : minutes
    format = format.replace(/mm/, minutesStr)
  } else if (/m/.test(format)) {
    format = format.replace(/m/, minutes)
  }
  // 秒
  const seconds = d.getSeconds()
  if (/ss/.test(format)) {
    const secondsStr = seconds < 10 ? '0' + seconds : seconds
    format = format.replace(/ss/, secondsStr)
  } else if (/s/.test(format)) {
    format = format.replace(/s/, seconds)
  }
  return format
}

export default format
