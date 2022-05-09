import { LightningElement, wire, track } from 'lwc'
import getTasks from '@salesforce/apex/PomodoroController.getTasks'
import { NavigationMixin } from 'lightning/navigation'
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils'

export default class CreatePomodoroTask extends NavigationMixin(LightningElement) {

    @track tasks = []

    @wire(getTasks)
    wiredData({ error, data }) {
        if (data) {
            const allTasks = JSON.parse(JSON.stringify(data))
            const parentTasks = allTasks.filter(task => !task.ParentTask__c)
            parentTasks[parentTasks.length - 1].isLast = true

            parentTasks.forEach(task => {
                const childTasks = allTasks.filter(childTask => childTask.ParentTask__c === task.Id)

                if (!childTasks.length) return

                task.childTasks = childTasks
                task.childTasks[childTasks.length - 1].isLast = true
                task.isParentTask = true
            })

            this.tasks = parentTasks
        } else if (error) {
            console.error('Error:', error)
        }
    }

    createTask(event) {
        const parentTaskId = event.currentTarget.dataset.parentTaskId

        const defaultFields = encodeDefaultFieldValues({
            ParentTask__c : parentTaskId
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