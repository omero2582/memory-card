// import image from '../../public/Genshin/Icons'
// https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack

const importAll = (r) => {
  return r.keys().map(r); 
  //this retuns the final fileNames like '/memory-card/static/media/Shikanoin_Heizou_Icon.6c32c7c6a957aedb1a1a.png'
};

const getGenshinCharacters = () => {
  const filenames = importAll(require.context('../../public/Genshin/Icons', false, /\.(png|jpe?g|svg)$/));
  return filenames;
};


export default function genshin() {
  const allCharacters = getGenshinCharacters().map((path, i) => {

  const fileName = path.split('/').pop();
  const fileNameWithoutExtension = fileName.split('.')[0];
  const nameWithSpaces = fileNameWithoutExtension.replace(/_/g, ' ');
  const name = nameWithSpaces.replace(/ Icon/g, '');

    const character = {
      id: i,
      name,
      img: path,
      isClicked: false,
    }
    return character;
  })
  return allCharacters;
}
