import { api, LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CustomModals extends LightningElement {
  @api isViewMode = false;
  @api isEditMode = false;
  @api recordInputId;

  get Modalheader() {
    if (this.isViewMode) {
      return "View Contact";
    } else if (this.isEditMode) {
      return "Edit Contact";
    }
    return "";
  }

  closeModalHandler() {
    this.dispatchEvent(new CustomEvent("closemodal"));
  }

  successHandler() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Contact Successfully Updated",
        variant: "success"
      })
    );

    this.closeModalHandler();
  }
}
