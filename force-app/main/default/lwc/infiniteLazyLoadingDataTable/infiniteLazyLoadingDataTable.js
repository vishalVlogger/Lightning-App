import { LightningElement } from "lwc";
import infiniteLoadRecordsById from "@salesforce/apex/AccountHandlerClass.infiniteLoadRecordsById";
import infiniteLoadMoreData from "@salesforce/apex/AccountHandlerClass.infiniteLoadMoreData";
import countOfAccounts from "@salesforce/apex/AccountHandlerClass.countOfAccounts";

const columns = [
  { label: "Name", fieldName: "Name" },
  { label: "Industry", fieldName: "Industry", type: "picklist" },
  { label: "Rating", fieldName: "Rating", type: "picklist" }
];

export default class InfiniteLazyLoadingDataTable extends LightningElement {
  accountData = [];
  totalRecords = 0;
  displayNumberOfRec = 0;
  columns = columns;

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    try {
      this.totalRecords = await countOfAccounts();
      this.accountData = await infiniteLoadRecordsById();
      this.displayNumberOfRec = this.accountData.length;
    } catch (error) {
      console.log("Error While Loading Data: ", error);
    }
  }

  async loadMoreData(event) {
    try {
      const { target } = event;
      target.isLoading = true;

      let currRecords = this.accountData;
      let lastRecord = currRecords[currRecords.length - 1];

      let newRecords = await infiniteLoadMoreData({
        lastName: lastRecord.Name,
        lastId: lastRecord.Id
      });

      if (newRecords.length > 0) {
        this.accountData = [...currRecords, ...newRecords];
        this.displayNumberOfRec = this.accountData.length;
      } else {
        target.isLoading = false;
      }
      target.isLoading = false;
    } catch (error) {
      console.log("Error While Loading More Data: ", error);
    }
  }
}
