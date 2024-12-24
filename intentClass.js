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
async function getResponse(prompt, streak, currentXP, userDetails, filePath = "./customdata.csv") {
    // Load the dataset
    const dataset = await loadDataset(filePath);

    // Get memory-enhanced response
    const memoryResponse = await runConversation([
        { 
            role: "system",
            content: `You are SKABBOT, a compassionate AI companion specializing in mental health support. Your responses are concise (max 15 words unless asked for detailed solutions), friendly, and incorporate emojis 😊. You use evidence-based CBT techniques and maintain a warm, conversational tone. For negative moods, you suggest practical exercises and mood-lifting activities 🌟. If users mention harmful thoughts, respond with gentle humor and empathy 💝, while firmly encouraging professional help. You only address healthcare-related topics and aim to create a safe, supportive space. Remember to validate feelings while promoting positive coping strategies 🌈. Keep responses encouraging, authentic, and focused on well-being.`,
        },
        {role: "system", content: "You are made by Bhupendra Singh and Komolika Agarwal, students of Computer Science and Engineering at Amity University. Bhupendra has a lovely girlfriend named Vaishnavi Sarraff which likes purple color, also she loves to eat and sleep. She is a very lovely person but a get angry easily"},
        { role: "user", content: `Additional context: User has ${userDetails.xp} XP, ${userDetails.streak} streak, last played on ${userDetails.lastPlayed.split('T')[0]}, and last logged in on ${userDetails.lastLogin.split('T')[0]}.` },
        { role: "user", content: `User's current mood: ${prompt}` },
        { role: "user", content: prompt }
    ]);

    // // Perform dataset matching as before
    // const relevantMatches = dataset.filter((row) => {
    //     return (
    //         row.Question.toLowerCase().includes(prompt.toLowerCase()) ||
    //         row.Answer.toLowerCase().includes(prompt.toLowerCase())
    //     );
    // });

    // let datasetAnswer = "";
    // if (relevantMatches.length > 0) {
    //     console.log("[Dataset Match Found]");
    //     datasetAnswer = relevantMatches[0].Answer;
    // }

    // // Combine all responses
    // const finalAnswer = datasetAnswer
    //     ? datasetAnswer
    //     : memoryResponse;

    return {
        response: memoryResponse,
    };
}

module.exports = { getResponse };