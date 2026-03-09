import { supabase } from "@/lib/supabase";
import { Complaint } from "@/types";
import { aiService } from "./aiService";

export const complaintService = {
    async fileComplaint(userId: string, data: {
        description: string;
        location: { lat: number; lng: number; address: string };
        imageFile?: File;
    }): Promise<string> {

        // 1. AI Classification
        const category = await aiService.classifyComplaint(data.description);

        // 2. Prepare Supabase data
        const complaintData = {
            user_id: userId,
            description: data.description,
            location: data.location,
            category: category,
            status: 'pending',
            image_url: data.imageFile ? "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2670&auto=format&fit=crop" : "",
            created_at: new Date().toISOString()
        };

        const { data: insertedData, error } = await supabase
            .from('complaints')
            .insert(complaintData)
            .select()
            .single();

        if (error) {
            console.error("Supabase error (fileComplaint):", error.message);
            throw new Error(error.message);
        }

        return insertedData.id;
    },

    async getUserComplaints(userId: string): Promise<Complaint[]> {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase error (getUserComplaints):", error.message);
            return [];
        }

        return data as unknown as Complaint[];
    }
};
