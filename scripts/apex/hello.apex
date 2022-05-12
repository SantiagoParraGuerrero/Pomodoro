// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

InsertPomodoroSample.createData();


delete [select id from Pomodoro__c];
delete [select id from PomodoroTask__c];
delete [select id from Project__c];
delete [SELECT Id FROM DailyRest__c];


System.debug(system.today().addDays(1));

System.debug(InsertPomodoroSample.insertTwelve());