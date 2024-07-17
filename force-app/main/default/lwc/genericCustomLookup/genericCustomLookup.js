import { LightningElement, wire } from "lwc";
import getsObjectRec from "@salesforce/apex/AccountHandlerClass.getsObjectRec";
const DELAY = 300;

export default class GenericCustomLookup extends LightningElement {
  apiName = "Account";
  searchRec;
  objectLeabel = "Account";
  wireDataResult;
  delayTimeOut;
  selectedRecords = {
    selectedId: "",
    selectedName: ""
  };
  displyOutput = false;

  @wire(getsObjectRec, { objectApiName: "$apiName", searchKey: "$searchRec" })
  wiredData({ data, error }) {
    if (data) {
      this.wireDataResult = data;
      console.log("wireDataResult: ", this.wireDataResult);
      this.error = null;
    } else if (error) {
      this.errors = error;
      this.wireDataResult = null;
    }
  }

  get isRecordSelected() {
    return this.selectedRecords.selectedId === "" ? false : true;
  }

  changeHandler(event) {
    window.clearTimeout(this.delayTimeOut);
    let enteredValue = event.target.value;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeOut = setTimeout(() => {
      this.searchRec = enteredValue;
      this.displyOutput = true;
    }, DELAY);
  }

  clickHandler(event) {
    let selectedId = event.currentTarget.dataset.item;
    let outputRecords = this.wireDataResult.find((currItem) => {
      return currItem.Id === selectedId;
    });
    this.selectedRecords = {
      selectedId: outputRecords.Id,
      selectedName: outputRecords.Name
    };
    this.displyOutput = false;
  }

  removalRecords() {
    this.selectedRecords = {
      selectedId: "",
      selectedName: ""
    };
    this.displyOutput = false;
  }
}
