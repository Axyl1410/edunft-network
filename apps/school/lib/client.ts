export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://edunft-api.vercel.app";
