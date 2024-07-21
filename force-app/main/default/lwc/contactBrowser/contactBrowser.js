import { LightningElement, wire } from "lwc";
import getContactFilter from "@salesforce/apex/ContactHandlerClass.getContactFilter";

export default class ContactBrowser extends LightningElement {
  selectedAccId = "";
  slectedAccIndustry = "";

  @wire(getContactFilter, {
    accountId: "$selectedAccId",
    industry: "$slectedAccIndustry"
  })
  wireContactFilter({ error, data }) {
    if (error) {
      console.log("Erros: ", error);
    } else if (data) {
      console.log("Selected Contact: ", data);
    }
  }

  filterChangeHandler(event) {
    this.selectedAccId = event.detail.accountId;
    this.slectedAccIndustry = event.detail.industry;
  }
}
