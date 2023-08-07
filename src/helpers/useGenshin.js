import { useEffect, useState } from "react";
import GenshinChars from '../useCards/fetch/cachedGenshin.json';

// TODO TODO... cant run this from the frontend bc cors errors... have to either stup backend or proxy
// or just download data or GG

const imgBaseUrl = 'https://static.wikia.nocookie.net/gensin-impact/images/2/2e/'
const imgUrl2 = '_Card.png/revision/latest/';

const getCharacterArrObj = (characterNamesArr) => {
  return characterNamesArr.map((c, i) => {
    return {
      name: c.split('_').join(' '),
      img: `${imgBaseUrl}${c}${imgUrl2}`,
      id: i,
    }
  })
}

export default function useGenshin() {
  const [characters, setCharacters] = useState([]); 

  useEffect(() => {
    setCharacters(getCharacterArrObj(GenshinChars));
  }, []);

  /*
  useEffect(() => {
    const fetchCharacters = async () => {
      const response = await fetch('https://genshin-impact.fandom.com/wiki/Character/List');
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      

      const characterNamesArr = scrapeNamesArr(doc);
      const charactersArr = getCharacterArrObj(characterNamesArr); 

      setCharacters(charactersArr);
    }
    fetchCharacters();
  }, [])

  const scrapeNamesArr = (doc) => {
    const headingElement = doc.querySelector('span#Playable_Characters').parentNode;

    // Find the sibling <table> element
    let siblingElement = headingElement.nextElementSibling;
    while (siblingElement !== null) {
      if (siblingElement.tagName.toLowerCase() === 'table') {
        // <table> element found
        break;
      }
      siblingElement = siblingElement.nextElementSibling;
    }

    // Check if a <table> element was found
    if (siblingElement !== null) {
      // Do something with the <table> element
        const rows = [...siblingElement.querySelectorAll('tbody tr')];
        return rows.map(r => r.querySelector('td > a').href.split('/').pop());
    } else {
      // <table> element not found
    }
    
  }*/
  return characters;
}