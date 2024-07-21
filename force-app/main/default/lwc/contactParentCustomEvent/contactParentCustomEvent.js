import { LightningElement, wire } from "lwc";
import fetchContactRecords from "@salesforce/apex/ContactHandlerClass.fetchContactRecords";

export default class ContactParentCustomEvent extends LightningElement {
  contact;
  errors;
  selectedContact;

  @wire(fetchContactRecords)
  wireFetchContact({ error, data }) {
    if (error) {
      // TODO: Error handling
      this.errors = error;
      this.contact = null;
    } else if (data) {
      // TODO: Data handling
      this.contact = data;
      this.errors = null;
    }
  }

  handleContactDetails(event) {
    let contactId = event.detail;

    this.selectedContact = this.contact.find((currItem) => {
      return currItem.Id === contactId;
    });
  }
}
