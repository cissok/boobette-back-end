const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "Yoga API",
    description: "API pour la gestion des cours de yoga en ligne",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
