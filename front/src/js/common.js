function commonNameExtract() {
  var url = '' + window.location
  var getIndex = url.search('\\?')
  if (getIndex > -1) {
	  url = url.substring(getIndex + 1, url.length)
	  var systemIndex = url.search('=')
	  url = url.substring(systemIndex + 1, url.length)
  } else {
	  url = ''
  }
  return url
}

function commonObjToSortArr(data, systemName, sortType) {
  systemArr = []
  for (object in data) {
	  if (data[object].system.toLowerCase() == systemName.toLowerCase()) {
	    systemArr.push(data[object])
	  }
  }
  if (sortType === 'desc') {
    systemArr = systemArr.sort(commonCompareDesc)
  } else if (sortType === 'asc') {
    systemArr = systemArr.sort(commonCompareAsc)
  }
  return systemArr;
}

function commonCompareDesc(a, b) {
  if (a.distance_to_star > b.distance_to_star)
    return -1;
  if (a.distance_to_star < b.distance_to_star)
    return 1;
  return 0;
}

function commonCompareAsc(a, b) {
  if (a.distance_to_star < b.distance_to_star)
    return -1;
  if (a.distance_to_star > b.distance_to_star)
    return 1;
  return 0;
}

function commonWrapper(callback) {
  var value;
  this.set = function(v) {
      value = v;
      callback(this);
  }
  this.get = function() {
      return value;
  }  
}
