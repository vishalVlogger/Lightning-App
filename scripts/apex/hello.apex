for (List<Contact> conList : [
  SELECT Id, Picture__c, Rank__c, Title
  FROM Contact
  LIMIT 10
]) {
  for (Contact con : conList) {
    con.Picture__c = 'https://logowik.com/content/uploads/images/google-contact6901.jpg';

    if (String.isBlank(con.Title)) {
      con.Rank__c = 3;
    } else {
      con.Rank__c = 8;
    }
  }
  update conList;
}
