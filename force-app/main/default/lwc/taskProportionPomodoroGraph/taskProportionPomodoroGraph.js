import { LightningElement, wire } from 'lwc'
import { loadScript } from 'lightning/platformResourceLoader'
import chartJs from '@salesforce/resourceUrl/chartjs_v280'
import { subscribe, unsubscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService'
import CHARTS_DATA_CHANNEL from '@salesforce/messageChannel/ChartsData__c'

const MIN_NUMBER_DAYS = 15
const MAX_NUMBER_DAYS = 365
const DEFAULT_PERIOD = 1
const MINUTES_TO_HOURS = 60

const xd = {
    labels: ['1','2', '3','4'],
    datasets: [
        {
            backgroundColor: ['#AAA', '#777'],
            data: [21, 79]
        },
        {
            backgroundColor: ['hsl(0, 100%, 60%)', 'hsl(0, 100%, 35%)'],
            data: [33, 67]
        },
    ]
};
const CHART_CONFIG = {
    type: 'pie',
    data: xd,
    options: {
        responsive: true,
        plugins: {
            legend: {
            labels: {
                generateLabels: function(chart) {
                // Get the default label list
                const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                const labelsOriginal = original.call(this, chart);
    
                // Build an array of colors used in the datasets of the chart
                var datasetColors = chart.data.datasets.map(function(e) {
                    return e.backgroundColor;
                });
                datasetColors = datasetColors.flat();
    
                // Modify the color and hide state of each label
                labelsOriginal.forEach(label => {
                    // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
                    label.datasetIndex = (label.index - label.index % 2) / 2;
    
                    // The hidden state must match the dataset's hidden state
                    label.hidden = !chart.isDatasetVisible(label.datasetIndex);
    
                    // Change the color to match the dataset
                    label.fillStyle = datasetColors[label.index];
                });
    
                return labelsOriginal;
            }
            },
            onClick: function(mouseEvent, legendItem, legend) {
                // toggle the visibility of the dataset from what it currently is
                legend.chart.getDatasetMeta(
                    legendItem.datasetIndex
                ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
                legend.chart.update();
            }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const labelIndex = (context.datasetIndex * 2) + context.dataIndex;
                        return context.chart.data.labels[labelIndex] + ': ' + context.formattedValue;
                    }
                }
            }
        }
        },
    };

export default class TaskProportionPomodoroGraph extends LightningElement {
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
                this.chart = new window.Chart(this.context, CHART_CONFIG)

            })
            .catch((error) => {
                this.error = error
            });
    }

    buildChart({ data }) {
        // const { averageData, numberOfDays } = data;
        // const dailyAverageInteger = data.dailyAverageInteger / MINUTES_TO_HOURS
        // if (!(this.chartjsInitialized && averageData)) return

        // this.period = Math.floor(SLOPE * (numberOfDays - DEFAULT_PERIOD) + DEFAULT_PERIOD)

        // const newData = this.formatUsingAverages(averageData)
        // const [ averageLine, dataLine ] = CHART_CONFIG.data.datasets

        // CHART_CONFIG.data.labels = [...Array(newData.length).keys()]
        //     .map(label => label * this.period)

        // averageLine.data = newData.map(() => dailyAverageInteger)
        // dataLine.data = newData
        // dataLine.label = `${this.period} Days`

        // if (!!this.chart) this.chart.destroy()

        // this.chart = new window.Chart(this.context, CHART_CONFIG)
    }

    formatUsingAverages(chartData) {
        // const data = chartData.map(e => e.dailySum / MINUTES_TO_HOURS)

        // if (this.period === 1) return data

        // const result = []
        // let newElement = 0

        // for (let i = 0; i < data.length; i++) {
        //     const point = data[i];
        //     const indexPlusOne = i + 1
        //     newElement += point
        //     if (indexPlusOne % this.period === 0) {
        //         result.push(newElement / this.period)
        //         newElement = 0
        //     }
        // }

        // debugger
        // return result
    }
}