import { api, LightningElement } from "lwc";
import deleteTodo from "@salesforce/apex/todoTaskManagerClass.deleteTodo";
import updateTodo from "@salesforce/apex/todoTaskManagerClass.updateTodo";

export default class TodoTaskItem extends LightningElement {
  @api todoId;
  @api todoName;
  @api done = false;

  updateHandler() {
    const todo = {
      todoId: this.todoId,
      todoName: this.todoName,
      done: !this.done
    };

    updateTodo({ payload: JSON.stringify(todo) })
      .then((result) => {
        console.log("Update todo: ", result);
        this.dispatchEvent(new CustomEvent("update"));
      })
      .catch((error) => {
        console.log("Failed update todo: ", error);
      });
  }

  deleteHandler() {
    deleteTodo({ todoId: this.todoId })
      .then((result) => {
        console.log("Delete todo: ", result);
        this.dispatchEvent(new CustomEvent("delete"));
      })
      .catch((error) => {
        console.log("Failed delete todo: ", error);
      });
  }

  get containerClass() {
    return this.done ? "todo completed" : "todo upcoming";
  }

  get iconName() {
    return this.done ? "utility:check" : "utility:add";
  }
}
