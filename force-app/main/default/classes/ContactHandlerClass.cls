public with sharing class ContactHandlerClass {
  @AuraEnabled(cacheable=true)
  public static List<Contact> fetchContactRecords() {
    try {
      return [
        SELECT Id, Name, FirstName, LastName, Phone, Email, PhotoUrl
        FROM Contact
        WHERE PhotoUrl != NULL
        WITH USER_MODE
        LIMIT 10
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
