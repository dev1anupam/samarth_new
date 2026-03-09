const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const aiService = {
    async classifyComplaint(description: string): Promise<string> {
        await delay(1500);
        console.log("Classifying complaint:", description);
        const categories = ['Infrastructure', 'Water', 'Electricity', 'Sanitation', 'Safety'];
        return categories[Math.floor(Math.random() * categories.length)];
    },

    async analyzeSentiment(text: string): Promise<number> {
        await delay(1000);
        console.log("Analyzing sentiment:", text);
        return Math.floor(Math.random() * 100);
    },

    async generateHyperlocalUpdates(boothId: string): Promise<string> {
        await delay(2000);
        return `Update for Booth ${boothId}: Recent bridge inspections completed successfully. Road paving scheduled for next Tuesday.`;
    }
};

