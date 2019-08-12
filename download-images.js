const Promise = require('bluebird');
const fs = require('fs');
const download = require('image-downloader');

fs.readFile('epl1920.json', 'utf-8', handleFile);

function handleFile(err, data) {
  if (err) throw err;

  players = JSON.parse(data);
  let imageUrls = [];

  for (let player of players) {
    imageUrls.push({
      optaId: player.optaId,
      picture: player.picture
    });
  }

  downloadImages(imageUrls);
}

function downloadImages(imageUrls) {
  let promises = [];
  let urls = [];
  let idsToRemove = [];

  Promise.each(imageUrls, image => new Promise((resolve, reject) => {
    console.log('Downloading Image: ' + image.picture);
    let options = {
      url: image.picture,
      dest: 'images/'
    }

    if (!fs.existsSync('images/' + image.optaId + '.png')) {
      download.image(options)
        .then(function (response) {
          resolve();
        })
        .catch(function (err) {
          if (err.toString().indexOf('Image loading error - 403') > -1) {
            idsToRemove.push(image.optaId);
            resolve();
          }
        })
    } else {
      resolve()
    }

  })).then(function () {
    console.log('All Image Downloaded!');
    let filteredPlayers = players.filter(function (player) {
      return !idsToRemove.includes(player.optaId);
    });

    let json = JSON.stringify(filteredPlayers);

    fs.writeFile('epl1920.json', json, 'utf-8', function (e) {
      console.log(e);
    });
  }).catch(function (err) {
    console.error('Failed: ' + err.message);
  });

  // for (let i = 0; i < imageUrls.length; i++) {
  //   if (typeof imageUrls[i].picture !== 'undefined') {
  //     let options = {
  //       url: imageUrls[i].picture,
  //       dest: 'images/'
  //     }

  //     let req = download.image(options)
  //       .then(({ filename, image }) => {
  //         promises.push(req);
  //       })
  //       .catch((err) => {
  //         if (err.toString().indexOf('Image loading error - 403') > -1) {
  //           idsToRemove.push(imageUrls[i].optaId);
  //           console.log(idsToRemove);
  //         }
  //       })
  //   }
  // }

  // Promise.all(promises)
  //   .then(function (data) {
  //     console.log('done!');
  //   })
  //   .then(function() {
  //     console.log(idsToRemove);
  //     let filteredPlayers = players.filter(function (player) {
  //       return !idsToRemove.includes(player.optaId);
  //     });
  //     console.log(filteredPlayers.length);
  //   })
  //   .catch ((err) => {
  //     console.error(err)
  //   });
}