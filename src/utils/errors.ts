export const errorMessages = {
  RESOURCE_NOT_FOUND: (resource: string) => `${resource} not found`,
  PARAMETER_MISSING: (parameter: string) => `${parameter} is required`,
};

export class ResourceNotFoundError extends Error {
  constructor(message: string) {
    super(message); // Pass the message to the base Error class
    this.name = this.constructor.name; // Set the name property to the custom error class name

    // Ensure the prototype chain is correctly set for instances of this class
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
}
