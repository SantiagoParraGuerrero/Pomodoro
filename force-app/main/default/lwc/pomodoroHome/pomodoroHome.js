import { LightningElement } from 'lwc';

export default class PomodoroHome extends LightningElement {
	
	activeTabValue = 'pomodoro'
	openCreateTaskTab() {
		this.activeTabValue = 'createTask'
	}
}