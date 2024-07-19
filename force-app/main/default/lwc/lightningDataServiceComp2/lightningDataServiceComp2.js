import {
  getObjectInfo,
  getPicklistValues,
  getPicklistValuesByRecordType
} from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import { LightningElement, wire } from "lwc";

export default class LightningDataServiceComp2 extends LightningElement {
  value;

  @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
  wireObjectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$wireObjectInfo.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_INDUSTRY
  })
  wireGetIndustry;

  @wire(getPicklistValuesByRecordType, {
    objectApiName: ACCOUNT_OBJECT,
    recordTypeId: "$wireObjectInfo.data.defaultRecordTypeId"
  })
  wireGetAccPickList;

  handleChange(event) {
    this.value = event.target.value;
  }
}
