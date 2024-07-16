import { LightningElement } from "lwc";

export default class ToDoMangerComp extends LightningElement {
  newTask = "";
  newDate = null;
  incompleteTask = [];
  completeTask = [];

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
    if (!this.newDate) {
      this.newDate = new Date().toISOString().slice(0, 10);
    }

    if (this.validateTask()) {
      this.incompleteTask = [
        ...this.incompleteTask,
        {
          newTask: this.newTask,
          newDate: this.newDate
        }
      ];
      this.resetHandlerClick();
      let sortedArray = this.sortTaskArray(this.incompleteTask);
      this.incompleteTask = [...sortedArray];
      console.log("Tasks: ", this.incompleteTask);
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

  deleteTaskHandler(event) {
    let index = event.target.name;
    this.incompleteTask.splice(index, 1);
    this.refreshData();
  }

  completeTaskHandler(event) {
    let index = event.target.name;
    this.refreshData(index);
  }

  dragStartHandler(event) {
    event.dataTransfer.setData("index", event.target.dataset.item);
  }

  dragOverHandler(event) {
    event.preventDefault();
  }

  dropHandler(event) {
    event.preventDefault();
    let index = event.dataTransfer.getData("index");
    this.refreshData(index);
  }

  refreshData(index) {
    let removeItem = this.incompleteTask.splice(index, 1);
    let sortedArray = this.sortTaskArray(this.incompleteTask);
    this.incompleteTask = [...sortedArray];
    console.log("Tasks: ", this.incompleteTask);
    this.completeTask = [...this.completeTask, removeItem[0]];
  }
}
