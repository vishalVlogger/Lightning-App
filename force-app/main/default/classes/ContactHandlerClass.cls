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

  @AuraEnabled(cacheable=true)
  public static List<Contact> getContactFilter(
    String accountId,
    String industry
  ) {
    try {
      String query = 'SELECT Id, Name, Phone, Email, PhotoUrl FROM Contact';
      List<String> filter = new List<String>();

      if (String.isNotBlank(accountId)) {
        filter.add('accountId =: accountId');
      }

      if (String.isNotBlank(industry)) {
        filter.add('Contact.Account.Industry =: industry');
      }

      if (!filter.isEmpty()) {
        query += ' WHERE ' + String.join(filter, ' AND ');
      }
      query += ' WITH USER_MODE ';
      query += 'ORDER BY Name';
      System.debug('query: ' + query);
      List<Contact> conList = Database.query(query);
      return conList;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
