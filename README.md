# pojo-builder

![npm](https://img.shields.io/npm/v/pojo-builder)
![License](https://img.shields.io/npm/l/pojo-builder)
![Build](https://img.shields.io/github/actions/workflow/status/alancnet/pojo-builder/publish.yml?branch=main)
![Downloads](https://img.shields.io/npm/dm/pojo-builder)

`pojo-builder` is a lightweight and intuitive JavaScript/TypeScript library that facilitates the dynamic construction of Plain Old JavaScript Objects (POJOs) using Proxies. It intelligently infers and assigns types (`object` or `array`) based on how nested properties are utilized, allowing for flexible and deferred assignments.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Nested Objects](#nested-objects)
  - [Arrays](#arrays)
  - [Building Elasticsearch Queries](#building-elasticsearch-queries)
  - [Building MongoDB Queries](#building-mongodb-queries)
  - [Conditional Assignments](#conditional-assignments)
- [API Reference](#api-reference)
  - [build(obj)](#buildobj)
  - [unwrap(obj)](#unwrapobj)
  - [isBuilder(obj)](#isbuilderobj)
- [Advanced Usage](#advanced-usage)
- [License](#license)

## Features

- **Deferred Initialization**: Properties are only initialized as objects or arrays when their usage clarifies the intended type.
- **Dynamic Type Inference**: Automatically determines whether a property should be an object or an array based on access patterns.
- **Nested Structures**: Supports multiple levels of nesting with seamless chaining.
- **Function Handling**: Detects and appropriately handles array methods and object methods.
- **Lightweight**: Minimal overhead with no external dependencies.
- **TypeScript Support**: Provides type definitions for a better developer experience.

## Installation

Install `pojo-builder` via npm:

```bash
npm install pojo-builder
```

Or using yarn:

```bash
yarn add pojo-builder
```

## Usage

### Basic Example

Create and build a simple POJO with direct property assignments.

```javascript
import build, { unwrap, isBuilder } from 'pojo-builder';

const builder = build({});

// Assigning a direct field
builder.some_field = 'hello world';

// Retrieving the built object
const result = unwrap(builder);

console.log(result);
/*
Output:
{
  some_field: 'hello world'
}
*/
```

### Nested Objects

Dynamically create nested objects without prior initialization.

```javascript
import build, { unwrap, isBuilder } from 'pojo-builder';

const builder = build({});

// Assigning a nested object field
builder.some_object.some_field = 'hello world';

// Retrieving the built object
const result = unwrap(builder);

console.log(result);
/*
Output:
{
  some_object: {
    some_field: 'hello world'
  }
}
*/
```

### Arrays

Utilize array methods and index assignments to build arrays dynamically.

```javascript
import build, { unwrap, isBuilder } from 'pojo-builder';

const builder = build({});

// Using an array method, which initializes 'some_array' as an array
builder.some_array.push('some_value');

// Assigning to an array index, which initializes 'some_array' as an array
builder.some_array[0] = 'another_value';

// Retrieving the built object
const result = unwrap(builder);

console.log(result);
/*
Output:
{
  some_array: ['another_value']
}
*/
```

### Building Elasticsearch Queries

`pojo-builder` simplifies the construction of complex Elasticsearch queries by allowing direct assignment deep within the object structure without manual initialization.

```javascript
import build, { unwrap } from 'pojo-builder';

const builder = build({});

// Building a complex Elasticsearch query
builder.query.bool.must.push({
  match: {
    title: 'Elasticsearch'
  }
});
builder.query.bool.filter.term.status = 'published';
builder.sort[0].date = { order: 'desc' };

// Retrieving the built Elasticsearch query
const esQuery = unwrap(builder);

console.log(JSON.stringify(esQuery, null, 2));
/*
Output:
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "title": "Elasticsearch"
          }
        }
      ],
      "filter": {
        "term": {
          "status": "published"
        }
      }
    }
  },
  "sort": [
    {
      "date": {
        "order": "desc"
      }
    }
  ]
}
*/
```

### Building MongoDB Queries

Similarly, `pojo-builder` can be used to construct MongoDB queries with conditional and deeply nested fields effortlessly.

```javascript
import build, { unwrap } from 'pojo-builder';

const builder = build({});

// Building a complex MongoDB query
builder.find.name = 'John Doe';
builder.find.age = { $gte: 30 };
builder.find.address.city = 'New York';
builder.update.$set.email = 'john.doe@example.com';
builder.options.sort.age = -1;
builder.options.limit = 10;

// Retrieving the built MongoDB query
const mongoQuery = unwrap(builder);

console.log(JSON.stringify(mongoQuery, null, 2));
/*
Output:
{
  "find": {
    "name": "John Doe",
    "age": {
      "$gte": 30
    },
    "address": {
      "city": "New York"
    }
  },
  "update": {
    "$set": {
      "email": "john.doe@example.com"
    }
  },
  "options": {
    "sort": {
      "age": -1
    },
    "limit": 10
  }
}
*/
```

### Conditional Assignments

When building query objects, you might need to conditionally add fields based on certain conditions. `pojo-builder` allows you to add properties conditionally without worrying about the initialization of intermediate objects and arrays.

#### Example with Elasticsearch

```javascript
import build, { unwrap } from 'pojo-builder';

const builder = build({});

const includeDescription = true;
const includeTags = false;

// Building a conditional Elasticsearch query
builder.query.bool.must.push({
  match: {
    title: 'Advanced Elasticsearch'
  }
});

if (includeDescription) {
  builder.query.bool.must.push({
    match: {
      description: 'Deep dive into Elasticsearch'
    }
  });
}

if (includeTags) {
  builder.query.bool.filter.terms.tags = ['search', 'database'];
}

// Retrieving the built Elasticsearch query
const esQuery = unwrap(builder);

console.log(JSON.stringify(esQuery, null, 2));
/*
Output (includeDescription = true, includeTags = false):
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "title": "Advanced Elasticsearch"
          }
        },
        {
          "match": {
            "description": "Deep dive into Elasticsearch"
          }
        }
      ]
    }
  }
}
*/
```

#### Example with MongoDB

```javascript
import build, { unwrap } from 'pojo-builder';

const builder = build({});

const includeEmail = true;
const includePhone = false;

// Building a conditional MongoDB query
builder.find.username = 'jane_doe';
builder.find.age = { $gte: 25 };

if (includeEmail) {
  builder.find.email = 'jane.doe@example.com';
}

if (includePhone) {
  builder.find.phone = '123-456-7890';
}

builder.update.$set.status = 'active';

const mongoQuery = unwrap(builder);

console.log(JSON.stringify(mongoQuery, null, 2));
/*
Output (includeEmail = true, includePhone = false):
{
  "find": {
    "username": "jane_doe",
    "age": {
      "$gte": 25
    },
    "email": "jane.doe@example.com"
  },
  "update": {
    "$set": {
      "status": "active"
    }
  }
}
*/
```

In both examples, `pojo-builder` automatically initializes the necessary intermediate objects and arrays based on how properties are accessed and assigned, eliminating the need for manual initialization and making the code cleaner and more maintainable.

## API Reference

### `build(obj)`

Creates a builder proxy for the given object. The builder allows for dynamic and deferred property assignments, intelligently inferring whether properties should be objects or arrays based on usage.

#### Parameters

- `obj` (`T`): The initial object to wrap with the builder.

#### Returns

- `T`: A proxy object that facilitates deferred and intelligent property assignments.

#### Example

```javascript
import build, { unwrap } from 'pojo-builder';

const builder = build({});

builder.name = 'John Doe';
builder.address.city = 'New York';

const result = unwrap(builder);
console.log(result);
/*
Output:
{
  name: 'John Doe',
  address: {
    city: 'New York'
  }
}
*/
```

### `unwrap(obj)`

Retrieves the original object from the builder proxy.

#### Parameters

- `obj` (`T`): The builder proxy to unwrap.

#### Returns

- `T`: The original constructed object.

#### Example

```javascript
import { unwrap } from 'pojo-builder';

const builder = build({});
builder.age = 30;

const result = unwrap(builder);
console.log(result);
/*
Output:
{
  age: 30
}
*/
```

### `isBuilder(obj)`

Checks whether a given object is a builder proxy.

#### Parameters

- `obj` (`any`): The object to check.

#### Returns

- `boolean`: `true` if the object is a builder proxy, otherwise `false`.

#### Example

```javascript
import { isBuilder } from 'pojo-builder';

const builder = build({});
console.log(isBuilder(builder)); // true

const plainObject = { name: 'Alice' };
console.log(isBuilder(plainObject)); // false
```

## Advanced Usage

### Handling Functions

`pojo-builder` intelligently handles function calls, especially array methods. When an array method like `push` is invoked, the builder initializes the corresponding property as an array.

```javascript
import build, { unwrap } from 'pojo-builder';

const builder = build({});

// Using array methods
builder.items.push('item1');
builder.items.push('item2');

// Retrieving the built object
const result = unwrap(builder);
console.log(result);
/*
Output:
{
  items: ['item1', 'item2']
}
*/
```

### Conditional Assignments

When building query objects, you might need to conditionally add fields based on certain conditions. `pojo-builder` allows you to add properties conditionally without worrying about the initialization of intermediate objects and arrays.

#### Example with Elasticsearch

```javascript
import build, { unwrap } from 'pojo-builder';

const builder = build({});

const includeDescription = true;
const includeTags = false;

// Building a conditional Elasticsearch query
builder.query.bool.must.push({
  match: {
    title: 'Advanced Elasticsearch'
  }
});

if (includeDescription) {
  builder.query.bool.must.push({
    match: {
      description: 'Deep dive into Elasticsearch'
    }
  });
}

if (includeTags) {
  builder.query.bool.filter.terms.tags = ['search', 'database'];
}

// Retrieving the built Elasticsearch query
const esQuery = unwrap(builder);

console.log(JSON.stringify(esQuery, null, 2));
/*
Output (includeDescription = true, includeTags = false):
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "title": "Advanced Elasticsearch"
          }
        },
        {
          "match": {
            "description": "Deep dive into Elasticsearch"
          }
        }
      ]
    }
  }
}
*/
```

#### Example with MongoDB

```javascript
import build, { unwrap } from 'pojo-builder';

const builder = build({});

const includeEmail = true;
const includePhone = false;

// Building a conditional MongoDB query
builder.find.username = 'jane_doe';
builder.find.age = { $gte: 25 };

if (includeEmail) {
  builder.find.email = 'jane.doe@example.com';
}

if (includePhone) {
  builder.find.phone = '123-456-7890';
}

builder.update.$set.status = 'active';

const mongoQuery = unwrap(builder);

console.log(JSON.stringify(mongoQuery, null, 2));
/*
Output (includeEmail = true, includePhone = false):
{
  "find": {
    "username": "jane_doe",
    "age": {
      "$gte": 25
    },
    "email": "jane.doe@example.com"
  },
  "update": {
    "$set": {
      "status": "active"
    }
  }
}
*/
```

In both examples, `pojo-builder` automatically initializes the necessary intermediate objects and arrays based on how properties are accessed and assigned, eliminating the need for manual initialization and making the code cleaner and more maintainable.

### Avoiding Over-Inference

`pojo-builder` infers the type (`object` or `array`) based on the first usage of a property. Subsequent conflicting usages will not change the initialized type. It's essential to ensure consistent usage to avoid unexpected behaviors.

```javascript
import build, { unwrap } from 'pojo-builder';

const builder = build({});

// First usage as an object
builder.config.settings.theme = 'dark';

// Attempting to use as an array later
builder.config.settings.push('extra_setting'); // This will throw an error

const result = unwrap(builder);
console.log(result);
```

**Note**: Always decide the intended type (`object` or `array`) before performing deep assignments to maintain consistency.

## License

This project is licensed under the [MIT License](LICENSE).

---

**Happy Building!**