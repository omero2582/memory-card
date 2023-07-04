import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import axios from 'axios';
import fs from 'fs';


const scrapeCharactersArr = (doc) => {
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
      const rows = [...siblingElement.querySelectorAll('tbody > tr')];
      // Next .map was written in a way to solve problkem with JSDOM. JSDOM counts thead elements as tbody,
      // so I would always match the first thead row, and would run into null exception when looking at a.href,
      // since the querySelector for 'td > a' would return null for the first element (thead which was converted to tbody)
      // wrote this in a way where it should still work in the browser console too.
      const rawCharacters = rows.map(r => {
        const a = r.querySelector('td > a');
        if (!a) {
          return null
        }
        const nameUrl = a.href.split('/').pop();
        const name = nameUrl.split('_').join('');
        const imgCard = `https://genshin-impact.fandom.com/wiki/${nameUrl}`;
        const imgIcon = `${imgCard}/Media`;
        return {imgCard, name, nameUrl}
      });
      const charactersTrimmed = rawCharacters.filter(n => n !== null);
      return charactersTrimmed;
  } else {
    // <table> element not found
  }
}

const fetchCharacters = async () => {
  const response = await fetch('https://genshin-impact.fandom.com/wiki/Character/List');
  const html = await response.text();
  
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(html, 'text/html');
  
  // using JSDOM
  // Create a virtual DOM using jsdom
  const dom = new JSDOM(html);
  // Access the window and document objects
  const window = dom.window;
  const doc = window.document;  

  const charactersArr = scrapeCharactersArr(doc);
  return charactersArr;
}

const getCardImageUrl = async (character) => {
  const response = await fetch(character.imgCard);
  const html = await response.text();
  // using JSDOM
  // Create a virtual DOM using jsdom
  const dom = new JSDOM(html);
  // Access the window and document objects
  const window = dom.window;
  const doc = window.document;  
  const imgElement = doc.querySelector('a.image-thumbnail img');
  
  const imgUrl = imgElement.src;
  return imgUrl;
}

const downloadImage = async (imageUrl, imgName) => {
  // Use axios again to download the image
  axios({
    url: imageUrl,
    responseType: 'stream',
  }).then(response => {
    // Create a writable stream and save the image
    const writer = fs.createWriteStream(`${imgName}_Card.png`);
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('Image downloaded successfully!');
    });

    writer.on('error', err => {
      console.error('Error downloading image:', err);
    });
  }).catch(err => {
    console.error('Error downloading image:', err);
  });
}

const downloadAllImagesCards = async () => {
  const characters = await fetchCharacters();
  // const promises = characters.map(async(c) => {
  //   const url = await getCardImageUrl(c);
  //   await downloadImage(url, c.nameUrl);
  // });
  // const allSettled = await Promise.all(promises);
  // const allImages = allSettled.filter(promise => !promise.error);

  for (let c of characters) {
    const url = await getCardImageUrl(c);
    await downloadImage(url, c.nameUrl);
  }
}

const main = async () => {
  downloadAllImagesCards();
}

main();

