const axios = require('axios');

const theCatApi = async () => {
    const response = await axios.get("https://api.thecatapi.com/v1/images/search");
    const data = await response.data;
    return data.url;
};

const randomCat = async () => {
    const response = await axios.get("https://aws.random.cat/meow");
    const data = await response.data;
    return data.file;
};

const dogCeo = async () => {
    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
    const data = await response.data;
    return data.message;
};

const woof = async () => {
    const response = await axios.get("https://random.dog/woof.json");
    const data = await response.data;
    return data.url;
};

const randomFox = async () => {
    const response = await axios.get("https://randomfox.ca/floof/");
    const data = await response.data;
    return data.image;
};

exports.randomAnimal = async (animal = "") => {
    const listApi = [];
    if (!animal || animal[0] === "@") {
        listApi.push(theCatApi);
        listApi.push(randomCat);
        listApi.push(dogCeo);
        listApi.push(woof);
        listApi.push(randomFox);
    }
    const checkWord = animal.toLowerCase();
    if (checkWord === "cat") {
        listApi.push(theCatApi);
        listApi.push(randomCat);
    }
    if (checkWord === "dog") {
        listApi.push(dogCeo);
        listApi.push(woof);
    }
    if (checkWord === "fox") {
        listApi.push(randomFox);
    }
    if (listApi.length === 0) {
        return null;
    }
    return await listApi[Math.floor(Math.random() * listApi.length)]();
};
