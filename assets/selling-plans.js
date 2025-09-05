const STOREFRONT_TOKEN = '104d0ae265036b69b4544beaece910d4';

// Helpers to flip Shopify numeric IDs <-> GIDs
const toProductGid = (idStr) => `gid://shopify/Product/${idStr}`;
const fromGid = (gid) => gid.split('/').pop();

/**
 * Fetch selling plan allocations for a set of product numeric IDs (strings).
 * Returns an array of products with variants and their plans.
 */
async function fetchPlansByProductIds(productIds = []) {
  const query = `
    query($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          variants(first: 250) {
            nodes {
              id
              sellingPlanAllocations(first: 50) {
                edges {
                  node {
                    sellingPlan {
                      id
                      name
                      options { name value }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;
  const variables = { ids: productIds.map(toProductGid) };

  const res = await fetch('/api/2024-07/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      'Accept': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });
  const { data, errors } = await res.json();
  if (errors) throw new Error(JSON.stringify(errors));
  return data.nodes.filter(Boolean);
}
