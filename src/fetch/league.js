const championsRequest = () => {
  const baseUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1';

  const fetchSummary = async () => {
    const response = await fetch(`${baseUrl}/champion-summary.json`);
    const data = await response.json();
    return data;
  }

  const processSummary = async () => {
    const data = await fetchSummary();
    const simplified = data.map(champ => {
      return {
        id: champ.id,
        name: champ.name,
        img: `${baseUrl}/champion-icons/${champ.id}.png`,
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