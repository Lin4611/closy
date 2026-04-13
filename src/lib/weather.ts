export const getWeatherIconUrl = (weatherCode: string, isDay = true) => {
  const timeOfDay = isDay ? 'day' : 'night'
  return `https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${timeOfDay}/${weatherCode}.svg`
}

export const isDaytime = () => {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18
}
