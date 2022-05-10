public with sharing class PomodoroController {
    
    @AuraEnabled(cacheable=true)
    public static List<PomodoroTask__c> getTasks() {
        try {
            return [SELECT Id, Name, Description__c FROM PomodoroTask__c];
        } catch (Exception e) {
            AuraHandledException auraE = new AuraHandledException(e.getMessage());
            auraE.setMessage(e.getMessage());
            throw auraE;
        }
    }
}