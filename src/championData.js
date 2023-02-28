const championData = () => {
  const baseUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1';
  const championImg = 'champion-icons/1.png'
  // replace 1 with png 
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
      }
    })
    //const alphabetical = simplified.sort((a,b) => a.name.localeCompare(b.name));
    return simplified;
  }
  return {
    processSummary
  }
}

export default championData();