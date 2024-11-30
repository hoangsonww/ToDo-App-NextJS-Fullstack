declare module "swagger-ui-react" {
  import { FunctionComponent } from "react";

  interface SwaggerUIProps {
    spec?: object; // Swagger JSON object
    url?: string; // URL to fetch Swagger JSON
    docExpansion?: "list" | "full" | "none"; // Default expansion for APIs
    defaultModelsExpandDepth?: number; // Default depth for models
  }

  const SwaggerUI: FunctionComponent<SwaggerUIProps>;

  export default SwaggerUI;
}
