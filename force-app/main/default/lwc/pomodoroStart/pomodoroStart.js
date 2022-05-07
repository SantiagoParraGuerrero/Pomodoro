import { LightningElement, wire } from 'lwc';
import getTasks from '@salesforce/apex/PomodoroController.getTasks';

export default class PomodoroStart extends LightningElement {
	get options() {
		return [
			{ label: '5', value: 5 },
			{ label: '10', value: 10 },
			{ label: '15', value: 15 },
			{ label: '20', value: 20 },
			{ label: '25', value: 25 },
			{ label: '30', value: 30 },
			{ label: '35', value: 35 },
			{ label: '40', value: 40 },
			{ label: '45', value: 45 },
			{ label: '50', value: 50 },
			{ label: '55', value: 55 },
			{ label: '60', value: 60 }
		]
	}

	openCreateTaskTab() {
		this.dispatchEvent(new CustomEvent('opencreatetasktab'))
	}

	@wire(getTasks)
	wiredTask

	get tasks() {
		if (!this.wiredTask.data?.length) return []

		return this.wiredTask.data.map(task => ({ label : task.Name, value: task.Id }))
	}
}

