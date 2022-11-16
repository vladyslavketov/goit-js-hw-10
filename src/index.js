import './css/styles.css';
import debounce from 'lodash.debounce';
// let debounce = require('lodash.debounce');
import API from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('input#search-box'),
  ul: document.querySelector('ul.country-list'),
  div: document.querySelector('div.country-info')
};

refs.input.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const seachCountry = getInputValue(e);

  API.fetchCountries(seachCountry)
    .then(useFoundCountries)
    .catch(onFetchError);
};

function getInputValue(e) {
  return e.target.value;
}

function useFoundCountries(foundCountries) {
  if (foundCountries.length === 1 && foundCountries.status === 404) {
    console.error(error);
    // console.log(error);
  } else if (foundCountries.length === 1) {
    Notify.info("SHOW country card");
    console.log("SHOW country card");
    console.log(foundCountries);
  } else if (foundCountries.length > 1 && foundCountries.length <= 10) {
    Notify.info("SHOW LIST");
    console.log("SHOW LIST");
    const CountriesListMarkup = createCountriesListMarkup(foundCountries);
    refs.ul.insertAdjacentHTML('beforeend', CountriesListMarkup);


  } else if (foundCountries.length > 10) {
    Notify.info("Too many matches found. Please enter a more specific name.");
    console.log("Too many matches found. Please enter a more specific name.");
  } 

  // console.log(foundCountries.length);

  for (const foundCountry of foundCountries) {
    const { name, flags } = foundCountry;
    console.log(name.official);
    console.log(flags.svg);

    // console.log(countryMarkup(name, flags));
  };
}

function onFetchError(error) {
  // alert("Oops, there is no country with that name");
  Notify.info("Oops, there is no country with that name");
  console.log("Oops, there is no country with that name");
}

function createCountriesListMarkup(foundCountries) {
  return foundCountries
    .map(({ name, flags }) => {
      return `
        <li class="country-item">
          <img src="${flags.svg}" alt="${name.official}" width="60" height="60">
          <p>${name.official}</p>
        </li>
      `;
    })
    .join('');
}