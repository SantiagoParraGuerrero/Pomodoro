import { LightningElement, wire } from 'lwc'
import { loadScript } from 'lightning/platformResourceLoader'
import chartJs from '@salesforce/resourceUrl/chartjs_v280'
import { subscribe, unsubscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService'
import CHARTS_DATA_CHANNEL from '@salesforce/messageChannel/ChartsData__c'

const MIN_NUMBER_DAYS = 15
const MAX_NUMBER_DAYS = 365
const DEFAULT_PERIOD = 1
const MINUTES_TO_HOURS = 60
const SLOPE = (MIN_NUMBER_DAYS - DEFAULT_PERIOD ) / (MAX_NUMBER_DAYS - DEFAULT_PERIOD)
const CHART_CONFIG = {
    type: 'line',
    data: {
        datasets: [
            {
                backgroundColor: 'rgb(1, 118, 211)',
                borderColor: 'rgb(1, 118, 211)',
                borderDash: [5, 5],
                label: 'Average',
                pointRadius: 1
            },
            {
                backgroundColor: 'rgb(69, 198, 90)',
                borderColor: 'rgb(69, 198, 90)',
                fill: true,
                pointRadius: 1,
                tension: 0.3
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                position: 'top'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Day'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Hours'
                }
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
}

export default class DailyAveragePomodoroGraph extends LightningElement {
    numberOfDays = null
    period = DEFAULT_PERIOD
    context
    chart
    subscription = null

    @wire(MessageContext)
    messageContext

    subscribeToMessageChannel() {
        if (this.subscription) return

        this.subscription = subscribe(
            this.messageContext,
            CHARTS_DATA_CHANNEL,
            payload => this.buildChart(payload),
            { scope: APPLICATION_SCOPE }
        )
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        unsubscribe(this.subscription)

        this.subscription = null
    }

    renderedCallback() {
        this.loadChartJsScript()
    }

    loadChartJsScript() {
        if (this.chartjsInitialized) return;
        this.chartjsInitialized = true;

        Promise.resolve(loadScript(this, chartJs))
            .then(() => {
                const canvas = document.createElement('canvas')
                this.template.querySelector('div.chart').appendChild(canvas)
                const ctx = canvas.getContext('2d')
                this.context = ctx
            })
            .catch((error) => {
                this.error = error
            });
    }

    buildChart({ data }) {
        const { averageData, numberOfDays } = data;
        const dailyAverageInteger = data.dailyAverageInteger / MINUTES_TO_HOURS
        if (!(this.chartjsInitialized && averageData)) return

        this.period = Math.floor(SLOPE * (numberOfDays - DEFAULT_PERIOD) + DEFAULT_PERIOD)

        const newData = this.formatUsingAverages(averageData)
        const [ averageLine, dataLine ] = CHART_CONFIG.data.datasets

        CHART_CONFIG.data.labels = [...Array(newData.length).keys()]
            .map(label => label * this.period)

        averageLine.data = newData.map(() => dailyAverageInteger)
        dataLine.data = newData
        dataLine.label = `${this.period} Days`

        if (!!this.chart) this.chart.destroy()

        this.chart = new window.Chart(this.context, CHART_CONFIG)
    }

    formatUsingAverages(chartData) {
        const data = chartData.map(e => e.dailySum / MINUTES_TO_HOURS)

        if (this.period === 1) return data

        const result = []
        let newElement = 0

        for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const indexPlusOne = i + 1
            newElement += point
            if (indexPlusOne % this.period === 0) {
                result.push(newElement / this.period)
                newElement = 0
            }
        }

        debugger
        return result
    }
}