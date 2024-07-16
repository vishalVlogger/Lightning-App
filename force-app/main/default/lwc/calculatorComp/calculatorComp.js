import { LightningElement } from "lwc";

export default class CalculatorComp extends LightningElement {
  firstInput = "";
  secondInput = "";
  result = 0;

  changeHandler(event) {
    let { name, value } = event.target;
    if (name === "input1") {
      this.firstInput = value;
    } else if (name === "input2") {
      this.secondInput = value;
    }
  }

  calulatorHandler(event) {
    let labelElement = event.target.label;
    if (labelElement === "Add") {
      this.result = parseFloat(this.firstInput) + parseFloat(this.secondInput);
    } else if (labelElement === "Sub") {
      this.result = parseFloat(this.firstInput) - parseFloat(this.secondInput);
    } else if (labelElement === "Multi") {
      this.result = parseFloat(this.firstInput) * parseFloat(this.secondInput);
    } else if (labelElement === "Div") {
      if (this.secondInput === 0) {
        this.result = "Please enter a valid number";
      } else {
        this.result =
          parseFloat(this.firstInput) / parseFloat(this.secondInput);
      }
    }
  }
}
