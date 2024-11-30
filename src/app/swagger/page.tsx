"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CircularProgress from "@mui/material/CircularProgress";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

type SwaggerSpec = typeof import("../api/swagger").default;

export default function SwaggerPage() {
  const [swaggerSpec, setSwaggerSpec] = useState<SwaggerSpec | null>(null);

  useEffect(() => {
    import("../api/swagger").then((module) => {
      setSwaggerSpec(module.default);
    });
  }, []);

  if (!swaggerSpec) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#ffffff",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#ffffff",
        padding: "20px",
      }}
    >
      <style>
        {`
          /* Set all Swagger UI backgrounds to white */
          .swagger-ui,
          .swagger-ui .topbar,
          .swagger-ui .opblock-section-header,
          .swagger-ui .model-box,
          .swagger-ui .model {
            background-color: #ffffff !important;
          }

          /* Remove border shadows for cleaner design */
          .swagger-ui .opblock {
            box-shadow: none !important;
          }

          /* Ensure text colors remain visible */
          .swagger-ui .opblock-summary {
            color: #fff !important;
          }
        `}
      </style>
      <SwaggerUI spec={swaggerSpec} />
    </div>
  );
}
