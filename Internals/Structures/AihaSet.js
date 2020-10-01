
class AihaSet extends Set 
{
    constructor(iterable) { 
        super(iterable);

        [
            'every',
            'find', 
            'findIndex',
            'some',
        ]
            .forEach(method => {

                this[method] = 
                    (callback = function(){}) => [...this][method](callback);
            });

        [
            'map', 
            'filter',
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

    indexOf(searchElement, fromIndex = 0)
    {
        return [...this].indexOf(searchElement, fromIndex);
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
    
}

module.exports = AihaSet;