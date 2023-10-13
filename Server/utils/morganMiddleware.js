const morgan = require("morgan");
const logger = require("./logger");
const config = require("../config");
const rfs = require("rotating-file-stream");
const path = require("path");

const accessLogStream = rfs.createStream(
  "server.log", {
    interval: "1d",
    path: path.join(`${__dirname}`, "../logs")
  }
);


const stream = {
  write: (message) => logger.http(message),
};

morgan.token('id', function getId (req) {
  return req.id
})

morgan.token('req_header', function(req, res){
  return JSON.stringify(req.headers)
})

morgan.token('res_header', function(req, res){
  return JSON.stringify(res.getHeaders())
})

const skip = () => {
  const env = config.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan(
  jsonFormat,
  { stream : accessLogStream, skip }
);


function jsonFormat(tokens, req, res) {
  return JSON.stringify({
    'request_id' : tokens['id'](req, res),
    'method' : tokens['method'](req, res),
    'url' : tokens['url'](req, res),
    'req_header' : tokens['req_header'](req, res),
    'status': tokens['status'](req, res),
    'res_header': tokens['res_header'](req, res),
    'response_time': tokens['response-time'](req, res) + 'ms',
  })
}


module.exports = morganMiddleware