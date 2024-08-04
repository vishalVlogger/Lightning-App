import addTodo from "@salesforce/apex/todoTaskManagerClass.addTodo";
import getCurrentTodos from "@salesforce/apex/todoTaskManagerClass.getCurrentTodos";
import { LightningElement, track } from "lwc";

export default class TodoTaskManager extends LightningElement {
  @track time;
  @track greeting;
  @track todos = [];

  connectedCallback() {
    this.getTime();
    this.fetchToDos();
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setInterval(() => {
      this.getTime();
    }, 1000 * 60);
  }

  getTime() {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    this.time = `${this.getHour(hour)}:${this.getDoubleDigit(minute)} ${this.getMidDay(hour)}`;
    this.setGreeting(hour);
  }

  getHour(hour) {
    return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  }

  getMidDay(hour) {
    return hour >= 12 ? "PM" : "AM";
  }

  getDoubleDigit(digit) {
    return digit < 10 ? "0" + digit : digit;
  }

  setGreeting(hour) {
    if (hour < 12) {
      this.greeting = "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      this.greeting = "Good Afternoon";
    } else {
      this.greeting = "Good Evening";
    }
  }

  addTaskHandler() {
    const inputBox = this.template.querySelector("lightning-input");
    const todo = {
      todoName: inputBox.value,
      done: false
    };

    addTodo({ payload: JSON.stringify(todo) })
      .then((result) => {
        console.log("result: ", result);
        this.fetchToDos();
      })
      .catch((error) => {
        console.log("errror: ", error);
      });

    this.todos.push(todo);
    inputBox.value = "";
  }

  fetchToDos() {
    getCurrentTodos()
      .then((result) => {
        this.todos = result;
      })
      .catch((error) => {
        console.log("Fetching Errors: ", error);
      });
  }

  updateEventHandler() {
    this.fetchToDos();
  }

  deleteEventHandler() {
    this.fetchToDos();
  }

  get upcomingTask() {
    return this.todos && this.todos.length
      ? this.todos.filter((todo) => !todo.done)
      : [];
  }

  get completedTask() {
    return this.todos && this.todos.length
      ? this.todos.filter((todo) => todo.done)
      : [];
  }
}
