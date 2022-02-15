const Memcached = require("memcached");
const phpUnserialize = require('php-unserialize');

var mem = new Memcached("127.0.0.1:11211");
// La session avec le prefix de memcache session
const key = process.argv[2];
console.log("fetching data for key : ", key);
mem.get(key, (err, data) => {
	if (err) {
		console.error(err);
	} else if (data) {
		const sd = phpUnserialize.unserializeSession(data);
		console.log(sd);
	} else {
		console.log("No data");
	}
});
