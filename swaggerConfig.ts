import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kaizen tasks API documentation",
      version: "1.0.0",
      description: "API description",
    },
  },
  apis: ["./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
