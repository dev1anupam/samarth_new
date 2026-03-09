import { Tender, TenderSubmission } from "@/types";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const tenderService = {
    async getActiveTenders(): Promise<Tender[]> {
        await delay(500);
        return [
            {
                id: "t1",
                title: "Highway 102 Maintenance",
                description: "Yearly maintenance of the highway",
                deadline: { toDate: () => new Date(Date.now() + 86400000 * 3) },
                budget: 500000,
                status: "open"
            },
            {
                id: "t2",
                title: "New District Clinic Build",
                description: "Construction of a new medical facility",
                deadline: { toDate: () => new Date(Date.now() + 86400000 * 7) },
                budget: 2100000,
                status: "open"
            }
        ] as Tender[];
    },

    async submitQuote(contractorId: string, data: {
        tenderId: string;
        quote: number;
        documentFiles: File[];
    }): Promise<string> {

        // Simulate upload delay
        await delay(1500);

        return `mock-submission-${Date.now()}`;
    },

    async getContractorSubmissions(contractorId: string): Promise<TenderSubmission[]> {
        await delay(500);
        return [
            {
                id: "s1",
                tenderId: "t1",
                contractorId: contractorId,
                quote: 450000,
                documents: [],
                status: "pending"
            }
        ] as TenderSubmission[];
    }
};
