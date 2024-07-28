public with sharing class toDoManagerHandlerClass {
  @AuraEnabled(cacheable=true)
  public static List<Task_Manager__c> getTaskManagerData() {
    try {
      return [
        SELECT Id, Name, Task_Date__c
        FROM Task_Manager__c
        WHERE OwnerId = :UserInfo.getUserId() AND Is_Completed__c = FALSE
        WITH USER_MODE
        ORDER BY Task_Date__c
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Task_Manager__c> getTaskCompletedData() {
    try {
      return [
        SELECT Id, Name, Task_Date__c
        FROM Task_Manager__c
        WHERE OwnerId = :UserInfo.getUserId() AND Is_Completed__c = TRUE
        WITH USER_MODE
        ORDER BY Completed_Date__c DESC
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
