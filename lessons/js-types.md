# JS Types
MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#symbol_type

“JavaScript is a dynamic language with dynamic types. Variables in JavaScript are not directly associated with any particular value type, and any variable can be assigned (and re-assigned) values of all types…”

“JavaScript is also a weakly typed language, which means it allows implicit type conversion when an operation involves mismatched types, instead of throwing type errors.”

**Primary JS Types:**
- Null
- Undefined
- Boolean
- Number
- BigInt
- String
- Symbol

## Interacting with Primitive Types
When interacting with a primitive value (e.g. a string), JS automatically performs a conversion to a primitive type. This is called “boxing," this can be handled implicitly or explicitly. Boxing allows us to use primitive values as objects and their prototype methods.

## [Boxing](https://javascript.plainenglish.io/javascript-boxing-wrappers-5b5ff9e5f6ab)
### Implicit Boxing
When a primitive value is accessed as an object, JS will automatically convert the primitive value to an object. This is called implicit boxing.

```js
let str str = 'test';
str = str.toUpperCase();
console.log(str); // TEST
```

### Explicit Boxing
When a primitive value is accessed as an object, JS will automatically convert the primitive value to an object. This is called explicit boxing.

```js
let a = new Boolean(true);
if(a) console.log("it's true")// it's true

const b = new Boolean(false)
if(!b) console.log("never runs");// objects are “truthy.“
```

## [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
"The optional chaining (?.) operator accesses an object's property or calls a function. If the object accessed or function called is undefined or null, it returns undefined instead of throwing an error."

```js
const obj = {
	a: 'test',
	b: 'test b',
	c: {
		a: true,
	},
};

console.log(obj?.a); // test
console.log(obj?.c?.a); // true
console.log(obj?.c?.b); // undefined
```

Applying the optional chain to a primitive type you can check if a prototype method exists on that specific primitive object box.

```js
const str = 'test';

// Can you describe what is happening here?
console.log(str.toUpperCase?.()); // TEST
console.log(str.toExponential?.()); // undefined
console.log(new Number(10).toExponential?.()); // 1e+1
```

# [TypeScript](https://www.typescriptlang.org/)
TypeScript is a superset of JavaScript that adds static typing to the language. TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

In general, TS utilizes the basic JS types, but adds a few more. TS also adds the ability to define your own types. The basic TS types can be found [here](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).


## Let's play! [TypeScript Playground](https://www.typescriptlang.org/play)
We are going to take some JS code and convert it to TS. We will also add some TS specific features.

### Variables
Convert each of the following JS variables to explicitly typed TS variables. Generally, TS handle type inference, when possible, but it is often good practice to explicitly define your types.

```js
const t = 'test';
// Example:
// const t: string = 'test';

let a = 10;

const b = true;

const n = [a, b, t];

const fg = {
	a: 10,
	b: 'test',
	c: true,
};
```

### Functions
Convert each of the following JS functions to explicitly typed TS functions.

#### Basic Function
```js
const myFunc = (a, b) => a + b;
```

```ts
const myFunc = (a: number, b: number) => a + b;
```

#### Merge Arrays
```js
const mergeArrays = (a, b) => [...a, ...b];
```

```ts
const mergeArrays = (a: any[], b: any[]) => [...a, ...b];
```

```ts
const mergeArrays = (a: number[], b: number[]) => [...a, ...b];

// Does this compile?
console.log(mergeArrays([1, 2, 3], [4, 5, 6]));

// Does this compile?
console.log(mergeArrays(['a', 2, 3], [4, 5, 6]));
```

#### Creating our own types
```ts
type Animal = {
	name: string;
	age: number;
	id: number|string;
	bio?: string; // Optional type
}

class Dog implements Animal {
	name: string;
	age: number;
	id: number|string;
	bio?: string;

	constructor(name: string, age: number, id: number|string, bio?: string) {
		this.name = name;
		this.age = age;
		this.id = id;
		this.bio = bio;
	}
}

console.log(new Dog('jo', 10, 111));
console.log(new Dog('bo', 5, 222, 'test'));
```

#### Interfaces
Lets go ahead and create our own interface for a 'Car.' We are going to create a base class that implements this interface. We will then create a new class that extends the base class and implements a new extended interface.

1. Create an interface for a `Car` with the following properties:
- Name
- Top Speed
- Features (an array of strings)
- getName (a function that returns a string)
- getFeatures (a function that returns an array of strings)

2. Create a base class, called `BaseCar`, that implements the Car interface.

3. Create a new interface, called `EVCar`, that extends the Car interface. This interface should add a new property called `getNewFeatures` that returns an array of strings.

4. Create a new class, called `Tesla`, that extends the base class and implements the EVCar interface with the new method `getNewFeatures`.


```ts
interface Car {
	name: string;
	topSpeed: number;
	features: string[];
	getName: () => string;
	getFeatures: () => string[];
}

class BaseCar implements Car {
	name: string;
	topSpeed: number;
	features: string[];

	constructor(name: string, topSpeed: number, features: string[]) {
		this.name = name;
		this.topSpeed = topSpeed;
		this.features = features;
	}

	getName() {
		return this.name;
	}

	getFeatures() {
		return this.features;
	}
}

interface EVCar extends Car {
    getNewFeatures: () => string[];
}

class Tesla extends BaseCar implements EVCar {
	getNewFeatures() {
		return [...this.features, 'autopilot'];
	}
}

const tes = new Tesla('t', 200, ['new', 'another'])
console.log(tes.getNewFeatures());
```

#### Bonus: Generics and Types from Types
Using our quicklinks function from starter, which handes an immutable state update on an array of objects.

```ts
interface Link {
    url: string;
    title: string;
    target: boolean;
    rel?: boolean;
}

type Attributes = {
    [key: string]: any
}

type Values<Type> = {
    [Property in keyof Type]?: Type[Property]
}[]

/**
 * An immutable state update.
 * Accepts an array of objects with a key:value pair from the Link interface.
 */

const quickLinkAssign = (values: Values<Link>, attr: Attributes, key: string, cb: ({}) => void) => {};

// quickLinkAssign([ { url: 'test' } ], { link: {} }, 'link', () => {} );
```