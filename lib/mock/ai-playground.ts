import type { AIPersonality, Platform } from "@/lib/types";

export interface TestScenario {
  id: string;
  label: string;
  message: string;
  description: string;
}

export const testScenarios: TestScenario[] = [
  {
    id: "price",
    label: "Price Inquiry",
    message: "How much is the Ankara Maxi Set?",
    description: "Customer asking about product pricing",
  },
  {
    id: "negotiate",
    label: "Negotiation",
    message: "That's too expensive. Can you do 10,000 for the Ankara?",
    description: "Customer trying to negotiate price down",
  },
  {
    id: "delivery",
    label: "Delivery",
    message: "Do you deliver to Abuja? How long will it take?",
    description: "Customer asking about delivery options",
  },
  {
    id: "bulk",
    label: "Bulk Order",
    message: "I want to order 20 units of Black Soap for my store. Any wholesale price?",
    description: "Customer requesting bulk/wholesale pricing",
  },
  {
    id: "complaint",
    label: "Complaint",
    message: "The charger I bought stopped working after 2 days. I want a refund!",
    description: "Unhappy customer with a complaint",
  },
  {
    id: "recommend",
    label: "Recommendation",
    message: "I'm looking for a gift for my wife's birthday. What do you suggest?",
    description: "Customer seeking product recommendations",
  },
];

interface ResponseConfig {
  keywords: string[];
  responses: Record<AIPersonality, string>;
  productRef?: string;
}

const responseConfigs: ResponseConfig[] = [
  {
    keywords: ["price", "how much", "cost", "ankara"],
    productRef: "Ankara Maxi Set",
    responses: {
      friendly: "Hey there! 😊 The Ankara Maxi Set is NGN 15,000. It comes with a matching headwrap and is available in 5 gorgeous colours! Would you like to see the options?",
      professional: "Good day. The Ankara Maxi Set is priced at NGN 15,000. It includes a matching headwrap and is available in sizes 8-18, with 5 colour options. May I assist you with size selection?",
      casual: "The Ankara set goes for 15k! Pretty good deal - comes with headwrap too. Got it in Red & Gold, Blue & White, and a few other colours. Want me to send pics?",
      pidgin: "Na NGN 15,000 for the Ankara Maxi Set o! E come with matching headwrap. We get am for 5 different colours. Which one you like make I show you?",
    },
  },
  {
    keywords: ["expensive", "negotiate", "cheaper", "discount", "reduce", "10,000"],
    productRef: "Ankara Maxi Set",
    responses: {
      friendly: "I totally understand wanting a great deal! 😊 The best I can do is NGN 14,000 - that's already a special price since the original is NGN 18,000. The quality is really premium! Would that work for you?",
      professional: "I appreciate your interest. Our current price of NGN 15,000 reflects the premium quality of the fabric and craftsmanship. I can offer a 5% discount at NGN 14,250. This is our best available rate.",
      casual: "Haha I hear you! Look, 15k is already discounted from 18k. But tell you what - I can do 14k if you order today. Can't go lower than that though, the quality is really top notch!",
      pidgin: "Omo, I understand say you wan save money! But this Ankara na premium quality o. The real price na 18k, we don already reduce am reach 15k. Make I do 14k for you as last price, how you see am?",
    },
  },
  {
    keywords: ["deliver", "delivery", "abuja", "shipping", "ship"],
    responses: {
      friendly: "Great question! Yes, we deliver to Abuja! 🚀 Delivery usually takes 2-3 business days within Lagos and 3-5 days for Abuja. Delivery fee is NGN 1,500 for Lagos and NGN 2,500 for Abuja.",
      professional: "Yes, we deliver nationwide. For Abuja, the delivery timeline is 3-5 business days. The delivery fee is NGN 2,500. For Lagos, it's 1-2 business days at NGN 1,500. Would you like to proceed?",
      casual: "Yeah we ship to Abuja! Takes about 3-5 days, costs 2,500 for delivery. Lagos is faster - 1-2 days, 1,500 delivery. Want to place an order?",
      pidgin: "Yes o, we dey deliver to Abuja! E go take like 3-5 days reach there. Delivery fee na NGN 2,500 for Abuja, but for Lagos na NGN 1,500. You wan order?",
    },
  },
  {
    keywords: ["bulk", "wholesale", "20 units", "store", "boutique"],
    productRef: "Black Soap Bundle",
    responses: {
      friendly: "Oh wow, bulk order! 🎉 For 20 units of Black Soap at NGN 2,500 each, that's NGN 50,000. I can offer you a 15% wholesale discount - so NGN 42,500 total! Let me connect you with our manager for the details.",
      professional: "Thank you for your wholesale inquiry. For an order of 20 units of Black Soap Bundle, the standard total would be NGN 50,000. We offer a 15% wholesale discount, bringing your total to NGN 42,500. I'll escalate this to our business manager for processing.",
      casual: "Nice, bulk order! 20 Black Soaps would normally be 50k but for wholesale I can do 15% off - that's 42,500. Let me get my manager to sort out the details for you.",
      pidgin: "Ehen! Na serious order be this! 20 Black Soap na 50k normally, but for wholesale we go give you 15% discount - na NGN 42,500 total. Make I connect you to our oga for arrange everything.",
    },
  },
  {
    keywords: ["refund", "complaint", "broken", "stopped", "not working", "defective"],
    responses: {
      friendly: "I'm really sorry to hear that! 😔 That's definitely not the experience we want for our customers. Let me look into this right away. Can you share your order number? We'll arrange a replacement or refund within 24 hours.",
      professional: "I sincerely apologize for the inconvenience. We take product quality very seriously. Please provide your order number and I'll escalate this immediately. We offer a full replacement or refund within our 7-day return policy.",
      casual: "Oh no, that's not cool! Sorry about that. Send me your order number and we'll sort it out ASAP - either a replacement or refund, your choice. We got you!",
      pidgin: "Ah sorry o! That one no good at all. Abeg send your order number make we sort am out sharp sharp. We go give you new one or return your money, whichever one you prefer.",
    },
  },
  {
    keywords: ["gift", "birthday", "suggest", "recommend", "wife"],
    productRef: "Gele & Aso Oke Set",
    responses: {
      friendly: "Aww, what a thoughtful partner! 💝 For a birthday gift, I'd recommend our Gele & Aso Oke Set at NGN 35,000 - it's absolutely stunning and comes in Champagne Gold which is perfect for special occasions! We also have the Body Butter Combo Pack at NGN 6,000 if you want something more casual.",
      professional: "For a birthday gift, I would recommend our Gele & Aso Oke Set (NGN 35,000) - a premium handwoven piece available in 6 elegant colours including Champagne Gold. Alternatively, our Body Butter Combo Pack (NGN 6,000) or Scented Candle Set (NGN 9,000) make excellent gifts as well.",
      casual: "Birthday gift shopping! Nice! 🎁 I'd say go for the Gele & Aso Oke Set - 35k, comes in beautiful colours like Champagne Gold. If that's too much, the Body Butter Combo (6k) or Scented Candles (9k) are also great options!",
      pidgin: "Na birthday gift you wan buy for madam! Na correct man you be! I go recommend Gele & Aso Oke Set for 35k - e fine die! Get Champagne Gold colour wey sweet well well. Or if you wan something small, Body Butter Combo na 6k. Wetin you think?",
    },
  },
];

