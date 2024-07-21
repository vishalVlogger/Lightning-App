import { LightningElement, wire } from "lwc";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import CONTACT_OBJECT from "@salesforce/schema/Contact";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";

export default class ContactFilter extends NavigationMixin(LightningElement) {
  selectedAccountId = "";
  selectedIndustry = "";
  disableNewContactButton = true;

  @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
  wireAccountObject;

  @wire(getPicklistValues, {
    recordTypeId: "$wireAccountObject.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_INDUSTRY
  })
  wireFetchIndustry;

  slectedRecordHandler(event) {
    this.selectedAccountId = event.detail;
    if (this.selectedAccountId) {
      this.disableNewContactButton = false;
    } else {
      this.disableNewContactButton = true;
    }
    this.notifyFilterChange();
  }

  industryHandleChange(event) {
    this.selectedIndustry = event.target.value;
    this.notifyFilterChange();
  }

  newContactHandleClick() {
    const defaultValues = encodeDefaultFieldValues({
      AccountId: this.selectedAccountId
    });

    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        actionName: "new",
        objectApiName: CONTACT_OBJECT.objectApiName
      },
      state: {
        defaultFieldValues: defaultValues
      }
    });
  }

  notifyFilterChange() {
    const mtEvent = new CustomEvent("filterchange", {
      detail: {
        accountId: this.selectedAccountId,
        industry: this.selectedIndustry
      }
    });
    this.dispatchEvent(mtEvent);
  }
}
