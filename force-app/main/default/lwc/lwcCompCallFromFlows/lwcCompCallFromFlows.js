import { LightningElement, api } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class LwcCompCallFromFlows extends LightningElement {
  @api inputValue;

  changeHandler(event) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.inputValue = event.target.value;
    const attributeChangeEvent = new FlowAttributeChangeEvent(
      "inputValue",
      this.inputValue
    );
    this.dispatchEvent(attributeChangeEvent);
  }
}
