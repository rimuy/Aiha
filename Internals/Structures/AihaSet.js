
class AihaSet extends Set 
{
    constructor(iterable) { 
        super(iterable);

        [
            'every',
            'find', 
            'findIndex',
            'reduce',
            'reduceRight',
            'some',
        ]
            .forEach(method => {

                this[method] = 
                    (callback = function(){}) => [...this][method](callback);
            });

        [
            'map', 
            'filter',
            'sort',
        ]
            .forEach(method => {

                this[method] = 
                    (callback = function(){}) => new AihaSet([...this][method](callback));
            });
    }

    concat(set) 
    {
        if (!(set instanceof AihaSet) || !(set instanceof Set)) 
            throw new Error('Parameter must be an instance of AihaSet or Set.');

        return new AihaSet([...this].concat(...set));
    }

    get(key) 
    {
        return [...this].find(e => e.name === key);
    }

    includes(key, searchElement, fromIndex) 
    {
        return [...this].map(e => e[key]).includes(searchElement, fromIndex);
    }

    indexOf(key, searchElement, fromIndex = 0)
    {
        return [...this].map(e => e[key]).indexOf(searchElement, fromIndex);
    }

    join(separator) 
    {
        return [...this].join(separator);
    }

    pop() 
    {
        const popped = [...this].pop();
        this.delete(popped);

        return popped;
    }

    shift() 
    {
        const shifted = [...this].shift();
        this.delete(shifted);

        return shifted;
    }

    slice(start = 0, end = [...this].length)
    {
        return new AihaSet([...this].slice(start, end));
    }

    toString() 
    {
        return [...this].toString();
    }

    unshift(...items) 
    {
        return new AihaSet([...this].unshift(...items));
    }
}

module.exports = AihaSet;