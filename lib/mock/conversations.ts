import type { Conversation, Message } from "@/lib/types";

function msg(
  id: string,
  conversationId: string,
  content: string,
  sender: Message["sender"],
  platform: Message["platform"],
  timestamp: string,
  isRead = true,
  productShare?: Message["productShare"]
): Message {
  return { id, conversationId, content, sender, platform, timestamp, isRead, productShare };
}

export const mockConversations: Conversation[] = [
  // 1 - Blessing Eze - Instagram - Active
  {
    id: "conv_001",
    contactName: "Blessing Eze",
    contactAvatar: "/images/avatars/blessing.jpg",
    platform: "instagram",
    status: "active",
    lastMessage: "Bros, how much for the Ankara?",
    lastMessageAt: "2026-05-16T09:15:00Z",
    unreadCount: 2,
    isAIEnabled: true,
    assignedTo: "user_001",
    leadId: "lead_001",
    messages: [
      msg("m001", "conv_001", "Hi! I saw the Ankara set on your page. It's fire!", "customer", "instagram", "2026-05-16T09:00:00Z"),
      msg("m002", "conv_001", "Thanks for reaching out! The Ankara Maxi Set is one of our best sellers. It's NGN 15,000 and comes in 5 beautiful colours. Would you like to see the colour options?", "ai", "instagram", "2026-05-16T09:00:30Z"),
      msg("m003", "conv_001", "Yes please! And do you have it in size 12?", "customer", "instagram", "2026-05-16T09:05:00Z"),
      msg("m004", "conv_001", "Absolutely! We have it in sizes 8-18. Here are the available colours for your size 12:", "ai", "instagram", "2026-05-16T09:05:25Z", true, {
        productId: "prod_001",
        name: "Ankara Maxi Set",
        price: 15000,
        image: "/images/products/ankara-set.jpg",
      }),
      msg("m005", "conv_001", "Bros, how much for the Ankara?", "customer", "instagram", "2026-05-16T09:15:00Z", false),
    ],
  },

  // 2 - Tunde Bakare - WhatsApp - Active
  {
    id: "conv_002",
    contactName: "Tunde Bakare",
    contactAvatar: "/images/avatars/tunde.jpg",
    platform: "whatsapp",
    status: "active",
    lastMessage: "I don pay o, check your account",
    lastMessageAt: "2026-05-16T08:42:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    assignedTo: "user_002",
    leadId: "lead_002",
    messages: [
      msg("m006", "conv_002", "Good morning. I want to order the Samsung Charger and iPhone 15 Case", "customer", "whatsapp", "2026-05-16T07:30:00Z"),
      msg("m007", "conv_002", "Good morning! Great choices. The Samsung Charger is NGN 5,000 and the iPhone 15 Case is NGN 3,500. Total comes to NGN 8,500. Should I process this order for you?", "ai", "whatsapp", "2026-05-16T07:30:20Z"),
      msg("m008", "conv_002", "Yes o. But abeg, you fit give me small discount? I dey buy two things na", "customer", "whatsapp", "2026-05-16T07:35:00Z"),
      msg("m009", "conv_002", "I understand! Let me offer you a 5% discount for bundling. Your new total is NGN 8,075. Delivery to Lagos is NGN 1,500. Grand total: NGN 9,575. How would you like to pay?", "ai", "whatsapp", "2026-05-16T07:35:25Z"),
      msg("m010", "conv_002", "Transfer. Send your account details", "customer", "whatsapp", "2026-05-16T07:40:00Z"),
      msg("m011", "conv_002", "Please transfer to:\nBank: GTBank\nAccount: 0123456789\nName: Amaka's Closet & More\n\nTotal: NGN 9,575\n\nPlease share your payment confirmation once done!", "ai", "whatsapp", "2026-05-16T07:40:15Z"),
      msg("m012", "conv_002", "I don pay o, check your account", "customer", "whatsapp", "2026-05-16T08:42:00Z", false),
    ],
  },

  // 3 - Chioma Adekunle - Facebook - Waiting
  {
    id: "conv_003",
    contactName: "Chioma Adekunle",
    contactAvatar: "/images/avatars/chioma.jpg",
    platform: "facebook",
    status: "waiting",
    lastMessage: "When will my order arrive?",
    lastMessageAt: "2026-05-16T07:30:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    assignedTo: "user_001",
    leadId: "lead_003",
    messages: [
      msg("m013", "conv_003", "Hello, I placed an order 3 days ago for the Gele & Aso Oke Set. Order #ORD-2026-008", "customer", "facebook", "2026-05-15T14:00:00Z"),
      msg("m014", "conv_003", "Hello Chioma! Thank you for your order. Let me check on that for you. Your order #ORD-2026-008 has been shipped and is currently in transit. Expected delivery is within 1-2 business days.", "ai", "facebook", "2026-05-15T14:00:30Z"),
      msg("m015", "conv_003", "Okay thank you. I need it for a wedding this Saturday", "customer", "facebook", "2026-05-15T14:05:00Z"),
      msg("m016", "conv_003", "No worries! You should receive it before Saturday. Our delivery partner will send you a tracking link shortly. Is there anything else I can help with?", "ai", "facebook", "2026-05-15T14:05:20Z"),
      msg("m017", "conv_003", "When will my order arrive?", "customer", "facebook", "2026-05-16T07:30:00Z"),
    ],
  },

  // 4 - Emeka Okafor - Instagram - Active
  {
    id: "conv_004",
    contactName: "Emeka Okafor",
    contactAvatar: "/images/avatars/emeka.jpg",
    platform: "instagram",
    status: "active",
    lastMessage: "Sis, I wan order 2 of the shea butter",
    lastMessageAt: "2026-05-15T22:10:00Z",
    unreadCount: 3,
    isAIEnabled: true,
    leadId: "lead_004",
    messages: [
      msg("m018", "conv_004", "Hello! I saw your body care products on explore", "customer", "instagram", "2026-05-15T21:45:00Z"),
      msg("m019", "conv_004", "Welcome! We have a lovely range of natural body care products. Our bestsellers are the Shea Butter (NGN 4,500) and Black Soap Bundle (NGN 2,500). What are you interested in?", "ai", "instagram", "2026-05-15T21:45:25Z"),
      msg("m020", "conv_004", "Sis, I wan order 2 of the shea butter", "customer", "instagram", "2026-05-15T22:10:00Z", false),
    ],
  },

  // 5 - Aisha Mohammed - WhatsApp - Resolved
  {
    id: "conv_005",
    contactName: "Aisha Mohammed",
    contactAvatar: "/images/avatars/aisha.jpg",
    platform: "whatsapp",
    status: "resolved",
    lastMessage: "Thank you! The lace fabric is beautiful",
    lastMessageAt: "2026-05-15T18:45:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    leadId: "lead_005",
    messages: [
      msg("m021", "conv_005", "Salam! I received my order today", "customer", "whatsapp", "2026-05-15T18:30:00Z"),
      msg("m022", "conv_005", "Wa alaikum salam! I'm glad to hear that. How does everything look?", "ai", "whatsapp", "2026-05-15T18:30:20Z"),
      msg("m023", "conv_005", "Thank you! The lace fabric is beautiful", "customer", "whatsapp", "2026-05-15T18:45:00Z"),
      msg("m024", "conv_005", "We're so happy you love it! Please feel free to share a photo if you can. And don't forget, we have new Aso Oke sets arriving next week!", "ai", "whatsapp", "2026-05-15T18:45:30Z"),
    ],
  },

  // 6 - Kemi Oluwole - Instagram - Active
  {
    id: "conv_006",
    contactName: "Kemi Oluwole",
    contactAvatar: "/images/avatars/kemi.jpg",
    platform: "instagram",
    status: "active",
    lastMessage: "Abeg, you fit give me discount?",
    lastMessageAt: "2026-05-16T10:05:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    assignedTo: "user_003",
    leadId: "lead_006",
    messages: [
      msg("m025", "conv_006", "Hi! How much is the Adire Agbada?", "customer", "instagram", "2026-05-16T09:30:00Z"),
      msg("m026", "conv_006", "Hello Kemi! The Adire Agbada is NGN 25,000. It's handcrafted with premium indigo dye and comes with a matching cap. Would you like more details?", "ai", "instagram", "2026-05-16T09:30:25Z"),
      msg("m027", "conv_006", "Hmm that one dey cost sha. Abeg, you fit give me discount?", "customer", "instagram", "2026-05-16T09:45:00Z"),
      msg("m028", "conv_006", "I understand it's a premium piece! I can offer you NGN 23,500 as a special price. The quality is really worth it - each piece is hand-dyed by our artisans in Abeokuta. Would you like to proceed?", "ai", "instagram", "2026-05-16T09:45:30Z"),
      msg("m029", "conv_006", "Abeg, you fit give me discount?", "customer", "instagram", "2026-05-16T10:05:00Z", false),
    ],
  },

  // 7 - Obinna Eze - WhatsApp - Active
  {
    id: "conv_007",
    contactName: "Obinna Eze",
    contactAvatar: "/images/avatars/obinna.jpg",
    platform: "whatsapp",
    status: "active",
    lastMessage: "Make I order the jollof rice for 20 people",
    lastMessageAt: "2026-05-16T11:00:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    leadId: "lead_007",
    messages: [
      msg("m030", "conv_007", "Good day! I'm planning an office party. What food options do you have?", "customer", "whatsapp", "2026-05-16T10:30:00Z"),
      msg("m031", "conv_007", "Good day! We have great catering options:\n\n1. Jollof Rice Platter - NGN 8,000 (serves 5)\n2. Small Chops Tray - NGN 12,000 (50 pieces)\n3. Puff Puff & Chin Chin Box - NGN 3,000\n\nHow many people are you expecting?", "ai", "whatsapp", "2026-05-16T10:30:25Z"),
      msg("m032", "conv_007", "About 20 people. Make I order the jollof rice for 20 people", "customer", "whatsapp", "2026-05-16T11:00:00Z", false),
    ],
  },

  // 8 - Yetunde Balogun - Facebook - Waiting
  {
    id: "conv_008",
    contactName: "Yetunde Balogun",
    contactAvatar: "/images/avatars/yetunde.jpg",
    platform: "facebook",
    status: "waiting",
    lastMessage: "I need to return the charger, it's not working",
    lastMessageAt: "2026-05-15T16:20:00Z",
    unreadCount: 0,
    isAIEnabled: false,
    assignedTo: "user_002",
    messages: [
      msg("m033", "conv_008", "Hello, I bought a Samsung Charger from your page last week but it stopped working after 2 days", "customer", "facebook", "2026-05-15T15:00:00Z"),
      msg("m034", "conv_008", "Oh no, I'm sorry to hear that! We have a replacement policy for defective items. Could you please share your order number and a photo/video of the issue?", "ai", "facebook", "2026-05-15T15:00:30Z"),
      msg("m035", "conv_008", "Order #ORD-2026-005. Let me transfer you to a human agent for this.", "customer", "facebook", "2026-05-15T15:10:00Z"),
      msg("m036", "conv_008", "Hi Yetunde, this is Chidi. I'm looking into your order now. We'll arrange a replacement for you. Can you confirm your address?", "business", "facebook", "2026-05-15T15:25:00Z"),
      msg("m037", "conv_008", "I need to return the charger, it's not working", "customer", "facebook", "2026-05-15T16:20:00Z"),
    ],
  },

  // 9 - Ngozi Uche - Instagram - Resolved
  {
    id: "conv_009",
    contactName: "Ngozi Uche",
    contactAvatar: "/images/avatars/ngozi.jpg",
    platform: "instagram",
    status: "resolved",
    lastMessage: "Thank you! God bless",
    lastMessageAt: "2026-05-14T17:00:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    leadId: "lead_009",
    messages: [
      msg("m038", "conv_009", "How much for black soap?", "customer", "instagram", "2026-05-14T15:00:00Z"),
      msg("m039", "conv_009", "Hi there! Our Black Soap Bundle is NGN 2,500 and includes 3 bars of premium African black soap. Would you like to order?", "ai", "instagram", "2026-05-14T15:00:25Z"),
      msg("m040", "conv_009", "Yes please! How do I pay?", "customer", "instagram", "2026-05-14T15:15:00Z"),
      msg("m041", "conv_009", "Great! You can pay via bank transfer or pay on delivery. For transfer:\nGTBank: 0123456789\nAmaka's Closet & More\nAmount: NGN 2,500 + NGN 1,000 delivery = NGN 3,500\n\nPlease send your delivery address too!", "ai", "instagram", "2026-05-14T15:15:25Z"),
      msg("m042", "conv_009", "15 Bode Thomas Street, Surulere, Lagos. I'll pay on delivery", "customer", "instagram", "2026-05-14T15:30:00Z"),
      msg("m043", "conv_009", "Order confirmed! You'll receive your Black Soap Bundle within 2-3 business days at 15 Bode Thomas Street, Surulere. Payment on delivery: NGN 3,500. Thank you!", "ai", "instagram", "2026-05-14T15:30:20Z"),
      msg("m044", "conv_009", "Thank you! God bless", "customer", "instagram", "2026-05-14T17:00:00Z"),
    ],
  },

  // 10 - Femi Adewale - WhatsApp - Active
  {
    id: "conv_010",
    contactName: "Femi Adewale",
    contactAvatar: "/images/avatars/femi.jpg",
    platform: "whatsapp",
    status: "active",
    lastMessage: "I need am before Friday, you fit deliver?",
    lastMessageAt: "2026-05-16T08:00:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    leadId: "lead_010",
    messages: [
      msg("m045", "conv_010", "Good evening. I'm looking for Aso Oke for my wedding", "customer", "whatsapp", "2026-05-15T20:00:00Z"),
      msg("m046", "conv_010", "Congratulations on your upcoming wedding! We have the Gele & Aso Oke Set at NGN 35,000. It includes the Aso Oke fabric, pre-tied gele, and ipele. We also have individual pieces if you prefer.", "ai", "whatsapp", "2026-05-15T20:00:30Z"),
      msg("m047", "conv_010", "How many colours do you have? My aso ebi colour is emerald green", "customer", "whatsapp", "2026-05-15T20:15:00Z"),
      msg("m048", "conv_010", "We have emerald green in stock! Other available colours are royal blue, burgundy, champagne gold, and coral. The emerald green is very popular for aso ebi. Shall I reserve a set for you?", "ai", "whatsapp", "2026-05-15T20:15:25Z"),
      msg("m049", "conv_010", "I need am before Friday, you fit deliver?", "customer", "whatsapp", "2026-05-16T08:00:00Z", false),
    ],
  },

  // 11 - Adaeze Okoro - Instagram - Active
  {
    id: "conv_011",
    contactName: "Adaeze Okoro",
    contactAvatar: "/images/avatars/adaeze.jpg",
    platform: "instagram",
    status: "active",
    lastMessage: "Wetin be the difference between the Ankara styles?",
    lastMessageAt: "2026-05-16T07:45:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    leadId: "lead_011",
    messages: [
      msg("m050", "conv_011", "Good morning! I love your page", "customer", "instagram", "2026-05-16T07:00:00Z"),
      msg("m051", "conv_011", "Good morning! Thank you so much, we appreciate the love! How can we help you today?", "ai", "instagram", "2026-05-16T07:00:20Z"),
      msg("m052", "conv_011", "I want to buy Ankara. Wetin be the difference between the Ankara styles?", "customer", "instagram", "2026-05-16T07:45:00Z", false),
    ],
  },

  // 12 - Ibrahim Musa - WhatsApp - Resolved
  {
    id: "conv_012",
    contactName: "Ibrahim Musa",
    contactAvatar: "/images/avatars/ibrahim.jpg",
    platform: "whatsapp",
    status: "resolved",
    lastMessage: "Jazakallah, the items arrived perfectly",
    lastMessageAt: "2026-05-13T12:00:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    leadId: "lead_012",
    messages: [
      msg("m053", "conv_012", "Assalamu alaikum, I want to order Black Soap and Shea Butter", "customer", "whatsapp", "2026-05-11T10:00:00Z"),
      msg("m054", "conv_012", "Wa alaikum salam! The Black Soap Bundle is NGN 2,500 and Shea Butter 500g is NGN 4,500. Together that's NGN 7,000. Shall I process this for you?", "ai", "whatsapp", "2026-05-11T10:00:25Z"),
      msg("m055", "conv_012", "Yes, I'll pay by transfer", "customer", "whatsapp", "2026-05-11T10:15:00Z"),
      msg("m056", "conv_012", "Jazakallah, the items arrived perfectly", "customer", "whatsapp", "2026-05-13T12:00:00Z"),
    ],
  },

  // 13 - Sade Ogundimu - Facebook - Waiting
  {
    id: "conv_013",
    contactName: "Sade Ogundimu",
    contactAvatar: "/images/avatars/sade.jpg",
    platform: "facebook",
    status: "waiting",
    lastMessage: "Can you do bulk pricing for 10 pieces?",
    lastMessageAt: "2026-05-15T14:30:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    assignedTo: "user_001",
    leadId: "lead_013",
    messages: [
      msg("m057", "conv_013", "Hi, I run a boutique and I'm interested in wholesale pricing for your Ankara sets", "customer", "facebook", "2026-05-15T13:00:00Z"),
      msg("m058", "conv_013", "Hello Sade! We'd love to partner with you. For bulk orders, we offer special pricing. Could you tell me which items you're interested in and the quantities?", "ai", "facebook", "2026-05-15T13:00:30Z"),
      msg("m059", "conv_013", "The Ankara Maxi Set and the Lace Fabric. Can you do bulk pricing for 10 pieces?", "customer", "facebook", "2026-05-15T14:30:00Z"),
      msg("m060", "conv_013", "For bulk orders of 10+, I'd need to connect you with our owner Amaka for special pricing. Let me transfer this conversation. She'll get back to you shortly!", "ai", "facebook", "2026-05-15T14:30:30Z"),
    ],
  },

  // 14 - Dayo Oni - Instagram - Active
  {
    id: "conv_014",
    contactName: "Dayo Oni",
    contactAvatar: "/images/avatars/dayo.jpg",
    platform: "instagram",
    status: "active",
    lastMessage: "E get different colours for the phone case?",
    lastMessageAt: "2026-05-16T06:30:00Z",
    unreadCount: 2,
    isAIEnabled: true,
    leadId: "lead_014",
    messages: [
      msg("m061", "conv_014", "Yo! How far? You sell phone cases?", "customer", "instagram", "2026-05-16T06:00:00Z"),
      msg("m062", "conv_014", "Hey! Yes we do! Our iPhone 15 Case is NGN 3,500 and it's very popular. We also have cases for Samsung models. Which phone do you have?", "ai", "instagram", "2026-05-16T06:00:25Z"),
      msg("m063", "conv_014", "iPhone 15 Pro Max. E get different colours for the phone case?", "customer", "instagram", "2026-05-16T06:30:00Z", false),
    ],
  },

  // 15 - Halima Bello - WhatsApp - Active
  {
    id: "conv_015",
    contactName: "Halima Bello",
    contactAvatar: "/images/avatars/halima.jpg",
    platform: "whatsapp",
    status: "active",
    lastMessage: "How much be delivery to Abuja?",
    lastMessageAt: "2026-05-16T09:45:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    leadId: "lead_015",
    messages: [
      msg("m064", "conv_015", "Good morning, I want to order the Shea Butter and the Black Soap", "customer", "whatsapp", "2026-05-16T09:00:00Z"),
      msg("m065", "conv_015", "Good morning Halima! Great choice. Shea Butter 500g: NGN 4,500 and Black Soap Bundle: NGN 2,500. Subtotal: NGN 7,000. Where should we deliver?", "ai", "whatsapp", "2026-05-16T09:00:25Z"),
      msg("m066", "conv_015", "How much be delivery to Abuja?", "customer", "whatsapp", "2026-05-16T09:45:00Z", false),
    ],
  },

  // 16 - Chukwuemeka Nnadi - Facebook - Resolved
  {
    id: "conv_016",
    contactName: "Chukwuemeka Nnadi",
    contactAvatar: "/images/avatars/chukwuemeka.jpg",
    platform: "facebook",
    status: "resolved",
    lastMessage: "Order received. Well packaged. Thank you!",
    lastMessageAt: "2026-05-12T15:30:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    messages: [
      msg("m067", "conv_016", "I want to buy the Adire Agbada. Size XL", "customer", "facebook", "2026-05-10T11:00:00Z"),
      msg("m068", "conv_016", "The Adire Agbada in XL is NGN 25,000. It comes with a matching cap. Would you like to proceed?", "ai", "facebook", "2026-05-10T11:00:25Z"),
      msg("m069", "conv_016", "Yes, card payment", "customer", "facebook", "2026-05-10T11:15:00Z"),
      msg("m070", "conv_016", "Order received. Well packaged. Thank you!", "customer", "facebook", "2026-05-12T15:30:00Z"),
    ],
  },

  // 17 - Olumide Fashanu - Instagram - Active
  {
    id: "conv_017",
    contactName: "Olumide Fashanu",
    contactAvatar: "/images/avatars/olumide.jpg",
    platform: "instagram",
    status: "active",
    lastMessage: "I go take the puff puff for 50 people wedding",
    lastMessageAt: "2026-05-16T10:30:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    leadId: "lead_017",
    messages: [
      msg("m071", "conv_017", "Hello! Do you cater for events?", "customer", "instagram", "2026-05-16T10:00:00Z"),
      msg("m072", "conv_017", "Hi Olumide! Yes, we do event catering. We have Jollof Rice Platters, Small Chops Trays, and Puff Puff & Chin Chin Boxes. What's the occasion and how many guests?", "ai", "instagram", "2026-05-16T10:00:25Z"),
      msg("m073", "conv_017", "I go take the puff puff for 50 people wedding", "customer", "instagram", "2026-05-16T10:30:00Z", false),
    ],
  },

  // 18 - Grace Ojo - WhatsApp - Waiting
  {
    id: "conv_018",
    contactName: "Grace Ojo",
    contactAvatar: "/images/avatars/grace.jpg",
    platform: "whatsapp",
    status: "waiting",
    lastMessage: "I wan cancel my order, something came up",
    lastMessageAt: "2026-05-15T19:00:00Z",
    unreadCount: 0,
    isAIEnabled: false,
    assignedTo: "user_002",
    messages: [
      msg("m074", "conv_018", "Please I want to cancel my order #ORD-2026-010", "customer", "whatsapp", "2026-05-15T18:00:00Z"),
      msg("m075", "conv_018", "I'm sorry to hear that. Let me connect you with our team to process the cancellation. One moment please.", "ai", "whatsapp", "2026-05-15T18:00:25Z"),
      msg("m076", "conv_018", "Hi Grace, this is Chidi. Can I ask why you'd like to cancel? Maybe we can help resolve any concerns?", "business", "whatsapp", "2026-05-15T18:15:00Z"),
      msg("m077", "conv_018", "I wan cancel my order, something came up", "customer", "whatsapp", "2026-05-15T19:00:00Z"),
    ],
  },

  // 19 - Tobi Akinola - Instagram - Resolved
  {
    id: "conv_019",
    contactName: "Tobi Akinola",
    contactAvatar: "/images/avatars/tobi.jpg",
    platform: "instagram",
    status: "resolved",
    lastMessage: "Alright, I don order. Thanks!",
    lastMessageAt: "2026-05-14T20:00:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    messages: [
      msg("m078", "conv_019", "How much for Small Chops Tray?", "customer", "instagram", "2026-05-14T18:00:00Z"),
      msg("m079", "conv_019", "Our Small Chops Tray is NGN 12,000 for 50 pieces. Includes spring rolls, samosa, puff puff, and chicken strips. Perfect for parties!", "ai", "instagram", "2026-05-14T18:00:25Z"),
      msg("m080", "conv_019", "Alright, I don order. Thanks!", "customer", "instagram", "2026-05-14T20:00:00Z"),
    ],
  },

  // 20 - Nkechi Umeh - WhatsApp - Active
  {
    id: "conv_020",
    contactName: "Nkechi Umeh",
    contactAvatar: "/images/avatars/nkechi.jpg",
    platform: "whatsapp",
    status: "active",
    lastMessage: "You get the cream colour for lace?",
    lastMessageAt: "2026-05-16T11:30:00Z",
    unreadCount: 2,
    isAIEnabled: true,
    leadId: "lead_020",
    messages: [
      msg("m081", "conv_020", "Hello, I'm looking for lace fabric for my daughter's introduction ceremony", "customer", "whatsapp", "2026-05-16T11:00:00Z"),
      msg("m082", "conv_020", "Hello! Congratulations! Our Lace Fabric is NGN 18,000 for 5 yards. We have it in white, cream, gold, wine, and navy blue. Which colour interests you?", "ai", "whatsapp", "2026-05-16T11:00:25Z"),
      msg("m083", "conv_020", "You get the cream colour for lace?", "customer", "whatsapp", "2026-05-16T11:30:00Z", false),
    ],
  },

  // 21 - Segun Alabi - Facebook - Active
  {
    id: "conv_021",
    contactName: "Segun Alabi",
    contactAvatar: "/images/avatars/segun.jpg",
    platform: "facebook",
    status: "active",
    lastMessage: "Oya send your account make I pay sharp sharp",
    lastMessageAt: "2026-05-16T08:15:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    leadId: "lead_021",
    messages: [
      msg("m084", "conv_021", "Good morning. Price for iPhone 15 case?", "customer", "facebook", "2026-05-16T07:45:00Z"),
      msg("m085", "conv_021", "Good morning Segun! The iPhone 15 Case is NGN 3,500. It's a premium silicone case with shock protection. Available in black, navy, and transparent.", "ai", "facebook", "2026-05-16T07:45:25Z"),
      msg("m086", "conv_021", "Black one. Oya send your account make I pay sharp sharp", "customer", "facebook", "2026-05-16T08:15:00Z", false),
    ],
  },

  // 22 - Ifeoma Nwachukwu - Instagram - Waiting
  {
    id: "conv_022",
    contactName: "Ifeoma Nwachukwu",
    contactAvatar: "/images/avatars/ifeoma.jpg",
    platform: "instagram",
    status: "waiting",
    lastMessage: "My budget na 30k, wetin I fit buy?",
    lastMessageAt: "2026-05-15T13:00:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    assignedTo: "user_003",
    leadId: "lead_022",
    messages: [
      msg("m087", "conv_022", "Hi, I'm shopping for owambe outfits", "customer", "instagram", "2026-05-15T12:00:00Z"),
      msg("m088", "conv_022", "Hello Ifeoma! We have beautiful owambe options! Our Ankara Maxi Set starts at NGN 15,000, Gele & Aso Oke Set at NGN 35,000, and Lace Fabric at NGN 18,000. What's your budget range?", "ai", "instagram", "2026-05-15T12:00:25Z"),
      msg("m089", "conv_022", "My budget na 30k, wetin I fit buy?", "customer", "instagram", "2026-05-15T13:00:00Z"),
    ],
  },

  // 23 - Babajide Williams - WhatsApp - Resolved
  {
    id: "conv_023",
    contactName: "Babajide Williams",
    contactAvatar: "/images/avatars/babajide.jpg",
    platform: "whatsapp",
    status: "resolved",
    lastMessage: "Na correct product, well done!",
    lastMessageAt: "2026-05-11T16:00:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    messages: [
      msg("m090", "conv_023", "I ordered the Adire Agbada, when will it arrive?", "customer", "whatsapp", "2026-05-09T09:00:00Z"),
      msg("m091", "conv_023", "Hi Babajide! Your order is being prepared and should ship today. Expected delivery in 2-3 business days to your address in Ikeja.", "ai", "whatsapp", "2026-05-09T09:00:25Z"),
      msg("m092", "conv_023", "Na correct product, well done!", "customer", "whatsapp", "2026-05-11T16:00:00Z"),
    ],
  },

  // 24 - Nneka Chidozie - Facebook - Active
  {
    id: "conv_024",
    contactName: "Nneka Chidozie",
    contactAvatar: "/images/avatars/nneka.jpg",
    platform: "facebook",
    status: "active",
    lastMessage: "I dey interested in the body care combo, how much?",
    lastMessageAt: "2026-05-16T12:00:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    leadId: "lead_024",
    messages: [
      msg("m093", "conv_024", "Do you sell body care products?", "customer", "facebook", "2026-05-16T11:30:00Z"),
      msg("m094", "conv_024", "Yes we do! We have:\n- Shea Butter 500g: NGN 4,500\n- Black Soap Bundle (3 bars): NGN 2,500\n- Body Butter Combo Pack: NGN 6,000\n\nAll products are 100% natural and locally sourced!", "ai", "facebook", "2026-05-16T11:30:25Z"),
      msg("m095", "conv_024", "I dey interested in the body care combo, how much?", "customer", "facebook", "2026-05-16T12:00:00Z", false),
    ],
  },

  // 25 - Musa Abdullahi - WhatsApp - Active
  {
    id: "conv_025",
    contactName: "Musa Abdullahi",
    contactAvatar: "/images/avatars/musa.jpg",
    platform: "whatsapp",
    status: "active",
    lastMessage: "I wan buy for my wife birthday, you fit wrap am?",
    lastMessageAt: "2026-05-16T10:15:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    leadId: "lead_025",
    messages: [
      msg("m096", "conv_025", "Salaam, I want to buy the Gele & Aso Oke Set in gold colour", "customer", "whatsapp", "2026-05-16T09:30:00Z"),
      msg("m097", "conv_025", "Wa alaikum salam Musa! The Gele & Aso Oke Set in gold is available. It's NGN 35,000 and includes the complete set. Would you like to proceed?", "ai", "whatsapp", "2026-05-16T09:30:25Z"),
      msg("m098", "conv_025", "I wan buy for my wife birthday, you fit wrap am?", "customer", "whatsapp", "2026-05-16T10:15:00Z", false),
    ],
  },

  // 26 - Bukola Adeola - Instagram - Resolved
  {
    id: "conv_026",
    contactName: "Bukola Adeola",
    contactAvatar: "/images/avatars/bukola.jpg",
    platform: "instagram",
    status: "resolved",
    lastMessage: "Love the packaging! Will order again soon",
    lastMessageAt: "2026-05-13T14:00:00Z",
    unreadCount: 0,
    isAIEnabled: true,
    messages: [
      msg("m099", "conv_026", "Just received my Ankara set! The quality is amazing", "customer", "instagram", "2026-05-13T13:00:00Z"),
      msg("m100", "conv_026", "We're so glad you love it! Thank you for shopping with us. Feel free to tag us in your photos!", "ai", "instagram", "2026-05-13T13:00:25Z"),
      msg("m101", "conv_026", "Love the packaging! Will order again soon", "customer", "instagram", "2026-05-13T14:00:00Z"),
    ],
  },

  // 27 - Uche Nnamdi - WhatsApp - Active
  {
    id: "conv_027",
    contactName: "Uche Nnamdi",
    contactAvatar: "/images/avatars/uche.jpg",
    platform: "whatsapp",
    status: "active",
    lastMessage: "Wetin be your best seller for guys?",
    lastMessageAt: "2026-05-16T12:30:00Z",
    unreadCount: 1,
    isAIEnabled: true,
    messages: [
      msg("m102", "conv_027", "Bros, I dey look for native wear for my friend wedding", "customer", "whatsapp", "2026-05-16T12:00:00Z"),
      msg("m103", "conv_027", "Hey! You're in the right place. For men's native, we have the Adire Agbada at NGN 25,000 - it's a real showstopper. We also have Aso Oke sets that you can customize.", "ai", "whatsapp", "2026-05-16T12:00:25Z"),
      msg("m104", "conv_027", "Wetin be your best seller for guys?", "customer", "whatsapp", "2026-05-16T12:30:00Z", false),
    ],
  },
];
