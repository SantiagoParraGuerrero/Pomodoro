public with sharing class DailyAveragePomodoroGraphController
{
    @AuraEnabled(cacheable = true)
    public static List<AggregateResult> dailyAverage(Integer numberOfDays) {

        return Database.query('SELECT ' +
                'DAY_IN_YEAR(EndDate__c) day ,' +
                'SUM(TimeRecorded__c) dailySum ' +
            'FROM Pomodoro__c ' +
            'WHERE EndDate__c = LAST_N_DAYS:'+ numberOfDays + ' ' +
            'GROUP BY DAY_IN_YEAR(EndDate__c) ORDER BY DAY_IN_YEAR(EndDate__c)');
    }
}
