/**
 * Creates the user's card from the supplied data and attaches it to the DOM
 * @param {string} imgUrl 
 * @param {string} nameTag 
 * @param {string} fullName 
 * @param {string} email 
 * @param {string} city
 * @param {string} state
 */
function createCard(imgUrl, nameTag, fullName, email, city, state) {
    const cardDiv = $('<div class="card"></div>');
    const imgContainer = $('<div class="card-img-container"></div>');
    const infoContainer = $('<div class="card-info-container"></div>');
    const img = $(`<img class="card-img" src="${imgUrl}" alt="profile picture">`);
    const h3 = $(`<h3 id="${nameTag}" class="card-name cap">${fullName}</h3>`);
    const emailP = $(`<p class="card-text">${email}</p>`);
    const locationP = $(`<p class="card-text cap">${city}, ${state}</p>`);

    $('#gallery').append(cardDiv);
    cardDiv.append(imgContainer).append(infoContainer);
    imgContainer.append(img);
    infoContainer.append(h3).append(emailP).append(locationP);

    return cardDiv;
}

/**
 * Creates the modal window and appends it to the DOM
 * @param {string} imgUrl 
 * @param {string} nameTag 
 * @param {string} fullName 
 * @param {string} email 
 * @param {string} phone 
 * @param {string} street 
 * @param {string} city 
 * @param {string} state 
 * @param {*} postcode - Either a number or a string
 * @param {string} birthdate 
 */
function createModal(imgUrl, nameTag, fullName, email, phone, street, city, state, postcode, birthdate) {
    const container = $('<div class="modal-container"></div>');
    const modal = $('<div class="modal"></div>');
    const x = $('<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>');
    const dataContainer = $('<div class="modal-info-container"></div>');
    const img = $(`<img class="modal-img" src="${imgUrl}" alt="profile picture">`);
    const h3 = $(`<h3 id="${nameTag}-modal" class="modal-name cap">${fullName}</h3>`);
    const emailP = $(`<p class="modal-text">${email}</p>`);
    const cityP = $(`<p class="modal-text cap">${city}</p>`);
    const hr = $('<hr>');
    const phoneP = $(`<p class="modal-text">${phone}</p>`);
    const addressP = $(`<p class="modal-text cap">${street}, ${city}, ${state} ${postcode}</p>`);
    const birthdateP = $(`<p class="modal-text">Birthday: ${birthdate}</p>`);
    const navContainer = $('<div class="modal-btn-container"></div>');
    const prevButton = $('<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>');
    const nextButton = $('<button type="button" id="modal-next" class="modal-next btn">Next</button>');
    
    $('body').append(container);
    container.append(modal);
    modal.append(x).append(dataContainer).append(navContainer);
    dataContainer
        .append(img).append(h3).append(emailP).append(cityP)
        .append(hr).append(phoneP).append(addressP).append(birthdateP);
    navContainer.append(prevButton).append(nextButton);

    // close the window
    x.click(() => container.hide());
    $(document).keydown(e => {if (e.key === 'Escape') container.hide()});
}

/**
 * Callback function for the GET request to handle the user data
 * @param {object} userData - Data returned from the Random User API
 */
function generator(userData) {
    const users = userData.results;
    users.forEach(user => {
        const img = user.picture.large;
        const firstName = user.name.first;
        const lastName = user.name.last;
        const nameTag = `${firstName}-${lastName}`;
        const fullName = `${firstName} ${lastName}`;
        const email = user.email;
        const phone = formatPhone(user.cell);
        const street = user.location.street;
        const city = user.location.city;
        const state = abbrState(user.location.state);
        const postcode = user.location.postcode;
        const birthdate = formatDate(user.dob.date);

        const card = createCard(img, nameTag, fullName, email, city, state);

        card.click(() => {
            createModal(img, nameTag, fullName, email, phone, street, city, state, postcode, birthdate);
        });
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

/**
 * Transforms a raw date string to a formatted date string
 * @param {string} date 
 * @returns {string} formatted date
 */
function formatDate(date) {
    const newDate = new Date(date);
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const year = newDate.getFullYear();

    return `${month}/${day}/${year}`;
}

function formatPhone(phone) {
    const regex = /^\(?(\d{3})\)?-(\d{3})-(\d{4})$/;
    const newPhone = phone.replace(regex, '($1) $2-$3');
    return newPhone;
}

// get data
$.getJSON('https://randomuser.me/api/?exc=login,registered,nat,gender,phone&nat=us,ca&results=12', generator);