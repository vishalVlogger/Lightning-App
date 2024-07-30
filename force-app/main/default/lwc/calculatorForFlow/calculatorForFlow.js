/* eslint-disable @lwc/lwc/no-api-reassignments */
import { api, LightningElement } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class CalculatorForFlow extends LightningElement {
  @api inputNum1 = "";
  @api inputNum2 = "";
  @api outputResult = "";

  handleClick(event) {
    let name = event.target.name;

    if (name === "add") {
      this.outputResult = Number(this.inputNum1) + Number(this.inputNum2);
    } else if (name === "sub") {
      this.outputResult = Number(this.inputNum1) - Number(this.inputNum2);
    } else if (name === "multi") {
      this.outputResult = Number(this.inputNum1) * Number(this.inputNum2);
    } else if (name === "div") {
      this.outputResult =
        parseFloat(this.inputNum1) / parseFloat(this.inputNum2);
    }

    const attributeChangeEvent = new FlowAttributeChangeEvent(
      "outputResult",
      this.outputResult
    );
    this.dispatchEvent(attributeChangeEvent);
  }
}
