public with sharing class AccountHandlerClass {
  @AuraEnabled(cacheable=true)
  public static List<Account> getAccountInfo() {
    try {
      return [
        SELECT Id, Name, Rating, Industry, AnnualRevenue, Phone, PhotoUrl
        FROM Account
        WHERE PhotoUrl != NULL
        WITH USER_MODE
        LIMIT 10
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<sObject> getsObjectRec(
    String objectApiName,
    String searchKey
  ) {
    List<sObject> sObjectList = new List<sObject>();
    try {
      if (String.isNotBlank(searchKey)) {
        String key = '%' + searchKey + '%';
        String searchQuery = ('SELECT Id, Name FROM ' +
        objectApiName +
        ' WHERE Name LIKE :key');
        sObjectList = Database.query(searchQuery, AccessLevel.USER_MODE);
      }
      return sObjectList;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Account> getParentAccount() {
    try {
      return [
        SELECT Id, Name, Industry, AnnualRevenue
        FROM Account
        WHERE AnnualRevenue != null
        WITH USER_MoDE
        LIMIT 10
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
