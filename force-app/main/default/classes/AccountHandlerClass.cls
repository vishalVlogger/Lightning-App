public with sharing class AccountHandlerClass {
  @AuraEnabled(cacheable=true)
  public static List<Account> getAccountInfo() {
    try {
      return [
        SELECT Id, Name, Rating, Industry, Type
        FROM Account
        WITH USER_MODE
        LIMIT 10
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
