function processData(object, systemName) {
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

window.onload = function() {
  objectName = objectExtract()
  if (objectName) {
    $.ajax({
      contentType: "application/json",
      url: 'objects.json',
      dataType: "json"
    })
      .then(function (data) {
        console.log('Successful JSON upload')
        processData(data[objectName])
      })
      .fail(function(xhr, status, error) {
        console.log('Error: ' + error + '. XHR: ' + xhr + '. Status: ' + status)
      })
  }
}
