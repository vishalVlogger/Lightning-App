import { api, LightningElement } from "lwc";

export default class TrainDetails extends LightningElement {
  @api train;

  connectedCallback() {
    console.log("Train details received:", this.train);
  }
}
