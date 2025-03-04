import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Define the schema, including: Response of Bedrock and Query Result
const schema = a.schema({
  // Schema of bedrock response
  // Take a look at: `amplify/data/bedrock.js`
  BedrockResponse: a.customType({
    body: a.string(),
    error: a.string(),
  }),

  // Schema of bedrock query (can be considerate as a flow)
  // A lambda function will process this task
  askBedrock: a
    // Build a query
    .query()
    // Create arguments from query result
    .arguments({ ingredients: a.string().array() })
    // Build a return structure from BedrockResponse
    .returns(a.ref("BedrockResponse"))
    // Build a authentication
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        entry: "./bedrock.js",
        // Name of bedrock data source
        // View more at amplify/data/resource.ts
        dataSource: "bedrockDS",
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
