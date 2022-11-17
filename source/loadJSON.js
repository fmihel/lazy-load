function loadJSON(file, param = {}) {
    return fetch(file, param).then((response) => response.json());
}

loadJSON.param = {
};

export default loadJSON;
