const { createCompiler } = require('../lib/index')


describe('check interfaces', () => {
    it('createCompiler interface', () => {
        expect(typeof createCompiler()).toBe('function')
    })
})


describe('check regular types', () => {
    let compiler;

    beforeAll(() => {
        compiler = createCompiler()
    })

    it('number template', () => {
        const template = compiler(42)
        expect(typeof template).toBe('function')
        expect(template()).toBe(42)
    })

    it('string template', () => {
        const template = compiler('foo')
        expect(typeof template).toBe('function')
        expect(template()).toBe('foo')
    })

    it('boolean template', () => {
        const template = compiler(true)
        expect(typeof template).toBe('function')
        expect(template()).toBe(true)
    })

    it('array template', () => {

        const template1 = compiler([])
        const template2 = compiler([1, 2, 'three', false])
        expect(typeof template1).toBe('function')
        expect(typeof template2).toBe('function')
        expect(template1()).toEqual([])
        expect(template2()).toEqual([1, 2, 'three', false])
    })

    it('pure object template', () => {
        const template = compiler({ 'foo': 'baz' })
        expect(typeof template).toBe('function')
        expect(template()).toEqual({ 'foo': 'baz' })
    })


})


describe('operators', () => {
    let compiler;

    beforeAll(() => {
        compiler = createCompiler()
    })

    describe('ubnormal operator uasge', () => {
        it('only one key is allowed in operation object', () => {
            expect(() => compiler({ '@': 'a', 'foo': 'baz' })).toThrow()
        })
    })

    describe('default operators', () => {

        it ('extract parameters', () => {
            const template1 = compiler({ '@': 'a' })
            const template2 = compiler({ '@': ['a'] })
            const template3 = compiler({ '@': [] })
            const template4 = compiler({ '@': ['a', 'b'] })
            
            expect(template1({'a':10})).toBe(10)
            expect(template1({'b':10})).toBe(undefined)
            expect(template2({'a':10})).toBe(10)
            expect(template3({'foo':'baz'})).toEqual({'foo': 'baz'})
            expect(template4({})).toEqual(undefined)
            expect(template4({a:{b:11}})).toEqual(11)
        })

        it('add', () => {
            const template = compiler({ '@add': [4, 2] })
            expect(template()).toBe(6)
        })

        it('mul', () => {
            const template = compiler({ '@mul': [4, 2] })
            expect(template()).toBe(8)
        })

        it('div', () => {
            const template = compiler({ '@div': [22, 2] })
            expect(template()).toBe(11)
        })

        it('sub', () => {
            const template = compiler({ '@div': [22, 2] })
            expect(template()).toBe(11)
        })

        it('if', () => {
            const template = compiler({
                '@if': [{ '@': 'x' },
                    'foo',
                    'baz'
                ]
            })
            expect(template({ x: true })).toBe('foo')
            expect(template({ x: false })).toBe('baz')
        })

        it ('map', () => {
            const template = compiler({
                '@map': [
                    [ 1, 2, 3, 4, 5],
                    {
                        '@mul': [{'@':'x'}, 2]
                    },
                    'x',
                    'i'
                ]
            })

        })

    })


})

