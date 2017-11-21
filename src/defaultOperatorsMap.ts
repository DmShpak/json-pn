import { OperationsMap } from './interfaces'
import { unar, binar, triar } from './tools'

/**
 * Extract value from object by path
 * @param target Target object
 * @param path path array
 * @returns value or undefined
 */
const extract = (target: Object, path: any[]) => {
    if (path.length === 0) {
        return target
    }
    else {
        const [...subpath] = path
        const key = subpath.shift().toString()

        if (target.hasOwnProperty(key)) {
            return extract(target[key], subpath)
        }
        else {
            return undefined
        }
    }
}

export const defaultOperationsMap: OperationsMap = {
    //Extract value from poperties
    '@': compiler => value => props => {
        const compiledValue = compiler(value)(props)
        const path = Array.isArray(compiledValue) ? compiledValue : [compiledValue]
        return extract(props, path)
    },
    //Avoid processing of value 
    '@escape': compiler => value => props => value,
    // logical operators
    '@not': unar(x => !x),
    '@and': binar((x, y) => x && y),
    '@or': binar((x, y) => x || y),
    // comparation operators
    '@lt': binar((x, y) => x < y),
    '@le': binar((x, y) => x <= y),
    '@eq': binar((x, y) => x === y),
    '@ge': binar((x, y) => x >= y),
    '@gt': binar((x, y) => x > y),
    // mathematical operators
    '@add': binar((x, y) => x + y),
    '@sub': binar((x, y) => x - y),
    '@mul': binar((x, y) => x * y),
    '@div': binar((x, y) => x / y),
    //
    '@if': triar((opt, yes, no) => opt ? yes : no),
    //array
    '@map': compiler => value => {
        if (!Array.isArray(value)) {
            throw new Error()
        }
        if (value.length !== 4) {
            throw new Error()
        }
        const list = compiler(value[0])

        const map = value[1]
        const valueName = compiler(value[2])
        const indexName = compiler(value[3])
        return props => {
            if (typeof props === 'object') {
                const compiledList = list(props) as Array<any>;
                return compiledList.map((value, index) => {
                    const extended = {
                        ...(props as Object), 
                        [valueName(props).toString()]: value,
                        [indexName(props).toString()]: index,    
                    } 
                    return compiler(map)(extended)
                })
    
            }
        }

    }
}
