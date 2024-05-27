# Server.py

## APIs

### session
- `/api/session`
  - Get from the server the corresponding user id.
    ```http 
    GET /api/session HTTP/1.1
    ```
  - Delete and existing session.
    ```http
    DELETE /api/session HTTP/1.1
    Content-type: application/json

    {
        sessionId: 10000
    }
    ```
### blocks
- `/api/blocks`
  - Post blocks on the server and train the network
    ```http
    POST /api/blocks HTTP/1.1
    Content-type: application/json

    {
        "network":{
            "blocks":[{"id":"0","type":"customNode","position":{"x":10,"y":0},"data":{"label":"Leaky ReLU","openInfo":false,"isSelected":false},"parameters":[{"name":"input_tensor","description":"Input tensor","value":"null"},{"name":"negative_slope","description":"Negative slope","value":"null"}],"hidden":false,"fn":"torch.nn.functional.leaky_relu","width":80,"height":24},{"id":"0s","type":"superBlockNode","position":{"x":10,"y":200},"data":{"label":"sb1","isSelected":false,"openInfo":false,"isOpenInSheet":false},"children":["0","1"],"width":32,"height":24}],
            "edges":[{"id":"e1-2","source":"0","target":"1"}],
            "params":[{"key":"learningRate","value":"1"},{"key":"epochs","value":"1"},{"key":"batchSize","value":"1"},{"key":"loss","value":"SME"},{"key":"optimizer","value":"SGD"}]
        },
        "sessionId":10000
    }
    ```

- `/api/blocks/input`
  - Post blocks on the server and train the network
    ```http
    POST /api/blocks/input HTTP/1.1
    Content-type: multipart/form-data

    {
       --------------------
       Content-Disposition: form-data; name="sessionId"
       10000
       --------------------
       Content-Disposition: form-data; name="files"; filename="csv_file.csv" Content-Type: text/csv
    }
    ```