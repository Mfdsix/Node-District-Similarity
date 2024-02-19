const stringSimilarity = require('string-similarity');
const natural = require('natural');

const PROVINCES = require('./sources/provinces.json');
const CITIES = require('./sources/cities.json');
const DISTRICTS = require('./sources/districts.json');

function trigramSimilarity(word1, word2) {
    const similarity = stringSimilarity.compareTwoStrings(word1.toLowerCase(), word2.toLowerCase());

    return similarity;
}

function calculateTypoScore(str1, str2) {
    const levenshteinDistance = natural.LevenshteinDistance(str1, str2);
    const maxStringLength = Math.max(str1.length, str2.length);
    
    const typoScore = levenshteinDistance / maxStringLength;

    return typoScore;
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

function getProvince(provinceId) {
    for(const province of PROVINCES){
        if(province.id == provinceId){
            return province;
        }
    }

    return null
}

function searchCity(search, isCircular = false) {
    let bestScore = 0;
    let bestMatch;
    
    CITIES.map((city) => {
        const score = trigramSimilarity(search, city.name)
        
        if(score > bestScore){
            bestScore = score
            bestMatch = city
        }
    })

    if(isCircular){
        bestMatch.province = getProvince(bestMatch.province_id)
    }

    return bestMatch
}

function getCity(cityId, isCircular = false) {
    for(const city of CITIES){
        if(city.id == cityId){
            if(isCircular){
                city.province = getProvince(city.province_id)
            }

            return city;
        }
    }

    return null
}

function searchDistrict(search, isCircular = false, isHighAccuracy = false) {
    let bestScore = 0;
    let bestMatch;
    
    DISTRICTS.map((district) => {
        let score = 0;
        if(isHighAccuracy){
            const score1 = trigramSimilarity(search, district.name)
            const score2 = trigramSimilarity(search, district.alt_name)
            const score3 = calculateTypoScore(search, district.name)

            score = (score1 + score2 + (score3)) / 3
        }else{
            score = trigramSimilarity(search, district.name)
        }

        if(score > bestScore){
            bestScore = score
            bestMatch = district
        }
    })

    if(isCircular){
        bestMatch.city = getCity(bestMatch.regency_id, true)
    }

    return bestMatch
}

// Example usage
console.log("searchProvince('jabarat')")
console.log(searchProvince('jabarat'))
console.log("\nsearchCity('krawang')")
console.log(searchCity('krawang'))
console.log("\nsearchDistrict('lari')")
console.log(searchDistrict('lari'))
console.log("\nsearchDistrict('beaksi timr', true)")
console.log(searchDistrict('beaksi timr', true))
console.log("\nsearchDistrict('depik yogya', true, true)")
console.log(searchDistrict('depik yogya', true, true))