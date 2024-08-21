import LightningDataTable from "lightning/datatable";
import customRankTemplate from "./customRank.html";
import customNameTemplate from "./customName.html";
import customImageTemplate from "./customImage.html";
import customPicklistTemplate from "./customPicklist.html";
import customPicklistEditTemplate from "./customPicklistEdit.html";

export default class CustomDataType extends LightningDataTable {
  static customTypes = {
    customNameField: {
      template: customNameTemplate,
      standardCellLayout: true,
      typeAttributes: ["contactName"]
    },
    customRank: {
      template: customRankTemplate,
      standardCellLayout: false,
      typeAttributes: ["rank"]
    },
    customImage: {
      template: customImageTemplate,
      standardCellLayout: true,
      typeAttributes: ["picture"]
    },
    customPicklist: {
      template: customPicklistTemplate,
      editTemplate: customPicklistEditTemplate,
      standardCellLayout: true,
      typeAttributes: ["picklist", "value", "context"]
    }
  };
}
