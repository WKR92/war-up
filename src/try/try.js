import axios from "axios";

const swapiGetter = (id) =>
  axios
    .get(`https://swapi.dev/api/v1/people/${id}`)
    .then((res) => res.data.name)
    .catch((err) => console.error(err));

export default swapiGetter;
