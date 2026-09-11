import { BACKEND_URL } from "./constants";

export const fetchGraphQL = async (query: string, variables = {}) => {
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    return { data: null, errors: result.errors };
  }

  return result.data;
};
