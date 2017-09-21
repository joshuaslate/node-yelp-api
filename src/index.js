import querystring from 'querystring';
import { OAuth2 } from 'oauth';

const baseUrl = 'https://api.yelp.com/v3/';

class Yelp {
  constructor(opts) {
    this.access_token = '';
    this.timeout = opts.timeout || 2000;
    this.fetchingAccessToken = false;
    this.oauth2 = new OAuth2(
      opts.consumer_key,
      opts.consumer_secret,
      'https://api.yelp.com/',
      null,
      'oauth2/token',
      null
    );
    // Send bearer token in 'Authorization' header
    this.oauth2.useAuthorizationHeaderforGET(true);
    // Get the access token on initialization
    this.getAccessToken();
  }

  getAccessToken() {
    this.fetchingAccessToken = true;
    // Get and set the access token
    return new Promise((resolve, reject) => {
      this.oauth2.getOAuthAccessToken(
        '',
        { 'grant_type': 'client_credentials' },
        (e, access_token, refresh_token, results) => {
          if (e) {
            this.fetchingAccessToken = false;
            return reject(e);
          }
          if (access_token) {
            this.access_token = access_token;
            this.fetchingAccessToken = false;
            return resolve();
          }
      });
    });
  }

  get(resource, params = {}) {
    if (!this.access_token && this.fetchingAccessToken === false) {
      return this.getAccessToken().then(() => this.makeReq(resource, params));
    } else if (!this.access_token && this.fetchingAccessToken === true) {
      return new Promise((resolve, reject) => {
        let time = 0;
        const maxTime = this.timeout; // wait a max of two seconds or specified timeout
        const interval = setInterval(() => {
          if (this.access_token) {
            clearInterval(interval);
            return resolve();
          }
          if (time > maxTime) {
            clearInterval(interval);
            return reject(new Error('Yelp fetch token request timed out.'));
          }
          time += 100;
        }, 200);
      }).then(() => {
        return this.makeReq(resource, params);
      }).catch(err => console.log(err));
    } else {
      return this.makeReq(resource, params);
    }
  }

  makeReq(resource, params = {}, tries) {
    if (!tries) {
      tries = 0;
    }

    const promise = new Promise((resolve, reject) => {
      const debug = params.debug;
      delete params.debug;

      // If there is no access token, throw an error stating that
      if (!this.access_token) { return reject(new Error('Missing access_token')); }

      this.oauth2.get(
        `${baseUrl}${resource}?${querystring.stringify(params)}`,
        this.access_token,
        (err, _data, response) => {
          if (err) {
            // Try three times on a 401 to refresh the access token
            // It seems they last for about three months before expiring
            if (tries < 3 && err.statusCode === 401) {
              tries += 1;
              return this.getAccessToken().then(() => this.makeReq(resource, params, tries));
            }

            return reject(err);
          }
          const data = JSON.parse(_data);
          if (debug) { return resolve([ data, response ]); }
          resolve(data);
        }
      );
    });
    return promise;
  }

  // https://www.yelp.com/developers/documentation/v3/business_search
  searchBusiness(params) {
    return this.get('businesses/search', params);
  }

  // https://www.yelp.com/developers/documentation/v3/business_search_phone
  searchBusinessPhone(phone) {
    return this.get('businesses/search/phone', { phone });
  }

  // https://www.yelp.com/developers/documentation/v3/transactions_search
  searchTransaction(type, params) {
    return this.get(`transactions/${type || 'delivery'}/search`, params);
  }

  // https://www.yelp.com/developers/documentation/v3/business
  getBusinessById(id) {
    return this.get(`businesses/${id}`, undefined);
  }

  // https://www.yelp.com/developers/documentation/v3/business_reviews
  getReviews(id, params) {
    return this.get(`businesses/${id}/reviews`, params);
  }

  // https://www.yelp.com/developers/documentation/v3/autocomplete
  autoComplete(params) {
    return this.get('autocomplete', params);
  }
}

export default Yelp;
