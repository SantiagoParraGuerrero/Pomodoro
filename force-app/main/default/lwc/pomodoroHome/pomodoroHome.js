import { LightningElement } from 'lwc';

export default class PomodoroHome extends LightningElement {
    
    activeTabValue = 'pomodoro'

    openCreateTaskTab(event) {
        event.stopPropagation()
        this.activeTabValue = 'createTask'
    }

    handleActive(event) {
        event.stopPropagation()
        this.activeTabValue = event.target.value
    }
}