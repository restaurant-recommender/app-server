export const combination = (array: any[]): [any, any][] => 
    array.reduce( (acc, v, i) =>
        acc.concat(array.slice(i+1).map( w => [v, w] )),
    [])