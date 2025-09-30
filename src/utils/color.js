import * as echarts from 'echarts/core'

export const LIGHT_CHART_COLORS = {
  textColor: 'rgba(0, 0, 0, 0.9)',
  placeholderColor: 'rgba(0, 0, 0, 0.35)',
  borderColor: '#dcdcdc',
  containerColor: '#fff'
}

export const DARK_CHART_COLORS = {
  textColor: 'rgba(255, 255, 255, 0.9)',
  placeholderColor: 'rgba(255, 255, 255, 0.35)',
  borderColor: '#5e5e5e',
  containerColor: '#242424'
}

// /** 图表颜色 */
export function getChartListColor(){
  const res = [
    '#d7f1ed',
    '#46CDBC',
    '#00a870',
    '#ebb105',
    '#ed7b2f',
    '#e34d59',
    '#ed49b4',
    '#834ec2'
  ]
  return res
}

// /**
//  * 更改图表主题颜色
//  *
//  * @export
//  * @param {Array<string>} chartsList
//  * @param {string} theme
//  */
export function changeChartsTheme(chartsList){
  if (chartsList && chartsList.length) {
    const chartChangeColor = getChartListColor()

    for (let index = 0; index < chartsList.length; index++) {
      const elementChart = chartsList[index]

      if (elementChart) {
        const optionVal = elementChart.getOption()

        // 更改主题颜色
        optionVal.color = chartChangeColor

        elementChart.setOption(optionVal, true)
      }
    }
  }
}
