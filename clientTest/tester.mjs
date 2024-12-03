const microPort = '3003';

import express from 'express';

const app = express();
app.use(express.json());

const favoriteData = {
    data: {
        user: "674e155690558860cca17ecd",
        recipe: "Pasta"
    }
};

const userFavoritesData = {
    user: "674e155690558860cca17ecd"
};

// Function to add a favorite
async function addFavorite(favoriteData) {
    const url = `http://localhost:${microPort}/addFavorite`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(favoriteData) // Convert the JavaScript object to a JSON string
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Add Favorite Response: ${data.message}`);
    } catch (error) {
        console.error('Error making the request:', error);
    }
}

// Function to get favorites
async function getFavorites(userFavoritesData) {
    const user = userFavoritesData.user;
    const url = `http://localhost:${microPort}/favorites/${user}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Get Favorites Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
        console.error('Error making the request:', error);
    }
}

// Function to add a favorite and then fetch the favorites
async function addFavoriteAndGetFavorites(favoriteData, userFavoritesData) {
    await addFavorite(favoriteData); // Wait for the favorite to be added
    await getFavorites(userFavoritesData); // Then fetch the favorites
}

// Call the combined function
addFavoriteAndGetFavorites(favoriteData, userFavoritesData);
