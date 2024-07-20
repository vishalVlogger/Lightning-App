import { api, LightningElement } from "lwc";

export default class ChildCustomEvent extends LightningElement {
  @api account;

  showAccHandler(event) {
    event.preventDefault();

    const myEvent = new CustomEvent("message", {
      detail: this.account.Id
    });
    this.dispatchEvent(myEvent);
  }
}
