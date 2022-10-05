import { FToC } from '../src/utils';

describe('FToC', () => {
	it('valid params', () => {
		expect(FToC(200)).toBe(93);
	});
});
