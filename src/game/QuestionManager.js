export class QuestionManager {
    constructor() {
        this.currentQuestionIndex = 0;
        this.askedQuestions = new Set();
        this.currentAsker = 1; // Player ID who asks the next question

        this.questions = this.load36Questions();
    }

    load36Questions() {
        return [
            {
                id: 1,
                category: "Getting to Know You",
                text: "Given the choice of anyone in the world, whom would you want as a dinner guest?",
                instructions: "Take turns sharing your answers. Don't rush - really think about your choice and explain why."
            },
            {
                id: 2,
                category: "Getting to Know You",
                text: "Would you like to be famous? In what way?",
                instructions: "Be honest about your relationship with fame and recognition."
            },
            {
                id: 3,
                category: "Getting to Know You",
                text: "Before making a telephone call, do you ever rehearse what you are going to say? Why?",
                instructions: "Share your communication habits and any anxieties you might have."
            },
            {
                id: 4,
                category: "Getting to Know You",
                text: "What would constitute a \"perfect\" day for you?",
                instructions: "Describe your ideal day from start to finish. What makes it perfect?"
            },
            {
                id: 5,
                category: "Getting to Know You",
                text: "When did you last sing to yourself? To someone else?",
                instructions: "Share memories of singing and how music makes you feel."
            },
            {
                id: 6,
                category: "Imagination",
                text: "If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?",
                instructions: "Think about what you value more: mental or physical capabilities."
            },
            {
                id: 7,
                category: "Self-Reflection",
                text: "Do you have a secret hunch about how you will die?",
                instructions: "This might seem dark, but it reveals how you think about life and mortality."
            },
            {
                id: 8,
                category: "Getting to Know You",
                text: "Name three things you and your partner appear to have in common.",
                instructions: "Look for commonalities you've discovered during your time together."
            },
            {
                id: 9,
                category: "Self-Reflection",
                text: "For what in your life do you feel most grateful?",
                instructions: "Share what brings you the deepest sense of gratitude."
            },
            {
                id: 10,
                category: "Childhood",
                text: "If you could change anything about the way you were raised, what would it be?",
                instructions: "Reflect on your upbringing and what you might do differently."
            },
            {
                id: 11,
                category: "Self-Reflection",
                text: "Take four minutes and tell your partner your life story in as much detail as possible.",
                instructions: "Take turns. Set a timer for 4 minutes each. This is about the big picture of your life."
            },
            {
                id: 12,
                category: "Self-Improvement",
                text: "If you could wake up tomorrow having gained any one quality or ability, what would it be?",
                instructions: "Think about what you wish you could improve about yourself."
            },
            {
                id: 13,
                category: "Imagination",
                text: "If a crystal ball could tell you the truth about yourself, your life, the future or anything else, what would you want to know?",
                instructions: "What mysteries about life or yourself are you most curious about?"
            },
            {
                id: 14,
                category: "Dreams",
                text: "Is there something that you've dreamed of doing for a long time? Why haven't you done it?",
                instructions: "Share your long-held dreams and what's been holding you back."
            },
            {
                id: 15,
                category: "Self-Reflection",
                text: "What is the greatest accomplishment of your life?",
                instructions: "Share what you're most proud of achieving."
            },
            {
                id: 16,
                category: "Relationships",
                text: "What do you value most in a friendship?",
                instructions: "Think about what qualities matter most to you in close relationships."
            },
            {
                id: 17,
                category: "Memory",
                text: "What is your most treasured memory?",
                instructions: "Share a memory that brings you joy whenever you think of it."
            },
            {
                id: 18,
                category: "Memory",
                text: "What is your most terrible memory?",
                instructions: "Only share what you're comfortable with. This is about being vulnerable."
            },
            {
                id: 19,
                category: "Future",
                text: "If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?",
                instructions: "Consider what really matters to you and how you spend your time."
            },
            {
                id: 20,
                category: "Relationships",
                text: "What does friendship mean to you?",
                instructions: "Define what friendship means in your own words."
            },
            {
                id: 21,
                category: "Family",
                text: "What roles do love and affection play in your life?",
                instructions: "Reflect on how you experience and express love."
            },
            {
                id: 22,
                category: "Getting to Know You",
                text: "Alternate sharing something you consider a positive characteristic of your partner. Share a total of five items.",
                instructions: "Take turns saying positive things about each other. 5 items total, so one person will go 3 times."
            },
            {
                id: 23,
                category: "Family",
                text: "How close and warm is your family? Do you feel your childhood was happier than most other people's?",
                instructions: "Compare your family experience to what you imagine others had."
            },
            {
                id: 24,
                category: "Family",
                text: "How do you feel about your relationship with your mother?",
                instructions: "Share honestly about this important relationship."
            },
            {
                id: 25,
                category: "Playful",
                text: "Make three true \"we\" statements each. For instance, \"We are both in this room feeling...\"",
                instructions: "Create statements that apply to both of you right now."
            },
            {
                id: 26,
                category: "Getting to Know You",
                text: "Complete this sentence: \"I wish I had someone with whom I could share...\"",
                instructions: "Think about what you long to share with someone special."
            },
            {
                id: 27,
                category: "Vulnerability",
                text: "If you were going to become a close friend with your partner, please share what would be important for him or her to know.",
                instructions: "Share something important about yourself that close friends should know."
            },
            {
                id: 28,
                category: "Getting to Know You",
                text: "Tell your partner what you like about them; be very honest this time, saying things that you might not say to someone you've just met.",
                instructions: "Be more honest and specific than you might normally be."
            },
            {
                id: 29,
                category: "Vulnerability",
                text: "Share with your partner an embarrassing moment in your life.",
                instructions: "Choose something you can laugh about now, even if it was embarrassing then."
            },
            {
                id: 30,
                category: "Vulnerability",
                text: "When did you last cry in front of another person? By yourself?",
                instructions: "Share about times when you've been emotionally vulnerable."
            },
            {
                id: 31,
                category: "Getting to Know You",
                text: "Tell your partner something that you like about them already.",
                instructions: "Share what you've noticed and appreciated about them so far."
            },
            {
                id: 32,
                category: "Serious",
                text: "What, if anything, is too serious to be joked about?",
                instructions: "Discuss what topics or experiences you feel are off-limits for humor."
            },
            {
                id: 33,
                category: "Future",
                text: "If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven't you told them yet?",
                instructions: "Think about important things left unsaid in your life."
            },
            {
                id: 34,
                category: "Serious",
                text: "Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item. What would it be? Why?",
                instructions: "Consider what material possession means the most to you."
            },
            {
                id: 35,
                category: "Family",
                text: "Of all the people in your family, whose death would you find most disturbing? Why?",
                instructions: "This reveals your closest family bonds and fears."
            },
            {
                id: 36,
                category: "Vulnerability",
                text: "Share a personal problem and ask your partner's advice on how he or she might handle it. Also, ask your partner to reflect back to you how you seem to be feeling about the problem you have chosen.",
                instructions: "This requires both vulnerability and empathy from both partners."
            }
        ];
    }

    getRandomQuestion() {
        // Return questions in order for the structured experience
        if (this.currentQuestionIndex >= this.questions.length) {
            this.currentQuestionIndex = 0; // Loop back to start
        }

        const question = this.questions[this.currentQuestionIndex];
        this.askedQuestions.add(question.id);
        this.currentQuestionIndex++;

        // Add who should ask the question
        question.asker = this.currentAsker;
        question.askingInstructions = this.getAskingInstructions(question.asker);

        // Alternate who asks questions
        this.currentAsker = this.currentAsker === 1 ? 2 : 1;

        return question;
    }

    getAskingInstructions(askerId) {
        const playerColor = askerId === 1 ? "Red Player" : "Blue Player";
        return `${playerColor}: Please read this question aloud to your partner and share your answer first.`;
    }

    getQuestionByCategory(category) {
        const categoryQuestions = this.questions.filter(q =>
            q.category.toLowerCase() === category.toLowerCase() &&
            !this.askedQuestions.has(q.id)
        );

        if (categoryQuestions.length === 0) {
            return this.getRandomQuestion();
        }

        const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
        const question = categoryQuestions[randomIndex];

        this.askedQuestions.add(question.id);
        question.asker = this.currentAsker;
        question.askingInstructions = this.getAskingInstructions(question.asker);

        this.currentAsker = this.currentAsker === 1 ? 2 : 1;

        return question;
    }

    getProgressiveQuestion() {
        // Return questions in order for the intended emotional progression
        const question = this.questions[this.currentQuestionIndex];
        this.askedQuestions.add(question.id);
        this.currentQuestionIndex++;

        question.asker = this.currentAsker;
        question.askingInstructions = this.getAskingInstructions(question.asker);
        this.currentAsker = this.currentAsker === 1 ? 2 : 1;

        return question;
    }

    getCurrentProgress() {
        return {
            questionsAsked: this.askedQuestions.size,
            totalQuestions: this.questions.length,
            currentLevel: Math.floor(this.askedQuestions.size / 12) + 1, // 3 levels of intimacy
            percentage: Math.round((this.askedQuestions.size / this.questions.length) * 100)
        };
    }

    resetProgress() {
        this.currentQuestionIndex = 0;
        this.askedQuestions.clear();
        this.currentAsker = 1;
    }

    getQuestionsInCategory(category) {
        return this.questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }

    getAllCategories() {
        const categories = [...new Set(this.questions.map(q => q.category))];
        return categories;
    }
}