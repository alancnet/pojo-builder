import build, { unwrap, isBuilder } from '../src/index';

type Test = {
  some_field: string;
  some_object: {
    some_field?: string;
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

  it('should be able to JSON serialize the root builder', () => {
    const builder = build<Test>({});
    builder.some_object.some_array.push('some_value');
    builder.some_field = 'some_value';
    builder.some_object.some_field = 'some_value';
    const result = JSON.parse(JSON.stringify(builder));
    expect(result).toEqual({ some_field: 'some_value', some_object: { some_field: 'some_value', some_array: ['some_value'] } });
  });

  it('should be able to JSON serialize nested builders', () => {
    const builder = build<Test>({});
    builder.some_object.some_array.push('some_value');
    builder.some_field = 'some_value';
    builder.some_object.some_field = 'some_value';
    const result = JSON.parse(JSON.stringify(builder.some_object));
    expect(result).toEqual({ some_field: 'some_value', some_array: ['some_value'] });
  });

  it('should be able to JSON serialize deeply nested builders', () => {
    const builder = build<Test>({});
    builder.some_object.some_array.push('some_value');
    builder.some_field = 'some_value';
    builder.some_object.some_field = 'some_value';
    const result = JSON.parse(JSON.stringify(builder.some_object.some_array));
    expect(result).toEqual(['some_value']);
  });

  it('should be able to JSON serialize undefined values as null', () => {
    const builder = build<Test>({});
    const result = JSON.parse(JSON.stringify(builder.some_object));
    expect(result).toEqual(null);
  });

  it('should be able to delete properties', () => {
    const builder = build<Test>({});
    builder.some_object.some_field = 'some_value';
    delete builder.some_object.some_field;
    const result = unwrap(builder);
    expect(result).toEqual({ some_object: {} });
  });

  it('should be able to set nested builders', () => {
    const builder = build<Test>({});
    const nestedBuilder = build<Test['some_object']>({});
    nestedBuilder.some_field = 'some_value';
    builder.some_object = nestedBuilder;
    const result = unwrap(builder);
    expect(result).toEqual({ some_object: { some_field: 'some_value' } });
  });
});