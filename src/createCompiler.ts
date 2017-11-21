import { Compiler,TemplateObject, TemplateFunction} from './interfaces'
import { defaultOperationsMap } from './defaultOperatorsMap'

export function createCompiler(operatorsMap = defaultOperationsMap): Compiler {
    
        const compiler: Compiler = <P extends Object>(template: TemplateObject): TemplateFunction<P> => {
            switch (typeof template) {
                case 'number':
                case 'string':
                case 'boolean':
                    return () => template
                case 'object':
    
                    if (Array.isArray(template)) {
                        return props => template.map(item => compiler<P>(item)(props))
                    }
    
                    for (let i = 0; i < operatorNames.length; i++) {
                        const name = operatorNames[i]
                        let parameters = template[name]
                        if (parameters !== undefined) {
                            if (Object.keys(template).length !== 1) {
                                throw new Error('only one key is allowed')
                            }
                            const operator = operators[i]
                            return operator(parameters)
                        }
                    }
    
                    return props => {
                        let res = {}
                        Object.keys(template).forEach(key => {
                            res[key] = compiler(template[key])(props)
                        })
                        return res
                    }
    
                default:
                    throw new Error('wrong template')
    
            }
        }
    
        const operatorNames = Object.keys(operatorsMap)
    
        const operators = operatorNames.map(name => operatorsMap[name](compiler))
    
        return compiler
    }
    