var http = require('http');
var fs = require('fs');
 
// 要抓取的网页地址
//var url = 'http://news.bitcoin.com/us-regulator-moves-to-sanction-plexcoins-lacroix-and-paradis-royer/'
var url = 'http://tokenknows.com/'
 
http.get(url, function(res) {
	var html = ''
	res.on('data', function(data) {
		html += data;
	})
	res.on('end', function() {
        console.log(html);
		// 将抓取的内容保存到本地文件中
		fs.writeFile('D:/opt/index.html', html, function(err) {
			if (err) {
				console.log('出现错误!')
			}
			console.log('已输出至index.html中')
		})
	})
}).on('error', function(err) {
	console.log('错误信息：' + err)
})