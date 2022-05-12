public with sharing class PomodoroController {

    @AuraEnabled(cacheable=true)
    public static PomodoroDataWrapper getData(Integer numberOfDays) {
        try {
            return new PomodoroDataWrapper(numberOfDays);
        } catch (Exception e) {
            AuraHandledException auraE = new AuraHandledException(e.getMessage());
            auraE.setMessage(e.getMessage());
            throw auraE;
        }
    }

    public class PomodoroDataWrapper {
        @AuraEnabled
        public List<AggregateResult> averageData { get; set; }
        
        @AuraEnabled
        public String dailyAverage { get; set; }
        @AuraEnabled
        public Decimal dailyAverageInteger { get; set; }

        @AuraEnabled
        public Integer numberOfDays { get; set; }

        public PomodoroDataWrapper(Integer numberOfDays) {
            this.averageData = getDataForDailyAverageChart(numberOfDays);
            this.numberOfDays = this.averageData.size();
            this.dailyAverage = getAverage();
        }

        private List<AggregateResult> getDataForDailyAverageChart(Integer numberOfDays) {
            return Database.query('SELECT ' +
                'DAY_IN_YEAR(EndDate__c) day ,' +
                'SUM(TimeRecorded__c) dailySum ' +
            'FROM Pomodoro__c ' +
            'WHERE EndDate__c = LAST_N_DAYS:'+ numberOfDays + ' ' +
            'GROUP BY DAY_IN_YEAR(EndDate__c) ORDER BY DAY_IN_YEAR(EndDate__c)');
        }

        private String getAverage() {
            
            this.dailyAverageInteger = 0;

            if (averageData.isEmpty()) return 'No Records Available';

            Decimal total = 0;

            for (AggregateResult singleDayResult : averageData)
                total += (Decimal) singleDayResult.get('dailySum');

            Decimal average = (Decimal) total / averageData.size();

            this.dailyAverageInteger = average;

            DateTime dt = DateTime.newInstance((average * 60000).longValue());

            return dt.formatGmt('HH\'h\' mm\'m\' ss\'s\'');
        }
    }
}