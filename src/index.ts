const arrayFunctions = new Set(Object.getOwnPropertyNames(Array.prototype))
const objectFunctions = new Set(Object.getOwnPropertyNames(Object.prototype))
const unwrapSymbol = Symbol('unwrap')

export function build<T>(obj: Partial<T>): T {
  const builder = (self: any, parentBuilder?: any, parentSelf?: any, key?: any, onKnown?: any) => {
    // If we don't know what we are yet, create proxy with a function as its
    // target so that we can call it if we turn out to be a function.
    const ref = new Proxy(self === undefined ? () => {} : self, {
      get(_, prop) {
        if (prop === unwrapSymbol) {
          return self
        }
        return builder(self?.[prop], ref, self, prop, (val: any) => {
          // Self-discovery from 2 levels deep
          if (parentSelf === undefined) {
            throw new Error(`Cannot call ${String(prop)} on an unknown type`)
          }
          self = val
          parentBuilder[key] = val
        })
      },
      set(_, prop, value) {
        if (self === undefined) {
          if (typeof prop === 'string' && /^\d+$/.test(prop)) {
            // We're an array
            self = []
          } else {
            // We're an object
            self = {}
          }
          parentBuilder[key] = self
        }
        self[prop] = value
        return true
      },
      apply(t, thisArg, args) {
        if (parentBuilder === undefined) {
          return t()
        }
        if (parentSelf === undefined) {
          if (arrayFunctions.has(key)) {
            // We're a function on an array
            parentSelf = []
          } else if (objectFunctions.has(key)) {
            // We're a function on an object
            parentSelf = {}
          } else {
            throw new Error(`Cannot call ${key} on an unknown type`)
          }
          // Inform 2 levels up that we've discovered our type
          onKnown(parentSelf)
        }
        const fn = parentSelf[key]
        if (typeof fn === 'function') {
          return fn.apply(parentSelf, args)
        } else {
          throw new Error(`Cannot call ${key} on ${Array.isArray(parentSelf) ? 'array' : typeof parentSelf}`)
        }
      }
    })
    return ref
  }

  return builder(obj)
}

export function unwrap<T>(obj: T): T {
  return (obj as any)[unwrapSymbol] as T
}

export function isBuilder(obj: any): boolean {
  return !!obj[unwrapSymbol]
}

export default build
