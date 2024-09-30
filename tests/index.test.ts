import build, { unwrap, isBuilder } from '../src/index';

type Test = {
  some_field: string;
  some_object: {
    some_field: string;
    some_array: string[];
  };
  some_array: string[];
};

describe('pojo-builder', () => {
  it('should build a simple object', () => {
    const builder = build<Test>({});
    builder.some_field = 'hello world';
    const result = unwrap(builder);
    expect(result).toEqual({ some_field: 'hello world' });
  });

  it('should build nested objects', () => {
    const builder = build<Test>({});
    builder.some_object.some_field = 'hello world';
    const result = unwrap(builder);
    expect(result).toEqual({ some_object: { some_field: 'hello world' } });
  });

  it('should build arrays', () => {
    const builder = build<Test>({});
    builder.some_array.push('some_value');
    builder.some_array[0] = 'another_value';
    const result = unwrap(builder);
    expect(result).toEqual({ some_array: ['another_value'] });
  });

  it('should identify builder objects', () => {
    const builder = build<Test>({});
    expect(isBuilder(builder)).toBe(true);
    const plainObject = { name: 'Alice' };
    expect(isBuilder(plainObject)).toBe(false);
  });

  it('should be able to push to a deep array that does not exist', () => {
    const builder = build<Test>({});
    builder.some_object.some_array.push('some_value');
    const result = unwrap(builder);
    expect(result).toEqual({ some_object: { some_array: ['some_value'] } });
  });
});