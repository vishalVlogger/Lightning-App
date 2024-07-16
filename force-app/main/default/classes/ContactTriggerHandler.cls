public with sharing class ContactTriggerHandler {
  public static void updateLastModifyDate(List<Contact> newList) {
    List<Account> accList = new List<Account>();
    Set<Id> accIds = new Set<Id>();

    // Collect Account IDs from the Contact list
    for (Contact con : newList) {
      if (con.AccountId != null) {
        accIds.add(con.AccountId);
      }
    }

    // Check if the user has read access to the Account object
    if (!accIds.isEmpty() && Schema.sObjectType.Account.isAccessible()) {
      // Query Accounts and related Contacts
      for (Account acc : [
        SELECT Id, Name, (SELECT Id, AccountId FROM Contacts)
        FROM Account
        WHERE Id IN :accIds
      ]) {
        if (!acc.Contacts.isEmpty()) {
          acc.SLAExpirationDate__c = Date.today();
          accList.add(acc);
        }
      }
    }

    // Check if the user has update access to the Account object before performing DML
    if (
      !accList.isEmpty() &&
      Schema.sObjectType.Account.fields.SLAExpirationDate__c.isUpdateable()
    ) {
      update accList;
    }
  }

  public static void assignContactToAccount(List<Contact> newList) {
    Set<Id> accIds = new Set<Id>();

    for (Contact con : newList) {
      if (con.AccountId != null) {
        accIds.add(con.AccountId);
      }
    }

    Map<Id, Account> accIdsToMap = new Map<Id, Account>(
      [SELECT Id, OwnerId FROM Account WHERE Id IN :accIds]
    );
    if (!accIds.isEmpty()) {
      for (Contact con : newList) {
        if (accIdsToMap.containsKey(con.AccountId) && con.AccountId != null) {
          con.AccountId = accIdsToMap.get(con.AccountId).OwnerId;
        }
      }
    }
  }
}
