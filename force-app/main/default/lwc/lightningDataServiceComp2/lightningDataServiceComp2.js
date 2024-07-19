import { getObjectInfo } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import { LightningElement, wire } from "lwc";

export default class LightningDataServiceComp2 extends LightningElement {
  accountInfo;
  errors;

  @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
  wireGetObjectInfo({ error, data }) {
    if (data) {
      console.log("Data: ", data);
      this.accountInfo = data;
      this.errors = null;
    } else if (error) {
      this.errors = error;
      this.accountInfo = null;
    }
  }
}
