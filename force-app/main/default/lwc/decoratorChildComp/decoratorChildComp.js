import { LightningElement, api } from "lwc";

export default class DecoratorChildComp extends LightningElement {
  display = "";

  set displayText(value) {
    this.display = value.toUpperCase();
  }

  @api
  get displayText() {
    return this.display;
  }
}
