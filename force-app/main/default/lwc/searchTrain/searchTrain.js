import { LightningElement } from "lwc";
const DELAY = 300;

export default class SearchTrain extends LightningElement {
  selectedFrom = "";
  selectedTo = "";
  selectedTrainDate = null;
  searchResult = [];
  loading = false;
  delayTimeout;

  handleChange(event) {
    let { name, value } = event.target;

    if (name === "fromStation") {
      this.selectedFrom = value;
    } else if (name === "toStation") {
      this.selectedTo = value;
    } else if (name === "trainDate") {
      this.selectedTrainDate = value;
    }
  }

  handleClick() {
    clearTimeout(this.delayTimeout);
    this.loading = true;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.fectchTrainDetails();
    }, DELAY);
  }

  async fectchTrainDetails() {
    const API_KEY = "e40bc0e894msha563dfbfb1d8f20p13c871jsn0cd84f390f09";
    const url = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${this.selectedFrom}&toStationCode=${this.selectedTo}&dateOfJourney=${this.selectedTrainDate}`;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "irctc1.p.rapidapi.com",
          "x-rapidapi-key": API_KEY
        }
      });

      if (response.ok) {
        let result = await response.json();
        this.searchResult = result.data;
        console.log("Search Result:", this.searchResult);
      } else {
        console.error("Failed to fetch train details");
      }
    } catch (error) {
      console.error("Error in fetching train details:", error);
    }
    this.loading = false;
  }

  get displayAvailable() {
    return this.searchResult.length > 0 ? true : false;
  }

  get disableButtonActive() {
    if (this.selectedFrom && this.selectedTo && this.selectedTrainDate) {
      return false;
    }
    return true;
  }
}
