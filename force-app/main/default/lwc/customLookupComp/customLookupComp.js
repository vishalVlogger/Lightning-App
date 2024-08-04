import { api, LightningElement, wire } from "lwc";
import accountCustomLookup from "@salesforce/apex/AccountHandlerClass.accountCustomLookup";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
const DELAY = 300;

export default class CustomLookupComp extends LightningElement {
  @api objectApiName = "Account";
  searchKey = "";
  errors;
  accounts = [];
  delayTimeout;
  displayOutput = false;
  selectedRecords = [];

  @wire(accountCustomLookup, {
    searchKey: "$searchKey",
    objectApiName: "$objectApiName"
  })
  wireAccounts({ error, data }) {
    if (error) {
      this.errors = error;
      this.accounts = null;
    } else if (data) {
      this.errors = null;
      this.accounts = data;
      console.log("Accounts: ", this.accounts);
    }
  }

  changeHandler(event) {
    clearTimeout(this.delayTimeout);
    let value = event.target.value;
    try {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this.delayTimeout = setTimeout(() => {
        this.displayOutput = true;
        this.searchKey = value;
      }, DELAY);
    } catch (error) {
      this.displayOutput = false;
      console.log("Error: ", error);
    }
  }

  clickHandler(event) {
    let recId = event.target.getAttribute("data-recid");
    console.log("Record Id: ", recId);

    if (this.validateDuplicateRec(recId)) {
      let selectedRec = this.accounts.find((currItem) => {
        return currItem.Id === recId;
      });

      let pill = {
        type: "icon",
        label: selectedRec.Name,
        name: recId,
        iconName: "standard:account",
        alternativeText: selectedRec.Name
      };

      this.selectedRecords = [...this.selectedRecords, pill];
    }
  }

  get showPillContainer() {
    return this.selectedRecords.length > 0 ? true : false;
  }

  handleItemRemove(event) {
    const index = event.detail.index;
    this.selectedRecords.splice(index, 1);
  }

  validateDuplicateRec(selectedRecord) {
    let isValid = true;
    let isRecordAreladySelected = this.selectedRecords.find((currItem) => {
      return currItem.name === selectedRecord;
    });

    if (isRecordAreladySelected) {
      isValid = false;
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          message: "Record already selected",
          variant: "error"
        })
      );
    } else {
      isValid = true;
    }
    return isValid;
  }
}
