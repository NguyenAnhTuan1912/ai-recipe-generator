/**
 * Use this function to construct a standard request to
 * send to Foundation Model, Agent, ...
 * @param ctx
 * @returns
 */
export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  // Construct the prompt with the provided ingredients
  const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(
    ", "
  )}.`;

  return {
    // Specify the model to invoke
    resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
    method: "POST",
    // Specify the content type of request
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      // Body / payload of request
      body: JSON.stringify({
        // Specify the version of Anthropic Models in Bedrock
        anthropic_version: "bedrock-2023-05-31",
        // Specify maximum of response token
        max_tokens: 1000,
        // Content of message
        // Include: a message of user with the following structure
        messages: [
          {
            // Specify the role of message
            role: "user",
            // Specify the content of user
            // Use the standard message for Claude 3 Sonnet
            content: [
              {
                type: "text",
                text: `\n\nHuman: ${prompt}\n\nAssistant:`,
              },
            ],
          },
        ],
      }),
    },
  };
}

/**
 * Use this function to construct a standard response to
 * send back to user
 * @param ctx
 * @returns
 */
export function response(ctx) {
  // Parse the response body
  // View more at: amplify/data/resource.ts
  const parsedBody = JSON.parse(ctx.result.body);
  // Extract the text content from the response
  // The extract script will be different with other depend on
  // which FM is used.
  const res = {
    body: parsedBody.content[0].text,
  };
  // Return the response
  return res;
}
