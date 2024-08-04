export function formatTimestamp(ts:string) {
    let [D,M,Y,h,m,s,ap]:any = ts.toLowerCase().split(/\W/);
    h = String(h%12 + (ap == 'am'? 0 : 12)).padStart(2, '0');
    return `${Y}-${M}-${D}T${h}:${m}:${s}Z`;  
  }