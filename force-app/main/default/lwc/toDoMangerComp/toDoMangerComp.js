import { LightningElement, wire } from "lwc";
import TASK_MANAGER from "@salesforce/schema/Task_Manager__c";
import TASK_MANAGER_ID from "@salesforce/schema/Task_Manager__c.Id";
import TASK_NAME from "@salesforce/schema/Task_Manager__c.Name";
import TASK_DATE from "@salesforce/schema/Task_Manager__c.Task_Date__c";
import TASK_COMPLETED_DATE from "@salesforce/schema/Task_Manager__c.Completed_Date__c";
import TASK_IS_COMPLETED from "@salesforce/schema/Task_Manager__c.Is_Completed__c";
import {
  createRecord,
  deleteRecord,
  updateRecord
} from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getTaskManagerData from "@salesforce/apex/toDoManagerHandlerClass.getTaskManagerData";
import getTaskCompletedData from "@salesforce/apex/toDoManagerHandlerClass.getTaskCompletedData";
import { refreshApex } from "@salesforce/apex";

export default class ToDoMangerComp extends LightningElement {
  newTask = "";
  newDate = null;
  incompleteTask = [];
  completeTask = [];
  incompleteTaskResult;
  completeTaskResult;

  @wire(getTaskManagerData)
  wireGetIncompleteTask(result) {
    this.incompleteTaskResult = result;
    let { data, error } = result;
    if (error) {
      console.log("Error: ", error);
    } else if (data) {
      this.incompleteTask = data.map((currItem) => ({
        taskId: currItem.Id,
        newTask: currItem.Name,
        newDate: currItem.Task_Date__c
      }));
    }
  }

  @wire(getTaskCompletedData)
  wireGetCompleteTask(result) {
    this.completeTaskResult = result;
    let { data, error } = result;
    if (error) {
      console.log("Error: ", error);
    } else if (data) {
      this.completeTask = data.map((currItem) => ({
        taskId: currItem.Id,
        newTask: currItem.Name,
        newDate: currItem.Task_Date__c
      }));
    }
  }

  changeHandler(event) {
    let { name, value } = event.target;
    if (name === "txt") {
      this.newTask = value;
    } else if (name === "date") {
      this.newDate = value;
    }
  }

  resetHandlerClick() {
    this.newTask = "";
    this.newDate = null;
  }

  addTaskHandlerClick() {
    let inputFields = {};
    inputFields[TASK_NAME.fieldApiName] = this.newTask;
    inputFields[TASK_DATE.fieldApiName] = this.newDate;
    inputFields[TASK_IS_COMPLETED.fieldApiName] = false;

    if (!this.newDate) {
      this.newDate = new Date().toISOString().slice(0, 10);
    }
    if (this.validateTask()) {
      //   this.incompleteTask = [
      //     ...this.incompleteTask,
      //     {
      //       newTask: this.newTask,
      //       newDate: this.newDate
      //     }
      //   ];
      //   this.resetHandlerClick();
      //   let sortedArray = this.sortTaskArray(this.incompleteTask);
      //   this.incompleteTask = [...sortedArray];
      //   console.log("Tasks: ", this.incompleteTask);

      let recordInput = {
        apiName: TASK_MANAGER.objectApiName,
        fields: inputFields
      };

      createRecord(recordInput)
        .then((result) => {
          console.log("Task Created: ", result);
          this.showToastEvent(
            "Success",
            "Task Created Successfully",
            "success"
          );
          this.resetHandlerClick();
          refreshApex(this.incompleteTaskResult);
        })
        .catch((error) => {
          console.log("Task Created Failed: ", error);
        });
    }
  }

  validateTask() {
    let isValid = true;
    let element = this.template.querySelector(".taskname");

    if (!this.newTask) {
      //check task is empty
      isValid = false;
    } else {
      let taskItem = this.incompleteTask.find((currItem) => {
        return (
          currItem.newTask === this.newTask && currItem.newDate === this.newDate
        );
      });

      if (taskItem) {
        isValid = false;
        element.setCustomValidity("Task is already available");
      }
    }

    if (isValid) {
      element.setCustomValidity(" ");
    }
    element.reportValidity();
    return isValid;
  }

  sortTaskArray(inputTask) {
    let sortTask = inputTask.sort((a, b) => {
      const dateA = new Date(a.newDate);
      const dateB = new Date(b.newDate);
      return dateA - dateB;
    });
    return sortTask;
  }

  async deleteTaskHandler(event) {
    let recordId = event.target.name;
    // this.incompleteTask.splice(index, 1);
    // this.refreshData();
    try {
      await deleteRecord(recordId);
      this.showToastEvent("Success", "Task Deleted Successfully", "success");
      await refreshApex(this.incompleteTaskResult);
    } catch (error) {
      console.log("Task Deletion Failed: ", error);
    }
    // .then(() => {
    //   this.showToastEvent("Success", "Task Deleted Successfully", "success");
    //   refreshApex(this.incompleteTaskResult);
    // })
    // .catch(() => {
    //   this.showToastEvent("Error", "Task Deletion Failed", "error");
    // });
  }

  completeTaskHandler(event) {
    let recordId = event.target.name;
    this.refreshData(recordId);
  }

  dragStartHandler(event) {
    event.dataTransfer.setData("index", event.target.dataset.item);
  }

  dragOverHandler(event) {
    event.preventDefault();
  }

  dropHandler(event) {
    event.preventDefault();
    let recordId = event.dataTransfer.getData("index");
    this.refreshData(recordId);
  }

  async refreshData(recordId) {
    let inputFields = {};
    inputFields[TASK_MANAGER_ID.fieldApiName] = recordId;
    inputFields[TASK_IS_COMPLETED.fieldApiName] = true;
    inputFields[TASK_COMPLETED_DATE.fieldApiName] = new Date()
      .toISOString()
      .slice(0, 10);
    let recordInput = {
      fields: inputFields
    };

    try {
      await updateRecord(recordInput);
      this.showToastEvent("Success", "Task Updated Successfully", "success");
      await refreshApex(this.incompleteTaskResult);
      await refreshApex(this.completeTaskResult);
    } catch (error) {
      console.log("Task Updation Failed: ", error);
    }
    // let removeItem = this.incompleteTask.splice(index, 1);
    // let sortedArray = this.sortTaskArray(this.incompleteTask);
    // this.incompleteTask = [...sortedArray];
    // console.log("Tasks: ", this.incompleteTask);
    // this.completeTask = [...this.completeTask, removeItem[0]];
  }

  showToastEvent(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }
}
