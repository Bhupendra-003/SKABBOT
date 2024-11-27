const mentalHealthKeywords = [
    "name", "age", "gender", "sex", "sexuality", "sexual orientation", "gender identity", "gender expression",
    // Mental Health and Emotional Well-being
    "anxiety", "depression", "stress", "mental health", "emotions", "therapy", "counseling", "CBT", 
    "coping", "panic", "mood", "well-being", "self-care", "self-esteem", "burnout", "relaxation", "meditation",
    "mindfulness", "mental illness", "resilience", "trauma", "grief", "anger", "loneliness", "sadness", 
    "happiness", "positive thinking", "sleep", "sleeping problems", "addiction", "motivation", "focus", 
    "concentration", "overthinking", "social anxiety", "fear", "guilt", "shame", "perfectionism", "self-doubt",
    "stress management", "emotional regulation", "self-compassion", "mental break", "nervousness", "burnout", 
    "workload", "isolation", "hope", "healing", "recovery", "wellness", "support system",

    // Keywords for Students' Life and Issues
    "exams", "exam stress", "study", "homework", "school", "university", "college", "student life", "grades", 
    "academic pressure", "learning", "studying", "procrastination", "test anxiety", "studying tips", "time management",
    "study habits", "distractions", "studying late", "academic performance", "classroom", "study group", "research",
    "classmate", "teacher", "online learning", "study breaks", "study schedule", "curriculum", "project work", 
    "group project", "midterm", "final exam", "papers", "assignments", "deadlines", "papers", "dissertation", "graduation",

    // Casual Conversations (Greetings, Salutations, Introductions)
    "hello", "hi", "hey", "good morning", "good afternoon", "good evening", "how are you", "how are you doing", 
    "how's it going", "what's up", "what's new", "nice to meet you", "it's good to see you", "long time no see", 
    "goodbye", "bye", "take care", "see you later", "talk to you soon", "have a great day", "how can I help", 
    "can I assist you", "how can I support you", "anything on your mind", "anything I can do", "how's your day", 
    "what's on your mind", "tell me about your day", "what do you like", "what are you up to", "what do you enjoy doing", 
    "how's everything going", "is there anything you'd like to talk about", "do you need anything", "I’m here for you", 
    "I'm listening", "feel free to share", "don't hesitate to talk", "I care about you", "you're not alone", 

    // Motivational and Positive Conversations
    "you're doing great", "you've got this", "believe in yourself", "keep going", "stay strong", "stay positive", 
    "it's okay to ask for help", "take it one day at a time", "don't give up", "you're not alone", "keep pushing", 
    "take it easy", "you're enough", "you matter", "I'm proud of you", "things will get better", "take it slow", 
    "you're capable", "one step at a time", "it’s okay to take breaks", "take a deep breath", "you’re doing your best",

    // Keywords for Student Challenges and Advice
    "motivation", "study tips", "focus", "concentration", "time management", "study routine", "academic challenges", 
    "student struggles", "how to study", "study break", "study session", "memory tips", "productivity", 
    "how to stay focused", "dealing with distractions", "how to beat procrastination", "getting better grades", 
    "how to improve focus", "how to concentrate", "stay organized", "study planner", "goal setting", "goal planning", 
    "study goals", "academic success", "work-life balance", "handling peer pressure", "exam anxiety", 
    "test-taking strategies", "preparing for exams", "overcoming exam stress", "handling failure", "coping with failure",

    // Fun & Casual Topics for Student Engagement
    "movies", "music", "books", "hobbies", "games", "sports", "travelling", "food", "fashion", "events", "parties", 
    "hangout", "weekend plans", "vacation", "places to visit", "holiday", "weekend activities", "fun", "comedy", 
    "jokes", "memes", "chill", "relax", "friends", "best friends", "family", "siblings", "pets", "animals", "nature", 
    "outdoor activities", "exercise", "fitness", "healthy habits", "yoga", "art", "painting", "drawing", "photography",

    // Keywords for Self-Improvement and Goal Setting
    "growth", "personal development", "self-improvement", "mindset", "grit", "resilience", "setting goals", "goal setting", 
    "vision", "dreams", "ambition", "discipline", "consistency", "habits", "routine", "focus", "learning", "reflection", 
    "achievement", "success", "overcoming challenges", "breaking bad habits", "starting fresh", "growth mindset", 
    "self-reflection", "self-awareness", "self-love", "taking responsibility", "becoming the best version of yourself", 
    "determination", "self-motivation",
  
];

harmfulKeywords = [
    "suicide", "suicidal", "suicide attempt", "self-harm", "self-harming", "self-harming thoughts", "death", "death wish",
]

module.exports = { mentalHealthKeywords, harmfulKeywords };

