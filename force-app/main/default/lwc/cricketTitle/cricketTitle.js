import { api, LightningElement } from "lwc";

export default class CricketTitle extends LightningElement {
  @api player;
  @api selectedPlayerId;

  get playerName() {
    return this.player?.Name;
  }

  get playerImage() {
    return this.player?.Image_url__c;
  }

  get titleSelected() {
    return this.selectedPlayerId === this.player.Id ? "tile selected" : "tile";
  }

  clickHandler() {
    console.log("Player Id: ", this.player.Id);

    const playerEvent = new CustomEvent("playerdetails", {
      detail: this.player.Id
    });
    this.dispatchEvent(playerEvent);
  }
}
