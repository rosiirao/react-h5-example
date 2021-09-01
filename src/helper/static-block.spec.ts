import {CA, CB} from './static-block';

// The static is still syntax error when run jest
describe.skip('class static block', () => {
  it('class static block', () => {
    const a = new CA<number>();
    const b = new CB<number>(a, 1);
    expect(b).toBe(1);
  });
});
