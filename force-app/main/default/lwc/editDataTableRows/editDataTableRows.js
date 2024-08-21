import { LightningElement, wire, api, track } from "lwc";
import getContactRecord from "@salesforce/apex/ContactHandlerClass.getContactRecord";
import CONTACT_OBJECT from "@salesforce/schema/Contact";
import CONTACT_LEAD_SOURCE from "@salesforce/schema/Contact.LeadSource";
import { deleteRecord, updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";

const actions = [
  { label: "View", name: "view" },
  { label: "Edit", name: "edit" },
  { label: "Delete", name: "delete" }
];

const leadSourceActions = [
  {
    label: "All",
    checked: true,
    name: "all"
  }
];

const columns = [
  {
    label: "Title",
    fieldName: "Title",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "First Name",
    fieldName: "FirstName",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "Last Name",
    fieldName: "LastName",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "Phone",
    fieldName: "Phone",
    type: "phone",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "Email",
    fieldName: "Email",
    type: "email",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "Lead Source",
    fieldName: "LeadSource",
    type: "customPicklist",
    editable: true,
    typeAttributes: {
      picklist: { fieldName: "leadsorceValues" },
      value: { fieldName: "LeadSource" },
      context: { fieldName: "Id" }
    },
    hideDefaultActions: true,
    actions: leadSourceActions
  },
  {
    label: "Number Of Cases",
    fieldName: "numberOfCases",
    type: "number",
    editable: false,
    hideDefaultActions: true
  },
  {
    label: "Is Bad Contact",
    fieldName: "isBadContact",
    type: "boolean",
    editable: false,
    hideDefaultActions: true
  },
  { type: "action", typeAttributes: { rowActions: actions } }
];

export default class EditDataTableRows extends LightningElement {
  @track contact = [];
  @track leadSourceOptions = [];
  @track draftValues = [];
  @track leadSourceActionArr = [];
  @track contactAllData = [];
  @api recordId;
  disableDeleteButton = true;
  viewMode = false;
  editMode = false;
  showModal = false;
  loadLeadSourceAction = false;
  columns = columns;
  contactRefreshProperty;
  selectedRecordId;
  errors;

  @wire(getContactRecord, {
    accountId: "$recordId",
    leadSource: "$leadSourceOptions"
  })
  wiredContactRecord(result) {
    this.contactRefreshProperty = result;
    if (result.data) {
      this.contact = result.data.map((currItem) => {
        let leadsorceValues = this.leadSourceOptions;
        return {
          ...currItem,
          leadsorceValues: leadsorceValues
        };
      });
      this.contactAllData = [...this.contact];
      this.errors = null;
    } else if (result.error) {
      this.contact = null;
      this.errors = result.error;
      console.log("Errors: ", this.errors);
    }
  }

  @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
  wireContactObject;

  @wire(getPicklistValues, {
    recordTypeId: "$wireContactObject.data.defaultRecordTypeId",
    fieldApiName: CONTACT_LEAD_SOURCE
  })
  wireContactLeadSource({ data, error }) {
    if (data) {
      this.leadSourceOptions = data.values;
      this.leadSourceActionArr = [];
      data.values.forEach((currItem) => {
        this.leadSourceActionArr.push({
          label: currItem.label,
          checked: false,
          name: currItem.value
        });
      });

      this.columns.forEach((currItem) => {
        if (currItem.fieldName === "LeadSource") {
          currItem.actions = [...currItem.actions, ...this.leadSourceActionArr];
        }
      });
      this.loadLeadSourceAction = true;
    } else if (error) {
      console.log("Failing to fetch Picklist Lead Source: ", error);
    }
  }

  rowActionHandler(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    this.selectedRecordId = row.Id;

    this.viewMode = false;
    this.editMode = false;
    this.showModal = false;

    if (actionName === "view") {
      this.viewMode = true;
      this.showModal = true;
    } else if (actionName === "edit") {
      this.editMode = true;
      this.showModal = true;
    } else if (actionName === "delete") {
      this.deleteHandler();
    }
  }

  async deleteHandler() {
    try {
      await deleteRecord(this.selectedRecordId);
      this.showToast("Success", "Contact Deleted Successfully", "success");
      await refreshApex(this.contactRefreshProperty);
    } catch (error) {
      this.showToast("Error", error.body.message, "error");
    }
  }

  async closeModalsHandler() {
    this.showModal = false;

    if (this.editMode) {
      await refreshApex(this.contactRefreshProperty);
    }
  }

  async saveHandlerClick(event) {
    let record = event.detail.draftValues;

    let updateRecordsValues = record.map((currRec) => {
      let fieldInput = { ...currRec };
      return {
        fields: fieldInput
      };
    });

    this.draftValues = [];
    let allPromise = updateRecordsValues.map((currItem) =>
      updateRecord(currItem)
    );

    await Promise.all(allPromise);
    this.showToast("Sucess", "Contact Successfully Updated", "success");
    await refreshApex(this.contactRefreshProperty);
  }

  showToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }

  async headerActionHandler(event) {
    let actionName = event.detail.action.name;
    const colDef = event.detail.columnDefinition;
    const col = [...this.columns];

    console.log("Col Def: ", colDef);

    if (actionName === "all") {
      this.contact = [...this.contactAllData];
    } else {
      this.contact = this.contactAllData.filter((currItem) => {
        // eslint-disable-next-line dot-notation
        return actionName === currItem["LeadSource"];
      });
    }

    col
      .find((currItem) => {
        return currItem.fieldName === "LeadSource";
      })
      .actions.forEach((currItem) => {
        if (currItem.name === actionName) {
          currItem.checked = true;
        } else {
          currItem.checked = false;
        }
      });
    this.columns = [...col];
    await refreshApex(this.contactRefreshProperty);
  }

  get displayData() {
    if (this.contact && this.loadLeadSourceAction === true) {
      return true;
    }
    return false;
  }

  rowSelectionHandler(event) {
    const selectedRows = event.detail.selectedRows;
    if (selectedRows.length > 0) {
      this.disableDeleteButton = false;
    } else {
      this.disableDeleteButton = true;
    }
  }

  async deleteContactsHandleClick() {
    let selectedRecords = this.template
      .querySelector("c-custom-data-type")
      .getSelectedRows();
    let allGoodToDelete = true;

    let selectedRecHaveCase = selectedRecords.filter((currItem) => {
      return currItem.numberOfCases > 0;
    });

    if (selectedRecHaveCase.length > 0) {
      allGoodToDelete = false;
    }

    if (allGoodToDelete) {
      let deleteRowConfirmation = selectedRecords.map((currItem) =>
        deleteRecord(currItem.Id)
      );

      try {
        await Promise.all(deleteRowConfirmation);
        this.showToast("Success", "Record Successfully Deleted", "success");
        this.template.querySelector("c-custom-data-type").selectedRows = [];
        await refreshApex(this.contactRefreshProperty);
      } catch (error) {
        this.showToast(
          "Error",
          "Record Deletion Failed - " + error.body.message,
          "error"
        );
      }
    } else {
      this.showToast(
        "Error",
        "You can't delete contact with open cases",
        "error"
      );
    }
  }
}