const node = new Ipfs()
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function parseDate(itemDate) {
	itemDate = itemDate.split('T')[0].split('-');
	itemDate = months[parseInt(itemDate[1], 10) - 1] + ' ' + parseInt(itemDate[2]) + ', ' + itemDate[0];
	return itemDate;
};
function parseURL(linkURL) {
	linkURL = linkURL.replace(/(\r\n|\n|\r)/gm,"");
	linkURL = linkURL.split('<link>');
	linkURL = linkURL[1].split('<description>');
	return linkURL[0];
};
function xmlToJson(xml) {
  var category = $(xml).find('channel > title').text()
  console.log(category);
	var obj = [];
	$(xml).find('item').each(function(i) {
		obj.push({
			"title": $(this).find('title').text(),
			"link": parseURL($(this).html()),
			"description": $(this).find('description').text(),
			"pubDate": parseDate($(this).find('pubDate').text()),
			"media": $(this).find('media\\:content, content').attr('url'),
			"id": i+1
		});
	});
	return {"category": category, "items":obj};
};

node.on('ready', () => {
  console.log('ready');

  node.files.cat('QmNgUU7VzWmW26WnVHR7pnqnnucADhH994YCozDK4Mppxg', function (err, file) {
    if (err) {
      throw err
    }

    console.log(file.toString('utf8'))
    var j = xmlToJson(file.toString('utf8'))
    console.log(j);

    $("#directory").append("<h3>" + j.category + "</h3>")
    var arrayLength = j.items.length;
    for (var i = 0; i < arrayLength; i++) {
        console.log(j.items[i]);
        $("#directory").append(j.items[i].title + "<br>")

    }

  })
})
