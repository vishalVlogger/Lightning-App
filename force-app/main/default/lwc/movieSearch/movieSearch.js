import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import MOVIE_CHANNEL from "@salesforce/messageChannel/movieChannel__c";
const DELAY = 300;

export default class MovieSearch extends LightningElement {
  selectedType = "";
  searchmovies = "";
  selectedPage = "1";
  loading = false;
  searchResult = [];
  delayTimeout;
  selectedMovie;

  @wire(MessageContext)
  messageContext;

  get typeOptions() {
    return [
      { label: "None", value: "" },
      { label: "Movie", value: "movie" },
      { label: "Series", value: "series" },
      { label: "Episode", value: "fiepisodenished" }
    ];
  }

  movieHandleChange(event) {
    let { name, value } = event.target;
    this.loading = true;
    if (name === "type") {
      this.selectedType = value;
    } else if (name === "moviesearch") {
      this.searchmovies = value;
    } else if (name === "pagenumber") {
      this.selectedPage = value;
    }

    clearTimeout(this.delayTimeout);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.searchMovieHandleKeyUp();
    }, DELAY);
  }

  async searchMovieHandleKeyUp() {
    const url = `http://www.omdbapi.com/?s=${this.searchmovies}&type=${this.selectedType}&p=${this.selectedPage}&apikey=b7ba5830`;
    let response = await fetch(url);
    let data = await response.json();
    console.log("Movie Data: ", data);
    this.loading = false;

    if (data.Response === "True") {
      this.searchResult = data.Search;
    }
  }

  get displayAvailable() {
    return this.searchResult.length > 0 ? true : false;
  }

  movieSelectedHandler(event) {
    this.selectedMovie = event.detail;

    const payload = { movieId: this.selectedMovie };
    publish(this.messageContext, MOVIE_CHANNEL, payload);
  }
}
