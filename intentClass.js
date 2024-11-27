const { ChatGroq } = require("@langchain/groq");
const fs = require("fs");
const csv = require("csv-parser");
const dotenv = require("dotenv");
const { runConversation } = require("./memory"); // Import memory functionality

dotenv.config();

// Initialize ChatGroq LLM
const llm = new ChatGroq({
    model: "llama3-70b-8192",
    temperature: 0.7,
});

// Function to load CSV dataset (automatically handles dataset loading)
function loadDataset(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => data.push(row))
            .on("end", () => resolve(data))
            .on("error", (error) => reject(error));
    });
}


// Modified getResponse function to include conversation memory
async function getResponse(prompt, currentXP, filePath = "./customdata.csv") {
    // Load the dataset
    const dataset = await loadDataset(filePath);

    // Get memory-enhanced response
    const memoryResponse = await runConversation([
        {
            role: "system",
            content: `You are a helpful assistant and companion named SKABBOT, which is designed to help with mental health topics. You can provide information, support, and guidance using cognitive behavioural technique (CBT) and  dont exceed words more than 30 until asked for a sollution, and don't respond to questions out of healthcare. If the user has negative mood suggest some exercises and activities to help them feel better . If the question is related to harmful content, you should told them to seek immidiate guidance (indian) from a professional. The user currently has ${currentXP} XP. Use emojis and make it more friendly and conversational, and you have a good sense of humor.`,
        },
        { role: "user", content: prompt }
    ]);

    // Perform dataset matching as before
    const relevantMatches = dataset.filter((row) => {
        return (
            row.Question.toLowerCase().includes(prompt.toLowerCase()) ||
            row.Answer.toLowerCase().includes(prompt.toLowerCase())
        );
    });

    let datasetAnswer = "";
    if (relevantMatches.length > 0) {
        console.log("[Dataset Match Found]");
        datasetAnswer = relevantMatches[0].Answer;
    }

    // Combine all responses
    const finalAnswer = datasetAnswer
        ? `${datasetAnswer} Additionally, ${memoryResponse}`
        : memoryResponse;

    return {
        response: finalAnswer,
    };
}

module.exports = { getResponse };