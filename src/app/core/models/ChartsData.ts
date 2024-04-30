export class PieChartsData {
    id !: number;
    name !: string;
    value !: number;
}

export class LineChartsData {
    name !: string;
    series !: LineChartDataSeries[];
}

export class LineChartDataSeries {
    value !: number;
    name !: string;
}

