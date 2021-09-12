import { Starship } from './Starship';

class StarWarsUniverse {
  constructor() {
    this.rootUrl = 'https://swapi.boom.dev/api/starships/';
    this.starships = [];
    this.totalStarships = 0;
  }

  async init() {
    this.totalStarships = await this._getStarshipCount();
    await this._createStartships();
  }

  async _getStarshipCount() {
    try {
      const response = await fetch(this.rootUrl);
      const data = await response.json();

      if (data && data.count) {
        // eslint-disable-next-line no-console
        console.log(data.count);

        return data.count;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.err(e);
      throw new Error(`Error while fetching data for entity : ${name} for URL : ${url}`);
    }

    return 0;
  }

  async _createStartships() {
    try {
      let starshipId = 1;
      let nextUrl = `${this.rootUrl}${starshipId}`;

      while (nextUrl && starshipId <= 36) {
        // eslint-disable-next-line no-console
        const response = await fetch(nextUrl);

        if (response.ok) {
          const data = await response.json();
          const { name, consumables, passengers } = data;

          if (this._validateData(consumables, passengers)) {
            this.starships.push(new Starship(name, this._processConsumableValue(consumables), Number(passengers)));
          }
        }
        starshipId += 1;
        nextUrl = `${this.rootUrl}${starshipId}`;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.err(e);
      throw new Error(`Error while fetching starship data`);
    }
  }

  _processConsumableValue(consumableValue) {
    const [value, period] = consumableValue.split(' ');

    switch (period) {
      case ('days'):
        return Number(value);
      case ('months'):
        return Number(value) * 30;
      case ('year'):
        return Number(value) * 365;
      case ('weeks'):
        return Number(value) * 7;
      default:
        return Number(value);
    }
  }

  _validateData(consumable, passenger) {
    if (!consumable || !passenger) {
      return false;
    }
    const consumableValid = consumable !== 'unknown';
    const passengerValid = passenger !== 'n/a' && passenger !== 'unknown' && passenger !== '0';

    return consumableValid && passengerValid;
  }

  get theBestStarship() {
    let maxDaysInSpace = -1;
    let bestStarship = null;

    this.starships.forEach((starship) => {
      if (starship.maxDaysInSpace >= maxDaysInSpace) {
        maxDaysInSpace = starship.maxDaysInSpace;
        bestStarship = starship;
      }
    });

    return bestStarship;
  }
}

export { StarWarsUniverse };
