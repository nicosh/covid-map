const fs = require('fs');
const us = require('./data.json');
const fips = require('./fips.json');

let res = []
us.map(el =>{
    let f = el.countyFIPS 
    let n = el["2020-04-29"]
    let fdata = fips.filter(elm => elm.fips === f)
    if(fdata && fdata.length > 0){
        let element = fdata[0]
        let tmp = [element.clon00,element.clat00,n]
        res.push(tmp)
    }
})
let data = JSON.stringify(res);  
fs.writeFileSync('./clean-data.json', data);  