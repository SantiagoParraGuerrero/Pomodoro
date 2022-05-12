import { LightningElement, wire } from 'lwc';
import getOverallAverage from '@salesforce/apex/OverallAverageController.getOverallDailyAverage';

export default class OverallAverage extends LightningElement {

    @wire(getOverallAverage)
    average
}