import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ItineraryDay {
  day: number;
  activities: {
    time: string;
    location: string;
    description: string;
    type: 'sightseeing' | 'food' | 'travel' | 'rest';
    mapUrl?: string;
  }[];
}

export interface TravelPlan {
  destination: string;
  duration: number;
  people: number;
  routeSummary: string;
  itinerary: ItineraryDay[];
  foodRecommendations: {
    name: string;
    cuisine: string;
    description: string;
    mapUrl?: string;
  }[];
  staySuggestions: {
    type: string;
    description: string;
    area: string;
    bookingUrl?: string;
  }[];
  packingList: string[];
  essentialTips: string[];
}

export async function generateTravelPlan(destination: string, days: number, people: number): Promise<TravelPlan> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Plan a ${days}-day trip to ${destination} for ${people} people. 
    Include a detailed day-by-day itinerary with times, food recommendations, stay suggestions, a packing list, and essential tips.
    The itinerary should be optimized for a logical travel route between locations.
    For each location in the itinerary and food recommendations, provide a Google Maps URL (mapUrl).
    For each stay suggestion, provide a booking URL (bookingUrl) to a popular booking site like Booking.com, Airbnb, or Expedia.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          duration: { type: Type.NUMBER },
          people: { type: Type.NUMBER },
          routeSummary: { type: Type.STRING },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      location: { type: Type.STRING },
                      description: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['sightseeing', 'food', 'travel', 'rest'] },
                      mapUrl: { type: Type.STRING }
                    },
                    required: ['time', 'location', 'description', 'type', 'mapUrl']
                  }
                }
              },
              required: ['day', 'activities']
            }
          },
          foodRecommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                cuisine: { type: Type.STRING },
                description: { type: Type.STRING },
                mapUrl: { type: Type.STRING }
              },
              required: ['name', 'cuisine', 'description', 'mapUrl']
            }
          },
          staySuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                description: { type: Type.STRING },
                area: { type: Type.STRING },
                bookingUrl: { type: Type.STRING }
              },
              required: ['type', 'description', 'area', 'bookingUrl']
            }
          },
          packingList: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          essentialTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['destination', 'duration', 'people', 'routeSummary', 'itinerary', 'foodRecommendations', 'staySuggestions', 'packingList', 'essentialTips']
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
