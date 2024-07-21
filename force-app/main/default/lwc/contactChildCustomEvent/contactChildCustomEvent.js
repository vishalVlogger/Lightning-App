import { api, LightningElement } from "lwc";

export default class ContactChildCustomEvent extends LightningElement {
  @api contact;

  displayContactInfo(event) {
    event.preventDefault();

    const myEvent = new CustomEvent("contactdetails", {
      detail: this.contact.Id
    });
    this.dispatchEvent(myEvent);
  }
}
