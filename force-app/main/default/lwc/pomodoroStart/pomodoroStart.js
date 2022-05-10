import { LightningElement, wire } from 'lwc'
import { createRecord } from 'lightning/uiRecordApi'
import getTasks from '@salesforce/apex/PomodoroController.getTasks'

import POMODORO_OBJECT from '@salesforce/schema/Pomodoro__c'

import RELATEDTASK_FIELD from '@salesforce/schema/Pomodoro__c.PomodoroTask__c'
import TIMERECORDED_FIELD from '@salesforce/schema/Pomodoro__c.TimeRecorded__c'

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const DEFAULT_TARGET = '0.25'
const SECOND = 1000
const MINUTE = 60000
const DEFAULT_START = + DEFAULT_TARGET * MINUTE

export default class PomodoroStart extends LightningElement {

    selectedTarget = DEFAULT_TARGET

    selectedTask

    counter = DEFAULT_START

    displayValue = this.millisToMinutesAndSeconds(this.counter)

	get options() {
		return [
			{ label: '0.25', value: '0.25' },
			{ label: '5', value: '5' },
			{ label: '10', value: '10' },
			{ label: '15', value: '15' },
			{ label: '20', value: '20' },
			{ label: '25', value: '25' },
			{ label: DEFAULT_TARGET, value: DEFAULT_TARGET },
			{ label: '35', value: '35' },
			{ label: '40', value: '40' },
			{ label: '45', value: '45' },
			{ label: '50', value: '50' },
			{ label: '55', value: '55' },
			{ label: '60', value: '60' }
		]
	}

	@wire(getTasks)
	wiredTask

	get tasks() {
		if (!this.wiredTask?.data?.length) return []

		return this.wiredTask.data.map(task => ({ label : task.Name, value: task.Id }))
	}

    handleChange(e) {
        this.selectedTarget = e.detail.value
    }
    
    handleTaskChange(e) {
        debugger
        this.selectedTask = e.detail.value
    }

    startCounting() {
        this.count()
    }

    count() {
        this.countDown = setInterval(() => {
            this.counter -= SECOND
            this.displayValue = this.millisToMinutesAndSeconds(this.counter)
            if (this.counter < 0) {
                this.stopCount()
                this.saveRecord()
            }
        }, SECOND)
    }

    stopCount() {
        clearInterval(this.countDown)
        this.counter = DEFAULT_START
        this.displayValue = this.millisToMinutesAndSeconds(this.counter)
    }

    saveRecord() {
        debugger
        const fields = {
            [ RELATEDTASK_FIELD.fieldApiName ] : this.selectedTask,
            [ TIMERECORDED_FIELD.fieldApiName ] : this.selectedTarget
        }

        const recordInput = {
            apiName: POMODORO_OBJECT.objectApiName,
            fields
        }
        createRecord(recordInput)
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Pomodoro Completed',
                    message: `You've done it`,
                    variant: 'success'
                }))
            })
            .catch(e => {debugger})
    }

    pause

    pauseStop() {
        this.pause = !this.pause

        this.pause ? clearInterval(this.countDown) : this.count()
    }

    millisToMinutesAndSeconds(counter) {
        const minutes = Math.floor(counter / MINUTE)
        const seconds = ((counter % MINUTE) / SECOND).toFixed(0)
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
    }
}