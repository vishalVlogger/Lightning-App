import { LightningElement, wire, api } from "lwc";
import getParentAccount from "@salesforce/apex/AccountHandlerClass.getParentAccount";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import ACCOUNT_ID from "@salesforce/schema/Account.Id";
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_PARENT from "@salesforce/schema/Account.ParentId";
import ACCOUNT_SLA_DATE from "@salesforce/schema/Account.SLAExpirationDate__c";
import ACCOUNT_NUMBER_LOCATION from "@salesforce/schema/Account.NumberofLocations__c";
import ACCOUNT_SLA_TYPE from "@salesforce/schema/Account.SLA__c";
import ACCOUNT_DECRIPTION from "@salesforce/schema/Account.Description";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import {
  createRecord,
  deleteRecord,
  getFieldValue,
  getRecord,
  updateRecord
} from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const fieldsValues = [
  ACCOUNT_PARENT,
  ACCOUNT_NAME,
  ACCOUNT_SLA_DATE,
  ACCOUNT_SLA_TYPE,
  ACCOUNT_NUMBER_LOCATION,
  ACCOUNT_DECRIPTION
];

export default class WireAdapterCreateRecord extends NavigationMixin(
  LightningElement
) {
  parentOptions = [];
  selectedParentAccount = "";
  selectedName = "";
  selectedDate = null;
  selectedSLAType = "";
  selectedLocation = "1";
  selectDescription = "";
  errors;

  @api recordId;

  @wire(getRecord, { recordId: "$recordId", fields: fieldsValues })
  wireGetExistingRecords({ error, data }) {
    if (error) {
      console.log("Existing records values get failed: ", error);
    } else if (data) {
      this.selectedParentAccount = getFieldValue(data, ACCOUNT_PARENT);
      this.selectedName = getFieldValue(data, ACCOUNT_NAME);
      this.selectedDate = getFieldValue(data, ACCOUNT_SLA_DATE);
      this.selectedSLAType = getFieldValue(data, ACCOUNT_SLA_TYPE);
      this.selectedLocation = getFieldValue(data, ACCOUNT_NUMBER_LOCATION);
      this.selectDescription = getFieldValue(data, ACCOUNT_DECRIPTION);
    }
  }

  @wire(getParentAccount)
  wireParentAccount({ error, data }) {
    this.parentOptions = [];
    if (error) {
      this.errors = error;
      this.parentOptions = null;
    } else if (data) {
      console.log("data: ", data);
      this.parentOptions = data.map((currItem) => {
        return {
          label: currItem.Name,
          value: currItem.Id
        };
      });
      console.log("Parent Accounts: ", this.parentOptions);
      this.errors = null;
    }
  }

  @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
  wireAccountObject;

  @wire(getPicklistValues, {
    recordTypeId: "$wireAccountObject.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_SLA_TYPE
  })
  wireGetSLAType;

  accountHandleChange(event) {
    let { name, value } = event.target;
    if (name === "paccount") {
      this.selectedParentAccount = value;
    } else if (name === "accname") {
      this.selectedName = value;
    } else if (name === "sladate") {
      this.selectedDate = value;
    } else if (name === "slatypeGroup") {
      this.selectedSLAType = value;
    } else if (name === "numoflocation") {
      this.selectedLocation = value;
    } else if (name === "selectDescription") {
      this.selectDescription = value;
    }
  }

  newAccountHandlerClick() {
    if (this.checkValidationInput) {
      let inputFields = {};

      inputFields[ACCOUNT_PARENT.fieldApiName] = this.selectedParentAccount;
      inputFields[ACCOUNT_NAME.fieldApiName] = this.selectedName;
      inputFields[ACCOUNT_SLA_DATE.fieldApiName] = this.selectedDate;
      inputFields[ACCOUNT_SLA_TYPE.fieldApiName] = this.selectedSLAType;
      inputFields[ACCOUNT_NUMBER_LOCATION.fieldApiName] = this.selectedLocation;
      inputFields[ACCOUNT_DECRIPTION.fieldApiName] = this.selectDescription;

      if (this.recordId) {
        inputFields[ACCOUNT_ID.fieldApiName] = this.recordId;

        let recordInput = {
          fields: inputFields
        };

        updateRecord(recordInput)
          .then((result) => {
            console.log("Record Updated Successfully: ", result);
            this.showToast("Record Updated Successfully");
          })
          .catch((error) => {
            console.log("Record Updated Failed: ", error);
          });
      } else {
        let recordInput = {
          apiName: ACCOUNT_OBJECT.objectApiName,
          fields: inputFields
        };

        createRecord(recordInput)
          .then((result) => {
            console.log("Create Record: ", result);
            this.navigateNewAccount(result);
            this.showToast("Account Created Successfully");
          })
          .catch((error) => {
            console.log("Create Record Get Failed: ", error);
          });
      }
    } else {
      console.log("Input is not validate");
    }
  }

  checkValidationInput() {
    let fields = Array.from(this.template.querySelectorAll(".validateInput"));
    let isValid = fields.every((currItem) => {
      return currItem.checkValidity();
    });
    return isValid;
  }

  resetAccountHandlerClick() {
    this.selectedParentAccount = "";
    this.selectedName = "";
    this.selectedDate = null;
    this.selectedSLAType = null;
    this.selectedLocation = "1";
    this.selectDescription = "";
  }

  navigateNewAccount(result) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        actionName: "view",
        recordId: result.id,
        objectApiName: ACCOUNT_OBJECT.objectApiName
      }
    });
  }

  showToast(message) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: message,
        variant: "success"
      })
    );
  }

  get titlePage() {
    if (this.recordId) {
      return "Edit Account";
    }
    return "Create Account";
  }

  get isDeleteAvailable() {
    if (this.recordId) {
      return true;
    }
    return false;
  }

  deleteHandleClick() {
    deleteRecord(this.recordId)
      .then(() => {
        console.log("Record Deleted Successfully");

        this[NavigationMixin.Navigate]({
          type: "standard__objectPage",
          attributes: {
            actionName: "list",
            objectApiName: ACCOUNT_OBJECT.objectApiName
          },
          state: {
            filterName: "Recent"
          }
        });

        this.showToast("Record Deleted Successfully");
      })
      .catch((error) => {
        console.log("Deleted Record Failed: ", error);
      });
  }
}
