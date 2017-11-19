
import { TemplateOutput, OperationHandler } from './interfaces'

export const unar = (handler: (x) => TemplateOutput): OperationHandler =>
    compiler => value => props => handler(compiler(value)(props))

export const binar = (handler: (x, y) => TemplateOutput): OperationHandler =>
    compiler => value => {
        if (!Array.isArray(value)) {
            throw new Error()
        }

        if (value.length !== 2) {
            throw new Error()
        }
        return props => handler(
            compiler(value[0])(props),
            compiler(value[1])(props)
        )
    }

export const triar = (handler: (x, y, z) => TemplateOutput): OperationHandler =>
    compiler => value => {
        if (!Array.isArray(value)) {
            throw new Error()
        }

        if (value.length !== 3) {
            throw new Error()
        }
        return props => handler(
            compiler(value[0])(props),
            compiler(value[1])(props),
            compiler(value[2])(props)
        )
    }