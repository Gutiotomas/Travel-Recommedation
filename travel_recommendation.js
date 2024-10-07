const btnSearch = document.getElementById('search-button');

// Time zone mapping for countries
const countryTimeZones = {
    "Japan": "Asia/Tokyo",
    "Brazil": "America/Sao_Paulo",
    "Australia": "Australia/Sydney",
    "Cambodia": "Asia/Phnom_Penh",
    "French Polynesia": "Pacific/Tahiti",
    "India": "Asia/Kolkata",
};

document.addEventListener('DOMContentLoaded', function () {
    let jsonData;

    // Fetch the JSON data
    fetch('travel_recommendation_api.json')  // Replace with the actual path to the JSON file
        .then(response => response.json())
        .then(data => {
            jsonData = data;  // Store JSON data for search
        })
        .catch(error => console.error('Error fetching the data:', error));

    // Add event listener to the search button
    document.getElementById('search-button').addEventListener('click', function () {
        const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
        if (searchInput) {
            searchDestination(searchInput);
        }
    });

    // Clear button event listener to reset search input and results
    document.getElementById('clear-button').addEventListener('click', function () {
        document.getElementById('search-input').value = '';  // Clear search input
        document.getElementById('destination').innerHTML = '';  // Clear displayed results
    });

    // Function to search destinations based on the input
    function searchDestination(keyword) {
        const destinationDiv = document.getElementById('destination');
        destinationDiv.innerHTML = '';  // Clear previous results

        // Check for beaches
        if (keyword === 'beach' || keyword === 'beaches') {
            displayBeaches();
        }
        // Check for temples
        else if (keyword === 'temple' || keyword === 'temples') {
            displayTemples();
        }
        // Check for countries
        else if (keyword === 'country' || keyword === 'countries') {
            displayCountries();
        } else {
            destinationDiv.innerHTML = `<p>No results found for "${keyword}"</p>`;
            const noResultsMessage = destinationDiv.querySelector('p');
            noResultsMessage.style.color = 'white';
            noResultsMessage.style.fontSize = '1.2rem';
            noResultsMessage.style.textAlign = 'center';
        }
    }

    function extractCountry(name) {
        const parts = name.split(',');  // Split by comma
        return parts[1] ? parts[1].trim() : '';  // Return the second part (country), or an empty string if not found
    }
    

    // Function to display beaches
    // Function to display beaches with time
function displayBeaches() {
    const destinationDiv = document.getElementById('destination');
    let beachHeader = `<h2>Beaches</h2>`;
    
    let beachesHtml = jsonData.beaches.map(beach => {
        const country = extractCountry(beach.name);  // Extract country from name
        const timeZone = countryTimeZones[country] || 'UTC';  // Fallback to UTC if not found
        const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const currentTime = new Date().toLocaleTimeString('en-US', options);
        
        return `
            <div class="beach">
                <img src="${beach.imageUrl}" alt="${beach.name}">
                <h3>${beach.name}</h3>
                <p>${beach.description}</p>
                <p>Current time in ${country}: ${currentTime}</p>  <!-- Display time -->
            </div>
        `;
    }).join('');
    
    destinationDiv.innerHTML += beachHeader + beachesHtml;
}

// Function to display temples with time
function displayTemples() {
    const destinationDiv = document.getElementById('destination');
    let templeHeader = `<h2>Temples</h2>`;
    
    let templesHtml = jsonData.temples.map(temple => {
        const country = extractCountry(temple.name);  // Extract country from name
        const timeZone = countryTimeZones[country] || 'UTC';  // Fallback to UTC if not found
        const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const currentTime = new Date().toLocaleTimeString('en-US', options);
        
        return `
            <div class="temple">
                <img src="${temple.imageUrl}" alt="${temple.name}">
                <h3>${temple.name}</h3>
                <p>${temple.description}</p>
                <p>Current time in ${country}: ${currentTime}</p>  <!-- Display time -->
            </div>
        `;
    }).join('');
    
    destinationDiv.innerHTML += templeHeader + templesHtml;
}


    // Function to display all countries and their cities along with the current time
    function displayCountries() {
        const destinationDiv = document.getElementById('destination');
        let countriesHtml = jsonData.countries.map(country => {
            // Get the current time in the country's time zone
            const timeZone = countryTimeZones[country.name] || 'UTC';  // Fallback to UTC if time zone is not defined
            const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const currentTime = new Date().toLocaleTimeString('en-US', options);

            // Display each city's information under the country
            let citiesHtml = country.cities.map(city => `
                <div class="city">
                    <img src="${city.imageUrl}" alt="${city.name}">
                    <h3>${city.name}</h3>
                    <p>${city.description}</p>
                </div>
            `).join('');

            // Display the country name, current time, and cities
            return `
                <h2>${country.name}</h2>
                <p style="color: white; font-size: 1.2rem; text-align: center;">Current time: ${currentTime}</p>
                ${citiesHtml}  <!-- Display cities under the time -->
            `;
        }).join('');

        destinationDiv.innerHTML = countriesHtml;  // Append the entire result to the destination div
    }
});

btnSearch.addEventListener('click', displayDestinations);

function thankyou(){
    alert('Thank you for contacting us!')
}