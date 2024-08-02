import { api, LightningElement } from "lwc";

export default class MovieTile extends LightningElement {
  @api movie;
  @api selectedMovieId;

  clickHandler() {
    console.log(this.movie.imdbID);

    const myEvent = new CustomEvent("selectedmovie", {
      detail: this.movie.imdbID
    });
    this.dispatchEvent(myEvent);
  }

  get titleSelected() {
    return this.selectedMovieId === this.movie.imdbID
      ? "tile selected"
      : "tile";
  }
}
