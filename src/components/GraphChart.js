import { Chart } from "react-google-charts";

export default function GraphChart({ dataPoints }) {
    return (
        <Chart
            width={'600px'}
            height={'400px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={[
                ['x', 'Closing Prices']
            ].concat(dataPoints)}
            options={{
                hAxis: {
                    title: '',
                },
                vAxis: {
                    title: 'Sotck Price',
                },
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    )
}