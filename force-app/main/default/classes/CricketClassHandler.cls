public with sharing class CricketClassHandler {
  @AuraEnabled(cacheable=true)
  public static List<Cricketer__c> getCricketersInfo(String nationality) {
    try {
      return [
        SELECT
          Id,
          Name,
          Nationality__c,
          Runs__c,
          Image_url__c,
          Born__c,
          Age__c,
          Awards__c,
          Height__c,
          Spouse__c,
          Date_of_Joined__c
        FROM Cricketer__c
        WHERE Nationality__c = :nationality
        WITH USER_MODE
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Cricketer__c> fetchPlayersDetails(String playerId) {
    try {
      return [
        SELECT
          Id,
          Name,
          Nationality__c,
          Runs__c,
          Image_url__c,
          Born__c,
          Age__c,
          Awards__c,
          Height__c,
          Spouse__c,
          Date_of_Joined__c
        FROM Cricketer__c
        WHERE Id = :playerId
        WITH USER_MODE
        LIMIT 1
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
