const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "ToDo API Documentation",
    version: "1.0.0",
    description: "API documentation for the ToDo application.",
    contact: {
      name: "Son Nguyen",
      email: "hoangson091104@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server",
    },
    {
      url: "https://todo-app-nextjs-stack.vercel.app/api",
      description: "Production server",
    },
  ],
  components: {
    schemas: {
      Todo: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "Unique identifier for the todo",
          },
          task: {
            type: "string",
            description: "Description of the task",
          },
          category: {
            type: "string",
            description: "Category of the todo (e.g., Work, Personal, etc.)",
          },
          completed: {
            type: "boolean",
            description: "Completion status of the task",
          },
        },
        required: ["id", "task", "category", "completed"],
      },
      User: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "Username of the user",
          },
          password: {
            type: "string",
            description: "Password of the user",
          },
        },
      },
    },
  },
  paths: {
    "/todos": {
      get: {
        summary: "Fetch all todos for a user",
        tags: ["Todos"],
        parameters: [
          {
            name: "userId",
            in: "query",
            required: true,
            description: "ID of the user whose todos are being fetched",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "A list of todos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Todo",
                  },
                },
              },
            },
          },
          400: {
            description: "Missing or invalid userId",
          },
        },
      },
      post: {
        summary: "Add a new todo",
        tags: ["Todos"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "string",
                    description: "ID of the user",
                  },
                  task: {
                    type: "string",
                    description: "Description of the task",
                  },
                  category: {
                    type: "string",
                    description: "Category of the todo",
                  },
                  completed: {
                    type: "boolean",
                    description: "Completion status of the task",
                  },
                },
                required: ["userId", "task", "category", "completed"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Todo added successfully",
          },
          400: {
            description: "Invalid input",
          },
        },
      },
    },
    "/todos/{todoId}": {
      patch: {
        tags: ["Todos"],
        summary: "Update the completion status of a todo",
        parameters: [
          {
            name: "todoId",
            in: "path",
            required: true,
            description: "ID of the todo to update",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "string",
                    description: "ID of the user",
                  },
                  completed: {
                    type: "boolean",
                    description: "New completion status of the task",
                  },
                },
                required: ["userId", "completed"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Todo updated successfully",
          },
          400: {
            description: "Invalid input",
          },
        },
      },
      delete: {
        summary: "Delete a todo",
        tags: ["Todos"],
        parameters: [
          {
            name: "todoId",
            in: "path",
            required: true,
            description: "ID of the todo to delete",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "string",
                    description: "ID of the user",
                  },
                },
                required: ["userId"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Todo deleted successfully",
          },
          400: {
            description: "Invalid input",
          },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login to the application",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    description: "Username of the user",
                  },
                  password: {
                    type: "string",
                    description: "Password of the user",
                  },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
          },
          400: {
            description: "Invalid input",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        summary: "Reset the password for a user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    description: "Username of the user",
                  },
                  newPassword: {
                    type: "string",
                    description: "New password for the user",
                  },
                },
                required: ["username", "newPassword"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successfully",
          },
          400: {
            description: "Invalid input",
          },
          404: {
            description: "Username not found",
          },
        },
      },
    },
    "/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    description: "Username of the user",
                  },
                  password: {
                    type: "string",
                    description: "Password of the user",
                  },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
          },
          400: {
            description: "Invalid input",
          },
          500: {
            description: "Failed to register user",
          },
        },
      },
    },
  },
};

export default swaggerDefinition;
