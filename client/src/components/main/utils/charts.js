import React from 'react'
import CanvasJSReact from '../../../styles/canvasjs.react'
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
/**
 * @param {title} - is the title of the chart 
 * @param {data_points} - should be array of objects: { y: number, label: string} 
 * 
 */
export const StatisticsPieChart = ({title, data_points, theme, startAngle, label_suffix}) => {	
    if (!startAngle) {
        startAngle = -90
    }
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: theme, // "light1", "dark1", "dark2"
        title:{
            text: title
        },
        data: [{
            type: "pie",
            indexLabel: label_suffix ? "{label}: {y}"+`${label_suffix}`: "{label}: {y}",		
            startAngle: startAngle,
            dataPoints: data_points
        }]
    }
    return (
    <div>
        <CanvasJSChart options = {options} 
            /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
    </div>
    );
}