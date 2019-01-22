/**
 * Creates the user's card from the supplied data and attaches it to the DOM
 * @param {string} imgUrl 
 * @param {string} nameTag 
 * @param {string} fullName 
 * @param {string} email 
 * @param {string} cityState 
 */
function createCard(imgUrl, nameTag, fullName, email, cityState) {
    const gallery = $('#gallery');
    const cardDiv = $('<div class="card"></div>');
    const imgContainer = $('<div class="card-img-container"></div>');
    const infoContainer = $('<div class="card-info-container"></div>');
    const img = $(`<img class="card-img" src="${imgUrl}" alt="profile picture">`);
    const h3 = $(`<h3 id="${nameTag}" class="card-name cap">${fullName}</h3>`);
    const emailP = $(`<p class="card-text">${email}</p>`);
    const locationP = $(`<p class="card-text cap">${cityState}</p>`);

    gallery.append(cardDiv);
    cardDiv.append(imgContainer).append(infoContainer);
    imgContainer.append(img);
    infoContainer.append(h3).append(emailP).append(locationP);
}

/**
 * Callback function for the GET request to handle the user data
 * @param {object} userData - Data returned from the Random User API
 */
let users;
function generator(userData) {
    users = userData.results;
    users.forEach(user => {
        // console.log(user);

        const img = user.picture.thumbnail;
        const firstName = user.name.first;
        const lastName = user.name.last;
        const nameTag = `${firstName}-${lastName}`;
        const fullName = `${firstName} ${lastName}`;
        const cityState = `${user.location.city}, ${abbrState(user.location.state)}`;

        createCard(img, nameTag, fullName, user.email, cityState);
    })
}

/**
 * Returns a state or province's two-letter abbreviation
 * @param {string} stateName 
 * @returns {string} state abbreviation
 */
function abbrState(stateName) {
    let abbr;
    states.forEach(state => {
        if (state.name.toUpperCase() === stateName.toUpperCase()) {
            abbr = state.abbr;
        }
    })
    return abbr;
}

// get data
$.getJSON('https://randomuser.me/api/?exc=login,registered,nat,gender,phone&nat=us,ca&results=12', generator);
// generate a card for each user