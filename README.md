# Node Yelp API (v3.0)
A promise-based JavaScript client for dealing with Yelp's API (v3).

## Usage
Refer to documentation for parameters that can be passed in: https://www.yelp.com/developers/documentation/v3
```
const Yelp = require('node-yelp-api-v3');
const yelp = new Yelp({
  consumer_key: 'consumer-key',
  consumer_secret: 'consumer-secret'
});

// yelp.getBusinessById(id);
yelp.getBusinessById('yelp-san-francisco').then((result) => console.log(result));

// yelp.searchBusiness(params);
yelp.searchBusiness({ term: 'ice cream' }).then((results) => console.log(results));

// yelp.searchBusinessPhone(phone);
yelp.searchBusinessPhone('+15555555555').then((results) => console.log(results));

// yelp.searchTransaction(type, params);
yelp.searchTransaction('delivery', { location: '42 Wallaby Way' }).then((results) => console.log(results));

// yelp.getReviews(id, params);
yelp.getReviews('yelp-san-francisco', { locale: 'en_US' }).then((results) => console.log(results));

// yelp.autoComplete(params);
yelp.autoComplete({ text: 'ice cream' }).then((results) => console.log(results));
```


## Thanks To
Thanks to Olivier Lalonde (https://github.com/olalonde/node-yelp) for writing the client for Yelp's v2.0 API.

## License
Copyright for portions of project Node Yelp API (v3.0) are held by Joshua Anderson Slate (2017). All other copyrights for project Node Yelp API (v3.0) are held by Olivier Lalonde (2012).

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
