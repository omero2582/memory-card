import axios from "axios";

const api = axios.create();
api.interceptors.response.use(
  response => response,
  error => {
    // console.log('axios error == ', error)
    return Promise.reject(error.response?.data || {error: 'Error reaching server'});
  }
);

const championsRequest = () => {
  const baseUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1';

  const processSummary = async () => {
    const response = await api.get(`${baseUrl}/champion-summary.json`);
    const data = response.data;
    const simplified = data.map(champ => {
      return {
        id: champ.id,
        type: 'league',
        name: champ.name,
        img: `${baseUrl}/champion-icons/${champ.id}.png`,
        isClicked: false,
      }
    })
    const excludeNone = simplified.filter((champ) => champ.id !== -1);
    //const alphabetical = simplified.sort((a,b) => a.name.localeCompare(b.name));
    return excludeNone;
  }
  return {
    processSummary
  }
}

export default championsRequest();