const fallbackResponses: Record<AIPersonality, string> = {
  friendly: "Thanks for reaching out! 😊 I'd love to help you. Could you tell me more about what you're looking for? We have amazing products across fashion, body care, food, and accessories!",
  professional: "Thank you for your inquiry. I'd be happy to assist you. Could you please provide more details about what you're looking for? We offer products across fashion, body care, food, and accessories.",
  casual: "Hey! What are you looking for today? We've got fashion, body care, food, and accessories. Hit me with your question!",
  pidgin: "How far! Wetin you dey find today? We get fashion, body care, food, and accessories. Tell me wetin you need make I help you!",
};

export interface PlaygroundMessage {
  id: string;
  role: "customer" | "ai";
  content: string;
  timestamp: string;
  productRef?: string;
  responseTime?: number;
  personality?: AIPersonality;
  platform?: Platform;
}

export function generateAIResponse(
  message: string,
  personality: AIPersonality,
  platform: Platform
): { content: string; productRef?: string; responseTime: number } {
  const lowerMessage = message.toLowerCase();

  for (const config of responseConfigs) {
    const match = config.keywords.some((kw) => lowerMessage.includes(kw));
    if (match) {
      return {
        content: config.responses[personality],
        productRef: config.productRef,
        responseTime: Math.floor(Math.random() * 800) + 400,
      };
    }
  }

  return {
    content: fallbackResponses[personality],
    responseTime: Math.floor(Math.random() * 600) + 300,
  };
}
