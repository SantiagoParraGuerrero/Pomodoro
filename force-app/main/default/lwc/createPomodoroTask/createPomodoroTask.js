import { LightningElement, wire, track } from 'lwc'
import getTasks from '@salesforce/apex/PomodoroController.getTasks'
import { NavigationMixin } from 'lightning/navigation'
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils'

export default class CreatePomodoroTask extends NavigationMixin(LightningElement) {

    @track tasks = []

    @wire(getTasks)
    wiredData({ error, data }) {
        if (data) {
            debugger
            this.tasks = JSON.parse(JSON.stringify(data))
            this.tasks.forEach(task => {
                task.childTasks = this.tasks.filter(childTask => childTask.ParentTask__c === task.Id)
                task.childTasks.slice(-1).isLast = true
            })
            this.tasks.slice(-1).isLast = true
        } else if (error) {
            console.error('Error:', error)
        }
    }

    createTask() {

        const defaultFields = encodeDefaultFieldValues({
            ParentTask__c : 'a00AW0000002p1dYAA',
            Description__c : 'Santiago'
        })

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "new",
                objectApiName: "PomodoroTask__c"
            },
            state: {
                defaultFieldValues : defaultFields
            }
        })
    }
}