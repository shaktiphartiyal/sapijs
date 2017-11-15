(function () {
    class APIResponse
    {
        constructor()
        {
        }
        _getResponseObject(response)
        {
            this.status = response.status;
            this.statusText = response.statusText;
            this.data = response.responseText;
            this.readyState = response.readyState;
            this.headers = response.getAllResponseHeaders();
            this.__proto__._response = response;
            Object.seal(this);
            Object.freeze(this);
            return this;
        }
        getHeader(header){
            let responseHeader;
            try
            {
                responseHeader = this.__proto__._response.getResponseHeader(header).trim();
            }
            catch(e)
            {
                responseHeader = undefined;
            }
            return responseHeader;
        }
    }
    class APIRequest
    {
        constructor(type, url)
        {
            this.type = type;
            this.url = url;
            this._data = null;
            this._headers = {};
            this.request = new XMLHttpRequest();
            this.request.open(this.type, this.url);
        }
        addHeaders(headerObject)
        {
            this._headers = headerObject?headerObject:{};
            let keys = Object.keys(this._headers);
            for(let key of keys)
            {
                this.request.setRequestHeader(key, this._headers[key]);
            }
            return this;
        }
        data(data)
        {
            this._data = data;
            return this;
        }
        send()
        {
            let self = this;
            return new Promise(function(resolve, reject) {
                self.request.onload = () => {
                    resolve(new APIResponse()._getResponseObject(self.request));
                };
                self.request.onerror = () => {
                    reject(new APIResponse()._getResponseObject(self.request));
                };
                self.request.send(self._serializeData());
            });
        }
        _serializeData()
        {
            let str = [];
            for(let p in this._data)
            {
                if (this._data.hasOwnProperty(p))
                {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(this._data[p]));
                }
            }
            return str.join("&");
        }

    }
    class Api
    {
        constructor()
        {

        }
        get(url, data, headers)
        {
            return new APIRequest('GET',url).data(data).addHeaders(headers).send();
        }
        post(url, data, headers)
        {
            return new APIRequest('POST',url).data(data).addHeaders(headers).send();
        }
        put(url, data, headers)
        {
            return new APIRequest('PUT',url).data(data).addHeaders(headers).send();
        }
        patch(url, data, headers)
        {
            return new APIRequest('PATCH',url).data(data).addHeaders(headers).send();
        }
        delete(url, data, headers)
        {
            return new APIRequest('DELETE',url).data(data).addHeaders(headers).send();
        }
        hit(type, url, data, headers)
        {
            return new APIRequest(type,url).data(data).addHeaders(headers).send();
        }
    }
    window.sapi = new Api();
})();