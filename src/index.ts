import { Axios as axios } from 'axios';
import './style.css';

console.log(axios);

const searchInput = document.querySelector(
	'.search-field__search-input'
) as HTMLInputElement;
const searchButton = document.querySelector(
	'.search-field__search-button'
) as HTMLButtonElement;

function debounce(fn: (...args: unknown[]) => unknown, timeout = 300) {
	let timer: number;
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

const onSearchButtonClick = (event: Event): void => {
	event.preventDefault();

	if (!searchInput) return;

	const value = searchInput.value.trim();
	if (!value || !value.length) {
		searchInput.setCustomValidity('Error');
		showError(searchInput);
	}

	searchInput.setCustomValidity('');
};

const showError = (input: HTMLInputElement): void => {
	if (!input) return;

	input.classList.add('error');
};

const removeError = (input: HTMLInputElement): void => {
	if (!input) return;

	input.classList.remove('error');
};

if (searchInput)
	searchInput.addEventListener('input', debounce(onSearchInputLiveChange));

if (searchButton) {
	searchButton.addEventListener('click', onSearchButtonClick);
}
