import getData from '@salesforce/apex/PomodoroController.getData'
import CHARTS_DATA_CHANNEL from '@salesforce/messageChannel/ChartsData__c'
import { MessageContext, publish } from 'lightning/messageService'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { LightningElement, wire } from 'lwc'
const MIN_NUMBER_DAYS = 15
const MAX_NUMBER_DAYS = 365
const ONE_SECOND = 1000

export default class PomodoroNumberOfDaysPicker extends LightningElement {
    maxNumberOfDays = MAX_NUMBER_DAYS
    minNumberOfDays = MIN_NUMBER_DAYS
    numberOfDays = MIN_NUMBER_DAYS

    @wire(MessageContext)
    messageContext


    @wire(getData, { numberOfDays: '$numberOfDays' })
    wiredData({ error, data }) {
        if (data) {
            debugger
            const payload = { data }
            publish(this.messageContext, CHARTS_DATA_CHANNEL, payload)
        } else if (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'error',
                message: JSON.stringify(error),
                variant: 'error'
            }));
        }
    }

    timeout
    handleNumberOfDaysChange(event) {
        clearTimeout(this.timeout)
        const value = event.target.value
        this.timeout = setTimeout(() => {
            this.numberOfDays = + value
        }, ONE_SECOND);
    }
}