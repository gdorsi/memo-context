const rewire = require("rewire")
const memo_context = rewire("./memo-context")
const Store = memo_context.__get__("Store")
const Tracker = memo_context.__get__("Tracker")
// @ponicode
describe("Store", () => {
    test("0", () => {
        let callFunction = () => {
            Store()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("Tracker", () => {
    test("0", () => {
        let callFunction = () => {
            Tracker()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("memo_context.createMemoContext", () => {
    test("0", () => {
        let callFunction = () => {
            memo_context.createMemoContext({ key: "Elio" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            memo_context.createMemoContext({ key: "elio@example.com" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            memo_context.createMemoContext({ key: "Dillenberg" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            memo_context.createMemoContext(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("memo_context.useMemoContext", () => {
    test("0", () => {
        let callFunction = () => {
            memo_context.useMemoContext("Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            memo_context.useMemoContext("Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            memo_context.useMemoContext("George")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            memo_context.useMemoContext("Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            memo_context.useMemoContext("Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            memo_context.useMemoContext(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
