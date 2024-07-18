import { LightningElement, api, wire } from "lwc";
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_ANNUAL_REVENUE from "@salesforce/schema/Account.AnnualRevenue";
import {
  getFieldDisplayValue,
  getFieldValue,
  getRecord
} from "lightning/uiRecordApi";

export default class LightningDataService extends LightningElement {
  @api recordId;
  accName;
  accAnnualRevenue;
  errors;

  @wire(getRecord, {
    recordId: "$recordId",
    fields: [ACCOUNT_NAME, ACCOUNT_ANNUAL_REVENUE]
  })
  wireGetAccRecord({ error, data }) {
    if (data) {
      console.log("data: ", data);
      this.accName = getFieldValue(data, ACCOUNT_NAME);
      this.accAnnualRevenue = getFieldDisplayValue(
        data,
        ACCOUNT_ANNUAL_REVENUE
      );
      this.errors = null;
    } else if (error) {
      this.errors = error;
      this.accName = null;
      this.accAnnualRevenue = null;
    }
  }
}
