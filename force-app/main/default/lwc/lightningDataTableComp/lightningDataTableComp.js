import fetchContactRecord from "@salesforce/apex/ContactHandlerClass.fetchContactRecord";
import { LightningElement, track, wire } from "lwc";

const columns = [
  {
    label: "Name",
    type: "customNameField",
    typeAttributes: {
      contactName: {
        fieldName: "Name"
      }
    }
  },
  {
    label: "Title",
    fieldName: "Title",
    cellAttributes: {
      class: {
        fieldName: "titleColor"
      }
    }
  },
  {
    label: "Account",
    fieldName: "accountLink",
    type: "url",
    typeAttributes: {
      label: {
        fieldName: "accountName"
      },
      target: "_blank"
    }
  },
  { label: "Phone", fieldName: "Phone", type: "phone" },
  { label: "Email", fieldName: "Email", type: "email" },
  {
    label: "Rank",
    fieldName: "Rank__c",
    type: "customRank",
    typeAttributes: {
      rank: {
        fieldName: "rankIcon"
      }
    }
  },
  {
    label: "Picture",
    type: "customImage",
    typeAttributes: {
      picture: {
        fieldName: "Picture__c"
      }
    },
    cellAttributes: {
      alignment: "center"
    }
  }
];

export default class LightningDataTableComp extends LightningElement {
  @track contacts = [];
  columns = columns;
  errors;

  @wire(fetchContactRecord)
  wireContacts({ error, data }) {
    if (error) {
      this.contacts = null;
      this.errors = error;
    } else if (data) {
      this.contacts = data.map((record) => {
        let accountLink = "/" + record.AccountId;
        let accountName = record.Account.Name;
        let titleColor = "slds-text-color_success";
        let rankIcon = record.Rank__c > 5 ? "utility:ribbon" : "";

        return {
          ...record,
          accountLink: accountLink,
          accountName: accountName,
          titleColor: titleColor,
          rankIcon: rankIcon
        };
      });
      this.errors = null;
    }
  }
}
