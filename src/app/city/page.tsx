import { Country, State, City }  from 'country-state-city';

export default function CityPage() {
    const countries = Country.getAllCountries();
    const states = State.getStatesOfCountry("IN");
    const cities = City.getCitiesOfState("IN", "JH");
    console.log(cities);
  return <div>City Page</div>;
}
