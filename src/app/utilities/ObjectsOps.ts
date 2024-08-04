export function importValues(source:any,target:any){
   
    for (const [key, value] of Object.entries(source)) {
        if(Object.getOwnPropertyNames(target).includes(key))
           {
               Object.defineProperty(target, key, withValue(value));
           }
      }
}

  const withValue = (value:any):any =>{
        const d = {
            enumerable: false,
            writable: false,
            configurable: false,
            value,
          };

        // avoiding duplicate operation for assigning value
        if (d.value !== value) d.value = value;
      
        return d;
      }
      