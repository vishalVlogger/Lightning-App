import { getFieldValue, getRecord } from "lightning/uiRecordApi";
import { LightningElement, wire, api } from "lwc";
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_TICKERSYMBOL from "@salesforce/schema/Account.TickerSymbol";
import updatetickerSymbolValue from "@salesforce/apex/AccountHandlerClass.updatetickerSymbolValue";
import { notifyRecordUpdateAvailable } from "lightning/uiRecordApi";

export default class ImperativeMethodUpdate extends LightningElement {
  accName = "";
  tickerSymbol = "";

  @api recordId;

  @wire(getRecord, {
    recordId: "$recordId",
    fields: [ACCOUNT_NAME, ACCOUNT_TICKERSYMBOL]
  })
  wireGetRecord({ error, data }) {
    if (error) {
      console.log("Get Record Error: ", error);
      this.accName = null;
      this.tickerSymbol = null;
    } else if (data) {
      console.log("Get Record Account: ", data);
      this.accName = getFieldValue(data, ACCOUNT_NAME);
      this.tickerSymbol = getFieldValue(data, ACCOUNT_TICKERSYMBOL);
    }
  }

  changeHandler(event) {
    this.tickerSymbol = event.target.value;
  }

  handleClick() {
    updatetickerSymbolValue({
      recordId: this.recordId,
      tickerSymbol: this.tickerSymbol
    })
      .then((result) => {
        console.log("TickerSymbol Updated: ", result);
        notifyRecordUpdateAvailable([{ recordId: this.recordId }]);
      })
      .catch((error) => {
        console.log("TickerSymbol Failed: ", error);
      });
  }
}
