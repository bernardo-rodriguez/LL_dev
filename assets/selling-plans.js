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
    const variables = {
        ids: productIds.map(toProductGid)
    };

    const res = await fetch('/api/2024-07/graphql.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query,
            variables
        })
    });
    const {
        data,
        errors
    } = await res.json();
    if (errors) throw new Error(JSON.stringify(errors));
    return data.nodes.filter(Boolean);
}


// '30 days' -> {count:30, interval:'day'} ; supports weeks/months/years; tolerant to plurals
function parseCountUnit(str) {
    const text = String(str).toLowerCase().trim();
  
    // Match optional number, followed by unit
    const m = text.match(/(?:every\s*)?(\d+)?\s*(day|week|month|year)s?/);
    if (!m) return null;
  
    const count = m[1] ? parseInt(m[1], 10) : 1; // default to 1 if no number
    const unit = m[2];
  
    return {
      count,
      interval: unit
    }; // day|week|month|year
  }

// Try to extract cadence from options first, then fall back to name.
function extractCadenceFromSellingPlan(plan) {
    // 3) Fallback: plan.name like "Every 30 days" / "30-day subscription"
    const byName = parseCountUnit(plan.name);
    if (byName) return byName;

    return null; // unknown
}

// Canonical key for lookups: {count:30, interval:'day'} -> '30d'
function cadenceKey({
    count,
    interval
}) {
    const short = {
        day: 'd',
        week: 'w',
        month: 'm',
        year: 'y'
    } [interval];
    return short ? `${count}${short}` : null;
}


/**
 * products: array returned by fetchPlansByProductIds
 * Returns: { [variantNumericId]: { [cadenceKey]: sellingPlanNumericId } }
 */
function indexPlansByVariant(products) {
    const out = {};
    for (const p of products) {
        let curr_out = {}
        out[fromGid(p.id)] = curr_out
    
        for (const v of p.variants.nodes) {
            const variantId = fromGid(v.id); // numeric string
            const map = (curr_out[variantId] ||= {});
            for (const edge of v.sellingPlanAllocations.edges) {
                const sp = edge.node.sellingPlan;
                const cadence = extractCadenceFromSellingPlan(sp);
                const key = cadence && cadenceKey(cadence);
                console.log(key)
                if (!key) continue;
                map[key] = fromGid(sp.id); // numeric selling_plan id as string
            }
        }
    }
    return out;
}