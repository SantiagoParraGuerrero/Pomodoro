public with sharing class OverallAverageController {
    
    @AuraEnabled(cacheable = true)
    public static String getOverallDailyAverage() {
        
        List<AggregateResult> queriedDays = [
            SELECT
                DAY_IN_YEAR(EndDate__c),
                SUM(TimeRecorded__c) dailySum
            FROM Pomodoro__c
            WHERE EndDate__c = LAST_N_DAYS:365
            GROUP BY DAY_IN_YEAR(EndDate__c)
        ];
        
        if (queriedDays.isEmpty()) return 'No Records Available';

        Decimal total = 0;

        for (AggregateResult singleDayResult : queriedDays)
            total += (Decimal) singleDayResult.get('dailySum');

        Decimal average = (Decimal) total / queriedDays.size();

        DateTime dt = DateTime.newInstance((average * 60000).longValue());

        return dt.formatGmt('HH\'h\' mm\'m\' ss\'s\'');
    }
}