import { api, LightningElement } from "lwc";
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_RATING from "@salesforce/schema/Account.Rating";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import ACCOUNT_EMPLOYEES from "@salesforce/schema/Account.NumberOfEmployees";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class LightningEditForm extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  @api objectApiName;

  fields = {
    name: ACCOUNT_NAME,
    rating: ACCOUNT_RATING,
    industry: ACCOUNT_INDUSTRY,
    employees: ACCOUNT_EMPLOYEES
  };

  navigateToAccount(event) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        actionName: "view",
        recordId: event.detail.id,
        objectApiName: this.objectApiName
      }
    });
  }

  submitHandler(event) {
    event.preventDefault();

    const fields = event.detail.fields;
    if (!fields.Industry) {
      fields.Industry = "Media";
    }
    this.template.querySelector("lightning-record-edit-form").submit(fields);
  }

  resetHandler() {
    let inputField = this.template.querySelectorAll("lightning-input-field");
    inputField.forEach((element) => {
      element.reset();
    });
  }

  errorsHandler(event) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Error",
        message: event.detail.message,
        variant: "error"
      })
    );
  }
}
