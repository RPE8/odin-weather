import { Axios as axios } from 'axios';
import './style.css';

console.log(axios);

const searchInput = document.querySelector('.search-field__search-input');

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
	console.log(value);
};

if (searchInput)
	searchInput.addEventListener('input', debounce(onSearchInputLiveChange));

