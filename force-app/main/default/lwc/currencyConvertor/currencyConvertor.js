import { LightningElement } from "lwc";

export default class CurrencyConvertor extends LightningElement {
  currAmount = "";
  fromCurrenct = "";
  toCurrenct = "";
  convertedValue = "";
  currencyOptions = [];
  showOutputAvailable = false;

  connectedCallback() {
    this.fetchSymbol();
  }

  changeHandler(event) {
    let { name, value } = event.target;

    if (name === "amount") {
      this.currAmount = value;
    } else if (name === "fromcurr") {
      this.fromCurrenct = value;
    } else if (name === "tocurr") {
      this.toCurrenct = value;
    }
  }

  convertHandlerClick() {
    this.currencyConversion();
  }

  async fetchSymbol() {
    const endpoint = "https://api.frankfurter.app/currencies";
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      let options = [];

      // eslint-disable-next-line guard-for-in
      for (let symbol in data) {
        options = [...options, { label: symbol, value: symbol }];
      }
      this.currencyOptions = [...options];
    } catch (error) {
      console.log("Erorr: ", error);
    }
  }

  async currencyConversion() {
    const host = `https://api.frankfurter.app/latest?amount=${this.currAmount}&from=${this.fromCurrenct}&to=${this.toCurrenct}`;

    try {
      const response = await fetch(host);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      this.convertedValue = data.rates[this.toCurrenct];
      this.showOutputAvailable = true;
    } catch (error) {
      console.log("Erorr: ", error);
    }
  }
}
