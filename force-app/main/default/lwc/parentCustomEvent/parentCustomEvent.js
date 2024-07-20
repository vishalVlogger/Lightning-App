import { LightningElement, wire } from "lwc";
import getAccountInfo from "@salesforce/apex/AccountHandlerClass.getAccountInfo";

export default class ParentCustomEvent extends LightningElement {
  errors;
  displayAccount;
  selectedAccount;

  @wire(getAccountInfo)
  wireShowAccInfo({ error, data }) {
    if (error) {
      this.errors = error;
      this.displayAccount = null;
    } else if (data) {
      this.displayAccount = data;
      this.errors = null;
    }
  }

  selectedHandler(event) {
    let selectedAccId = event.detail;

    this.selectedAccount = this.displayAccount.find((currItem) => {
      return currItem.Id === selectedAccId;
    });
  }
}
