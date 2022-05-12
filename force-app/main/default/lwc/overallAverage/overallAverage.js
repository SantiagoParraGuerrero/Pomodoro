import { LightningElement, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService'
import CHARTS_DATA_CHANNEL from '@salesforce/messageChannel/ChartsData__c'

export default class OverallAverage extends LightningElement {

    average

    @wire(MessageContext)
    messageContext

    subscription = null

    subscribeToMessageChannel() {
        if (this.subscription) return

        this.subscription = subscribe(
            this.messageContext,
            CHARTS_DATA_CHANNEL,
            payload => this.handleChange(payload.data.dailyAverage),
            { scope: APPLICATION_SCOPE }
        )
    }

    connectedCallback() {
        this.subscribeToMessageChannel()
    }

    disconnectedCallback() {
        unsubscribe(this.subscription)

        this.subscription = null
    }

    handleChange(average) {
        this.average = average
    }
}