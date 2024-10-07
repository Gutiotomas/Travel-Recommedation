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
    btnSearch.addEventListener('click', function () {
        const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
        if (searchInput) {
            searchDestination(searchInput);
        }
    });

    // Clear button event listener
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
        // Check for a specific country
        else {
            displayCitiesForCountry(keyword);
        }
    }

    // Function to display beaches
    function displayBeaches() {
        const destinationDiv = document.getElementById('destination');
        let beachHeader = `<h2>Beaches</h2>`;
        
        let beachesHtml = jsonData.beaches.map(beach => {
            const country = extractCountry(beach.name);  // Extract country from name
            const timeZone = countryTimeZones[country] || 'UTC';  // Fallback to UTC
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

    // Function to display temples
    function displayTemples() {
        const destinationDiv = document.getElementById('destination');
        let templeHeader = `<h2>Temples</h2>`;
        
        let templesHtml = jsonData.temples.map(temple => {
            const country = extractCountry(temple.name);  // Extract country from name
            const timeZone = countryTimeZones[country] || 'UTC';  // Fallback to UTC
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

    // Function to display cities for a specific country
    function displayCitiesForCountry(countryName) {
        const destinationDiv = document.getElementById('destination');
        const country = jsonData.countries.find(country => country.name.toLowerCase() === countryName.toLowerCase());

        if (country) {
            const timeZone = countryTimeZones[country.name] || 'UTC';  // Fallback to UTC
            const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const currentTime = new Date().toLocaleTimeString('en-US', options);

            let citiesHtml = country.cities.map(city => `
                <div class="city">
                    <img src="${city.imageUrl}" alt="${city.name}">
                    <h3>${city.name}</h3>
                    <p>${city.description}</p>
                </div>
            `).join('');

            destinationDiv.innerHTML = `
                <h2>${country.name}</h2>
                <p style="color: white; font-size: 1.2rem; text-align: center;">Current time: ${currentTime}</p>
                ${citiesHtml}
            `;
        } else {
            destinationDiv.innerHTML = `<p>No results found for "${countryName}"</p>`;
        }
    }

    // Function to extract the country from the beach or temple name
    function extractCountry(name) {
        const parts = name.split(',');  // Split by comma
        return parts[1] ? parts[1].trim() : '';  // Return the second part (country)
    }
});

// Function to show thank you alert
function thankyou() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name === "" || email === "" || message === "") {
        alert("Please fill in all fields");
        return false;
    }

    alert('Thank you for contacting us!');
}
