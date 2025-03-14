const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "API",
    description: "",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
