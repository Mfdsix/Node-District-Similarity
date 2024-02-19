const stringSimilarity = require('string-similarity');

const PROVINCES = require('./sources/provinces.json');
const CITIES = require('./sources/cities.json');
const DISTRICTS = require('./sources/districts.json');

function trigramSimilarity(word1, word2) {
    const similarity = stringSimilarity.compareTwoStrings(word1.toLowerCase(), word2.toLowerCase());

    return similarity;
}

function searchProvince(search) {
    let bestScore = 0;
    let bestMatch;
    
    PROVINCES.map((province) => {
        const score = trigramSimilarity(search, province.name)
        if(score > bestScore){
            bestScore = score
            bestMatch = province
        }
    })

    return bestMatch
}

function searchCity(search) {
    let bestScore = 0;
    let bestMatch;
    
    CITIES.map((city) => {
        const score = trigramSimilarity(search, city.name)
        if(score > bestScore){
            bestScore = score
            bestMatch = city
        }
    })

    return bestMatch
}

function searchDistrict(search) {
    let bestScore = 0;
    let bestMatch;
    
    DISTRICTS.map((district) => {
        const score = trigramSimilarity(search, district.name)
        if(score > bestScore){
            bestScore = score
            bestMatch = district
        }
    })

    return bestMatch
}

// Example usage
console.log(searchProvince('jabarat'))
console.log(searchCity('krawang'))
console.log(searchDistrict('lari'))