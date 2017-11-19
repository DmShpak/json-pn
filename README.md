# json-pn

Simple JSON template language in [Polish notation](https://en.wikipedia.org/wiki/Polish_notation)

# Motivation

Sometimes you would like to encode JSON template by JSON object.

# Features

* Template encoded by JSON object in Polish notation
* Support of mathematical and logical operations
* Support of custom operations
* Conditional operator
* Map operator

# Usage 

## Include

```js
import {createCompiler} from 'json-pn'
```

## Create compiler
```js
const compiler = createCompiler()
```

## Create template function
```js
const hello = compiler({'@add': ["Hello", ${'@':'value'}]})
```

## Use template function

```js
console.log(hello('word')) //Hello word
```
## Custom operators

You can manually set list of supported operators. 

```js
import {createCompiler, defaultOperationsMap} from 'json-pn'
const compiler = createCompiler(defaultOperationsMap)
```

You can register your own operator during compiler creation

```js
import {createCompiler, defaultOperationsMap} from 'json-pn'

const double = compiler => value => {
    const subtemplate = compiler(value)
    return  props =>  subtemplate(props) * 2
} 

const compiler = createCompiler({
    ...defaultOperationsMap,
    '@double': double
})

const four = compiler({'@double': 2)

console.log(four())//4
```

# Operators

## Operators types

### Unar operators

Unar operator use value as single parameter
```js
// ! true
{'@not': true}
```    
### N-ar operatprs
N-ar operators always expects array fixed length. According to operands count can be defined **binar**, **triar**, and other operators 
```js
// 2 + 4
{'@add': [ 2, 4 ]}
//if (true) {return 'foo'} else {return 'baz'}
{'@if': [true, 'foo', 'baz']}
```

## Operators grpups

### Template parameters
####  @ operator 
Unar operator expects *string* or *string[]* in operand. 

### Special

#### @escape operator 
Unar operator.  Just copy operand value without any transformations.

### Mathematical

#### @add 

Binar operator.

#### @rem 

Binar operator.

#### @mul 

Binar operator.

#### @div

Binar operator.

### Logical

#### @not

Unar operator.

#### @and

Binar operator.

#### @or

Binar operator.


### Comparation

#### @lt

Binar operator.

#### @le

Binar operator.

#### @eq

Binar operator.

#### @ge

Binar operator.

#### @gt

Binar operator.

### Array operators

#### @map operator

Tetrar operator. Allows to use template for each array item.

| Operand number | Operand value                                |
| -------------- | -------------------------------------------- |
| 0              | Target array                                 |
| 1              | Template                                     |
| 2              | Array item name it template parameters       |
| 3              | Array item index name in template parameters |

```js
//[1,2,3].map((x,i) => 2 * x  + i)
{
    "@map" : [
        [1, 2, 3], {
            "@add": [
                "@mul" : [ 2, {"@":"x"}],
                {"@":"i"}
            ]
        },
        "x","i"
    ]
}
``` 