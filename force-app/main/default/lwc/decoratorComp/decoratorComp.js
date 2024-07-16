import { LightningElement } from "lwc";

export default class DecoratorComp extends LightningElement {
  sometext = "";

  changeHandler(event) {
    let { name, value } = event.target;
    if (name === "txt") {
      this.sometext = value;
    }
  }
}
