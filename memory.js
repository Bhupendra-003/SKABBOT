const { ChatGroq } = require("@langchain/groq");
require('dotenv').config();
const {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} = require("@langchain/langgraph");

// Initialize the ChatGroq LLM with API key from environment variables
const llm = new ChatGroq({
    model: "llama3-70b-8192", // Replace with your model ID
    temperature: 0.7,
    apiKey: process.env.CHATGROQ_API_KEY, // API Key from .env file
});

// Define the function that calls the model and processes the state (messages)
const callModel = async (state) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
};

// Define the StateGraph workflow
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel) // Node to invoke the model
    .addEdge(START, "model") // Connect the start to the model
    .addEdge("model", END); // Connect the model to the end

// Initialize memory for the conversation context
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory }); // Compile the workflow with memory

// Configuration for thread ID (to track conversation)
const config = { configurable: { thread_id: "abc123" } };

// Export the main conversation flow function
async function runConversation(input) {
    try {
        const output = await app.invoke({ messages: input }, config); // Run the app with the input
        return output.messages[output.messages.length - 1].content; // Return the last message
    } catch (error) {
        console.error("Error during conversation:", error);
    }
}

module.exports = { runConversation }; // Export the function for use in other files
