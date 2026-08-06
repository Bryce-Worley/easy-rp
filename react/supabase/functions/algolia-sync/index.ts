import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import algoliasearch from "npm:algoliasearch@4.22.1"

// 1. Initialize the Algolia client using environment variables
// Note: Edge functions use Deno.env.get() instead of process.env or import.meta.env
const appId = Deno.env.get("ALGOLIA_APP_ID") ?? "";
const adminKey = Deno.env.get("ALGOLIA_ADMIN_KEY") ?? "";
const indexName = Deno.env.get("ALGOLIA_INDEX_NAME") ?? "dev-ezrp";

const client = algoliasearch(appId, adminKey);
const index = client.initIndex(indexName);

serve(async (req) => {
  try {
    // 2. Parse the webhook payload sent by Supabase
    const payload = await req.json();
    const { type, record, old_record } = payload;

    // 3. Handle INSERT and UPDATE events
    if (type === 'INSERT' || type === 'UPDATE') {
      // Algolia requires a unique 'objectID' for every record. 
      // We map your Supabase 'id' to Algolia's 'objectID'.
      const algoliaRecord = {
        ...record,
        objectID: record.id, 
      };
      
      await index.saveObject(algoliaRecord);
      console.log(`Successfully synced ${type} for record ${record.id} to Algolia`);
    }

    // 4. Handle DELETE events
    if (type === 'DELETE') {
      // For deletes, Supabase sends the deleted data in 'old_record'
      await index.deleteObject(old_record.id);
      console.log(`Successfully deleted record ${old_record.id} from Algolia`);
    }

    // 5. Return a success response
    return new Response(
      JSON.stringify({ message: "Sync successful" }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Error syncing to Algolia:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    );
  }
});