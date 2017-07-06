function infoProcessData(object) {
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

function infoDraw(systemName) {
  objectName = commonNameExtract()

  if (objectName) {
    axios({
      method:'get',
      url:'json/objects.json',
      responseType:'json'
    })
      .then(function (response) {
        console.log('Successful data upload')
        infoProcessData(response.data[objectName])
        systemName.set(response.data[objectName].system)
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    console.log('Erorr: No object name specified')
    window.location.href = 'index.html'
  }
}
