import { LightningElement, wire } from "lwc";
import CRICKETER_OBJECT from "@salesforce/schema/Cricketer__c";
import CRICKETER_NATIONALITY from "@salesforce/schema/Cricketer__c.Nationality__c";
import { NavigationMixin } from "lightning/navigation";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import getCricketersInfo from "@salesforce/apex/CricketClassHandler.getCricketersInfo";
import { publish, MessageContext } from "lightning/messageService";
import playerSelected from "@salesforce/messageChannel/playerChannel__c";

export default class CricketerSearch extends NavigationMixin(LightningElement) {
  selectedNationality = "";
  playersOptions = [];
  selectedPlayer;

  @wire(MessageContext)
  messageContext;

  @wire(getObjectInfo, { objectApiName: CRICKETER_OBJECT })
  wireCricketerObj;

  @wire(getPicklistValues, {
    recordTypeId: "$wireCricketerObj.data.defaultRecordTypeId",
    fieldApiName: CRICKETER_NATIONALITY
  })
  wireCricketerNationality;

  nationalityChangeHandler(event) {
    this.selectedNationality = event.target.value;
    this.playerSelectedHandler();
  }

  playerSelectedHandler() {
    if (this.selectedNationality) {
      getCricketersInfo({
        nationality: this.selectedNationality
      })
        .then((result) => {
          this.playersOptions = result;
          console.log("Players: ", this.playersOptions);
        })
        .catch((error) => {
          console.log("Error Fetching Data: ", error);
        });
    }
  }

  get displayAvailable() {
    return this.playersOptions.length > 0 ? true : false;
  }

  navToCrickterRec() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        actionName: "new",
        objectApiName: CRICKETER_OBJECT.objectApiName
      }
    });
  }

  playerDetailHandler(event) {
    this.selectedPlayer = event.detail;
    console.log("Player Id/Details: ", this.selectedPlayer);

    const payload = { playerId: this.selectedPlayer };
    publish(this.messageContext, playerSelected, payload);
  }
}
