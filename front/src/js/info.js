function processInfoData(object) {
  objectImageContainer = document.getElementById('objectImageContainer')
  objectInfobox = document.getElementById('objectInfobox')
  objectImageContainer.innerHTML = '<img src="' + object.image_path + '" class="object-image" />'
  objectInfobox.innerHTML = '<h1>' + object.name + '</h1>'
  var propertiesToShow = ['type', 'mean_radius', 'distance_to_star', 'temperature', 'life',
  'common_life_form', 'intelligence']
  for (var i = 0; i < propertiesToShow.length; i++) {
    objectInfobox.innerHTML += '<br><span>' + propertiesToShow[i] + ': ' +
	    object[propertiesToShow[i]] + '</span>';
    if (propertiesToShow[i] === 'life' && object[propertiesToShow[i]] === 'none') {
	  break;
	}
  }
}

function objectExtract() {
  url = '' + window.location
  getIndex = url.search('\\?')
  if (getIndex > -1) {
	url = url.substring(getIndex + 1, url.length)
	systemIndex = url.search('=')
	url = url.substring(systemIndex + 1, url.length)
  } else {
	url = ''
  }
  return url
}

function infoDraw() {
  objectName = objectExtract()
  if (objectName) {
    axios({
      method:'get',
      url:'json/objects.json',
      responseType:'json'
    })
      .then(function (response) {
        console.log('Successful data upload')
        processInfoData(response.data[objectName])
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
