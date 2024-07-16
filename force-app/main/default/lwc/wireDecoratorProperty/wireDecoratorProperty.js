import { LightningElement, wire } from "lwc";
import getAccountInfo from "@salesforce/apex/AccountHandlerClass.getAccountInfo";

const columns = [
  { label: "Account", fieldName: "Name" },
  { label: "Rating", fieldName: "Rating", type: "picklist" },
  { label: "Type", fieldName: "Type", type: "picklist" },
  { label: "Industry", fieldName: "Industry", type: "picklist" }
];

export default class WireDecoratorProperty extends LightningElement {
  wiredDataResult;
  columns = columns;
  errors;

  @wire(getAccountInfo)
  wireAccountData({ error, data }) {
    if (data) {
      let updatedAccount = data.map((currItem) => {
        let updateObject = {};
        if (!Object.prototype.hasOwnProperty.call(currItem, "Rating")) {
          updateObject = { ...currItem, Rating: "Cold" };
        } else {
          updateObject = { ...currItem };
        }
        return updateObject;
      });
      this.wiredDataResult = [...updatedAccount];
      this.errors = null;
    } else if (error) {
      this.errors = error;
      this.wiredDataResult = null;
    }
  }
}
