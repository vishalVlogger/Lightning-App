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

  @AuraEnabled(cacheable=true)
  public static List<Contact> fetchContactRecord() {
    try {
      return [
        SELECT
          Id,
          Name,
          Title,
          Phone,
          Email,
          Picture__c,
          Rank__c,
          AccountId,
          Account.Name
        FROM Contact
        WHERE AccountId != NULL
        WITH USER_MODE
        LIMIT 10
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<ContactWrapperClass> getContactRecord(String accountId) {
    try {
      List<Contact> conList = [
        SELECT
          Id,
          FirstName,
          LastName,
          Title,
          Phone,
          Email,
          LeadSource,
          AccountId,
          (SELECT Id FROM Cases)
        FROM Contact
        WHERE AccountId = :accountId
        WITH USER_MODE
        LIMIT 10
      ];

      List<ContactWrapperClass> wrapperList = new List<ContactWrapperClass>();
      for (Contact con : conList) {
        ContactWrapperClass conWrap = new ContactWrapperClass();
        conWrap.Id = con.Id;
        conWrap.FirstName = con.FirstName;
        conWrap.LastName = con.LastName;
        conWrap.Title = con.Title;
        conWrap.Phone = con.Phone;
        conWrap.Email = con.Email;
        conWrap.LeadSource = con.LeadSource;
        conWrap.numberOfCases = con.Cases.size();
        if (con.LeadSource == 'Phone Inquiry' && String.isBlank(con.Phone)) {
          conWrap.isBadContact = true;
        } else {
          conWrap.isBadContact = false;
        }
        wrapperList.add(conWrap);
      }
      return wrapperList;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  public class ContactWrapperClass {
    @AuraEnabled
    public String Id;
    @AuraEnabled
    public String FirstName;
    @AuraEnabled
    public String LastName;
    @AuraEnabled
    public String Title;
    @AuraEnabled
    public String Phone;
    @AuraEnabled
    public String Email;
    @AuraEnabled
    public String LeadSource;
    @AuraEnabled
    public Integer numberOfCases;
    @AuraEnabled
    public Boolean isBadContact;
  }
}
