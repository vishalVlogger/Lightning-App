import { LightningElement, api } from "lwc";
import ACCOUNT_NAME_FIELD from "@salesforce/schema/Account.Name";
import ACCOUNT_TYPE_FIELD from "@salesforce/schema/Account.Type";
import ACCOUNT_PHONE_FIELD from "@salesforce/schema/Account.Phone";
import ACCOUNT_EMPLOYEES_FIELD from "@salesforce/schema/Account.NumberOfEmployees";
import ACCOUNT_RATING_FIELD from "@salesforce/schema/Account.Rating";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

export default class LightningRecordForm extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  @api objectApiName;
  fieldsItems = [
    ACCOUNT_NAME_FIELD,
    ACCOUNT_TYPE_FIELD,
    ACCOUNT_PHONE_FIELD,
    ACCOUNT_EMPLOYEES_FIELD,
    ACCOUNT_RATING_FIELD
  ];

  fieldsList = {
    name: ACCOUNT_NAME_FIELD,
    type: ACCOUNT_TYPE_FIELD,
    phone: ACCOUNT_PHONE_FIELD,
    employees: ACCOUNT_EMPLOYEES_FIELD,
    rating: ACCOUNT_RATING_FIELD
  };

  showToast() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "title",
        message: "Record Created Successfully",
        variant: "success"
      })
    );
  }

  navtoRecord(event) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        actionName: "view",
        recordId: event.detail.id,
        objectApiName: this.objectApiName
      }
    });
  }
}
