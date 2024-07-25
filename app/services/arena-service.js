// API to find the sports arena in a particular location using google maps API
export const searchArenas = async (sport, city) => {

    let responseData = {};
    let result = [];

    // Fetching the data through the google maps api
    await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${sport}+facilities+in+${city}&key=${process.env.API_KEY}`
        , {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            responseData = { ...data['results'] };
            for (const [key, value] of Object.entries(responseData)) {
                const obj = new Object();
                obj['id'] = value['place_id']
                obj['name'] = value['name'];
                obj['location'] = value['formatted_address'];
                obj['rating'] = value['rating'];
                result.push(obj);
            };
            // console.log(result);
            // console.log(responseData);
        })
        .catch(error => console.error('Error fecthing from the maps API:', error));

    return result;

}