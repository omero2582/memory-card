// https://github.com/hayeah/playing-cards-assets
// import image from '../../public/Genshin/Icons'
// https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack

const importAll = (r) => {
  return r.keys().map(r); 
  //this retuns the final fileNames like '/memory-card/static/media/Shikanoin_Heizou_Icon.6c32c7c6a957aedb1a1a.png'
};

const getPlayingCards = () => {
  const filenames = importAll(require.context('../../../public/PlayingCards', false, /\.(png|jpe?g|svg)$/));
  return filenames;
};


export default function playingCards() {
  const allCharacters = getPlayingCards().map((path, i) => {

  const fileName = path.split('/').pop();
  const fileNameWithoutExtension = fileName.split('.')[0];
  const nameWithSpaces = fileNameWithoutExtension.replace(/_/g, ' ');
  // const name = nameWithSpaces.replace(/ of /g, ' ');
  const name = nameWithSpaces.charAt(0).toUpperCase() + nameWithSpaces.slice(1);

  // console.log(fileName, fileNameWithoutExtension, nameWithSpaces, name)

    const character = {
      id: fileName,
      name,
      img: path,
      isClicked: false,
    }
    return character;
  })
  return allCharacters;
}
