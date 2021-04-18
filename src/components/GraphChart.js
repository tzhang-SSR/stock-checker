import { Chart } from "react-google-charts";

export default function GraphChart({ dataPoints }) {
    return (
        <Chart
            width={'600px'}
            // height={'400px'}
            chartType="LineChart"
            loader={<div className="chart">Loading Chart</div>}
            data={[
                ['', '']
            ].concat(dataPoints)}
            options={{
                hAxis: {
                    title: '',
                },
                vAxis: {
                    title: '',
                },
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    )
}