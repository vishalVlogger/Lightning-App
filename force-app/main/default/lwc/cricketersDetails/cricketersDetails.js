import { LightningElement, wire } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import playerSelected from "@salesforce/messageChannel/playerChannel__c";
import fetchPlayersDetails from "@salesforce/apex/CricketClassHandler.fetchPlayersDetails";

export default class CricketersDetails extends LightningElement {
  subscription = null;
  playersId;
  loadingComponent = false;
  playersDetails = {};

  // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  @wire(MessageContext)
  messageContext;

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        playerSelected,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }
  // Handler for message received by component
  async handleMessage(message) {
    this.playersId = message.playerId;
    console.log("Received Player ID: ", this.playersId);
    try {
      await this.fetchPlayersData(this.playersId);
    } catch (error) {
      console.log("Error in handleMessage: ", error);
    }
  }

  async fetchPlayersData(playersId) {
    try {
      const result = await fetchPlayersDetails({ playerId: playersId });
      console.log("Fetched Player Details:", result);
      this.playersDetails = result;
      console.log("Player Details:", this.playersDetails);
      this.loadingComponent = true;
    } catch (error) {
      console.error("Error fetching player details:", error);
    }
  }
}
