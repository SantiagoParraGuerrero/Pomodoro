public with sharing class InsertPomodoroSample
{
    private static Set<String> namesForProjects = new Set<String> {
        'Jest in LWC',
        'AutoHot key learning',
        'Korean',
        'Git course',
        'Working',
        'Help Someone'
    };

    private static List<String> taskNames = new List<String> {
        'Some Task Number 1',
        'Some Task Number 2',
        'Some Task Number 3',
        'Some Task Number 4',
        'Some Task Number 5',
        'Some Task Number 6',
        'Some Task Number 7',
        'Some Task Number 8',
        'Some Task Number 9'
    };

    private static List<String> typesOfProjects = new List<String> {
        'Work', 'Personal', 'Other'
    };

    private static List<Integer> probabilities = new List<Integer> {
        25,
        25,
        25,
        25,
        25,
        25,
        30,
        30,
        30,
        35
    };

    private static final Integer MAX_TIME_RECORDED = 60;
    private static final Integer MIN_TIME_RECORDED = 20;

    private static final Integer MAX_NUMBER_POMOS = 12;
    private static final Integer MIN_NUMBER_POMOS = 0;

    private static final Integer SAMPLE_DAYS = 365;

    public static void createData() {
        createPomodoros(createTasks(createProjects()));
    }

    public static List<Project__c> createProjects() {
        List<Project__c> result = new List<Project__c>();

        for (String projectName : namesForProjects) {

            String randomType = (String) getRandomElement(typesOfProjects);
            result.add(new Project__c(Name = projectName, Type__c = randomType));
        }

        insert result;

        return result;
    }

    public static List<PomodoroTask__c> createTasks(List<Project__c> projects) {

        List<PomodoroTask__c> result = new List<PomodoroTask__c>();

        for (String taskNames : taskNames) {
            Project__c randomProject = (Project__c) getRandomElement(projects);
            result.add(new PomodoroTask__c(Name = taskNames, Project__c = randomProject.Id));
        }

        insert result;

        return result;
    }

    private static Integer WORKING_HOURS_EACH_DAY = 12;
    private static final Integer LUNCH_TIME = 75;


    public static List<Pomodoro__c> createPomodoros(List<PomodoroTask__c> pomodoroTasks) {
        
        List<Pomodoro__c> result = new List<Pomodoro__c>();
        List<DailyRest__c> dailyRests = new List<DailyRest__c>();
        DateTime dt = System.now();
        DateTime now = DateTime.newInstance(dt.year(), dt.month(), dt.day());
        for(Integer currentDay = 0; currentDay < SAMPLE_DAYS; currentDay++) {//each day
            // Integer numberOfPomosEachDay = generateRandomNumberBetween(MIN_NUMBER_POMOS, MAX_NUMBER_POMOS);
            Integer totalRestTime = LUNCH_TIME;
            DateTime today = now.addDays(-currentDay);
            
            for (Integer currentHour = 0; currentHour < WORKING_HOURS_EACH_DAY; currentHour++) {
                Double randomNumber = Math.random();
                Integer pomodoroTime = getPomodoroTime(randomNumber);
                // numberOfPomosEachDay--;
                
                // if (numberOfPomosEachDay == 0) break;
                if (pomodoroTime == 0) continue;

                Integer restTime = randomNumber < 0.25 ? 15 : 5;
    
                PomodoroTask__c pomodoroTask = (PomodoroTask__c) getRandomElement(randomNumber, pomodoroTasks);
    
                totalRestTime += restTime;
                
                result.add(new Pomodoro__c(
                    TimeRecorded__c = pomodoroTime,
                    EndDate__c = today.addHours(currentHour).addMinutes(pomodoroTime),
                    PomodoroTask__c = pomodoroTask.Id
                ));
            }
    
            dailyRests.add(new DailyRest__c(RecordedDate__c = Date.valueOf(today), Total__c= totalRestTime));
        }

        insert dailyRests;
        insert result;
        return result;
    }

    private static Integer generateRandomNumberBetween(Integer startingNumber, Integer endingNumber) {
        Integer difference = endingNumber - startingNumber;
        Integer randomNumber = Integer.valueOf(Math.random() * difference);
        return startingNumber + randomNumber;
    }

    private static Object getRandomElement(List<Object> records) {
        return getRandomElement(Math.random(), records);
    }

    private static Object getRandomElement(Double randomNumber, List<Object> records) {
        Integer randomIndex = Integer.valueOf(randomNumber * records.size() - 1);
        return records[randomIndex];
    }
    private static Integer getPomodoroTime(Double randomNumber) {
        Integer result = 0;

        if (randomNumber < 0.5) {// 60% change of creating a pomo of 25
            result = 25;
        } else if (randomNumber < 0.65) {//15% change of creating a pomo of 30
            result = 30;
        } else if (randomNumber < 0.75) {//10% chance of creating a pomo of 20
            result = 20;
        } else if (randomNumber < 0.8) {//5% change of creating a pomo of 30
            result = 35;
        }

        return result;
    }
}
