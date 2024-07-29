import { LightningElement, wire } from "lwc";
import getAccountData from "@salesforce/apex/AccountHandlerClass.getAccountData";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";

const columns = [
  { label: "Acount Name", fieldName: "Name" },
  { label: "Phone", fieldName: "Phone", type: "phone" },
  { label: "Industry", fieldName: "Industry", type: "picklist" },
  { label: "Annual Revenue", fieldName: "AnnualRevenue", type: "currency" }
];

export default class ImperativeMethodComp extends LightningElement {
  errors;
  loadAccount;
  columns = columns;
  selectedIndustry;

  @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
  wireAccountObject;

  @wire(getPicklistValues, {
    recordTypeId: "$wireAccountObject.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_INDUSTRY
  })
  wireAccountIndustry;

  handleChange(event) {
    this.selectedIndustry = event.target.value;
  }

  handleClick() {
    getAccountData({ industry: this.selectedIndustry })
      .then((result) => {
        console.log("Fetch Account: ", result);
        this.loadAccount = result;
        this.errors = null;
      })
      .catch((error) => {
        console.log("Fetch failed: ", error);
        this.errors = error;
        this.loadAccount = null;
      });
  }
}
