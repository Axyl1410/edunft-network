import { Cat } from './cat';

describe('Cat', () => {
  it('should be defined', () => {
    expect(new Cat()).toBeDefined();
  });
});
