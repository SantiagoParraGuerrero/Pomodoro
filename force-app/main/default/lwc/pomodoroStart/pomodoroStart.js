import { LightningElement, wire } from 'lwc'
import getTasks from '@salesforce/apex/PomodoroController.getTasks'

const DEFAULT_TARGET = '30'
const SECOND = 1000
const MINUTE = 60000
const DEFAULT_START = + DEFAULT_TARGET * MINUTE

export default class PomodoroStart extends LightningElement {

    selectedTarget = DEFAULT_TARGET

    counter = DEFAULT_START

    displayValue = this.millisToMinutesAndSeconds(this.counter)

	get options() {
		return [
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

    startCounting() {
        this.count()
    }

    count() {
        this.countDown = setInterval(() => {
            this.counter -= SECOND
            this.displayValue = this.millisToMinutesAndSeconds(this.counter)
        }, SECOND)
    }

    stopCount() {
        this.counter = DEFAULT_START
        this.displayValue = this.millisToMinutesAndSeconds(this.counter)
        clearInterval(this.countDown)
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