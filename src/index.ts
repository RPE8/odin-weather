import { default as axios } from 'axios';
import './style.css';

console.log(axios);

type TWeatherResponse = {
	data: {
		main: {
			temp: number;
			humidity: number;
			pressure: number;
		};
	};
};

const requester = axios.create({
	baseURL: 'https://api.openweathermap.org/'
});

const searchInput = document.querySelector(
	'.search-field__search-input'
) as HTMLInputElement;
const searchButton = document.querySelector(
	'.search-field__search-button'
) as HTMLButtonElement;
const weatherCard = document.querySelector('.weather-card') as HTMLDivElement;
const locationEl = document.querySelector(
	'.weather-card__location'
) as HTMLSpanElement;
const temperatureEl = weatherCard.querySelector(
	'.weather-card__temperature'
) as HTMLSpanElement;
const humidityEl = weatherCard.querySelector(
	'.weather-card__humidity'
) as HTMLSpanElement;
const pressureEl = weatherCard.querySelector(
	'.weather-card__pressure'
) as HTMLSpanElement;

function debounce(fn: (...args: unknown[]) => unknown, timeout = 300) {
	let timer: NodeJS.Timeout;
	return (...args: unknown[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, timeout);
	};
}

const onSearchInputLiveChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const value = target.value;

	if (value.trim()) {
		removeError(searchInput);
	}
};

const onSearchButtonClick = async (event: Event): Promise<void> => {
	event.preventDefault();

	if (!searchInput) return;

	const value = searchInput.value.trim();
	if (!value || !value.length) {
		searchInput.setCustomValidity('Invalid location');
		showError(searchInput);
		searchInput.reportValidity();
		return Promise.reject();
	}

	searchInput.setCustomValidity('');
	try {
		const {
			data: {
				main: { temp, humidity, pressure }
			}
		} = await loadDataByLocation(value);
		updateWeatherCard(temp, humidity, pressure, value);
		return Promise.resolve();
	} catch (err) {
		searchInput.setCustomValidity('Invalid location');
		showError(searchInput);
		searchInput.reportValidity();
		return Promise.reject();
	}
};

const showError = (input: HTMLInputElement): void => {
	if (!input) return;

	input.classList.add('error');
};

const removeError = (input: HTMLInputElement): void => {
	if (!input) return;

	input.classList.remove('error');
};

const loadDataByLocation = (location: string): Promise<TWeatherResponse> => {
	return requester.get('data/2.5/weather', {
		params: {
			q: location,
			appid: 'e99cfc6ee3bdb8cc06ee485de8187f28',
			units: 'metric'
		}
	});
};

export const FToC = (temp: number): number => {
	return Math.round((temp - 32) / 1.8);
};

const updateWeatherCard = (
	temp: number,
	humidity: number,
	pressure: number,
	location: string
) => {
	if (!temp || !humidity || !pressure) {
		weatherCard.classList.add('invisible');
	}
	temperatureEl.textContent = `${Math.round(temp)}`;
	humidityEl.textContent = `Humidity: ${humidity}`;
	pressureEl.textContent = `Pressure: ${pressure}`;
	locationEl.textContent = location;
	weatherCard.classList.remove('invisible');
};

if (searchInput)
	searchInput.addEventListener('input', debounce(onSearchInputLiveChange));

if (searchButton) {
	searchButton.addEventListener('click', onSearchButtonClick);
}
