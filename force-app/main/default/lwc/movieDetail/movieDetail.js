import { LightningElement, wire } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import MOVIE_CHANNEL from "@salesforce/messageChannel/movieChannel__c";

export default class MovieDetail extends LightningElement {
  subscription = null;
  selectMovieId;
  loadingComponent = false;
  movieData = {};

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        MOVIE_CHANNEL,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleMessage(message) {
    this.selectMovieId = message.movieId;
    console.log("Movie Id: ", this.selectMovieId);
    this.fetchMovieDetails(this.selectMovieId);
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  async fetchMovieDetails(movieId) {
    const url = `http://www.omdbapi.com/?i=${movieId}&plot=full&apikey=b7ba5830`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Data: ", data);
    this.loadingComponent = true;
    this.movieData = data;
  }
}
