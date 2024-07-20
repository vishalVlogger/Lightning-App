import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";

export default class NavigationComp extends NavigationMixin(LightningElement) {
  navigationHandler() {
    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "home"
      }
    });
  }

  navToAccListHandler() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        actionName: "list",
        objectApiName: "Account"
      },
      state: {
        filterName: "AllAccounts"
      }
    });
  }

  navToNewAccHandler() {
    const defaultValues = encodeDefaultFieldValues({
      Rating: "Cold",
      Industry: "Energy",
      BillingCity: "San Francisco",
      BillingCountry: "US",
      BillingPostalCode: "94105",
      BillingState: "CA",
      BillingStreet: "One Market Street",
      Name: "Sample Account",
      Type: "Prospect"
    });

    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        actionName: "new",
        objectApiName: "Account"
      },
      state: {
        defaultFieldValues: defaultValues
      }
    });
  }
}
