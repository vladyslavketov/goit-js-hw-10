import './css/styles.css';
import './css/contries.css';

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
  return e.target.value.trim();
}

function useFoundCountries(foundCountries) {
  // console.error(foundCountries.message);

  if (foundCountries.message === 'Page Not Found' || foundCountries.message === 'Not Found') {
    console.error(error);
  } else if (foundCountries.length === 1) {
    const countryMarkup = (createCountryMarkup(foundCountries));

    refs.ul.innerHTML = "";
    refs.div.innerHTML = countryMarkup;
    // refs.div.insertAdjacentHTML('beforeend', countryMarkup);

  } else if (foundCountries.length > 1 && foundCountries.length <= 10) {
    const countriesListMarkup = createCountriesListMarkup(foundCountries);

    refs.div.innerHTML = "";
    refs.ul.insertAdjacentHTML('beforeend', countriesListMarkup);

  } else if (foundCountries.length > 10) {
    Notify.info("Too many matches found. Please enter a more specific name.");
    refs.div.innerHTML = "";
    refs.ul.innerHTML = "";
  }
}

function onFetchError(error) {
  Notify.info("Oops, there is no country with that name");
  console.error("Oops, there is no country with that name");
}

function createCountriesListMarkup(foundCountries) {
  return foundCountries
    .map(({ name, flags }) => {
      return `
        <li class="country-item">
          <img class="country-info__img" src="${flags.svg}" alt="${name.official}" width="60" height="30">
          <p class="country-info__title">${name.official}</p>
        </li>
      `;
    })
    .join('');
}

function createCountryMarkup(foundCountries) {
  return foundCountries
    .map(({ name, flags, capital, population, languages }) => {
      const langList = Object.values(languages).join(', ');

      return `
          <div class="country-info__inner">
            <img class="country-info__img" src="${flags.svg}" alt="${name.official}" width="60" height="30">
            <p class="country-info__title">${name.official}</p>
          </div>
          <p class="country-info__desc">Capital:<span>${capital}</span></p>
          <p class="country-info__desc">Population:<span>${population}</span></p>
          <p class="country-info__desc">Languages:<span>${langList}</span></p>
      `;
    })
    .join('');
}