// English presentation copy only. Question IDs, option IDs, and scoring stay in the original model.
type DessertId = "S" | "P" | "D" | "C" | "B" | "M" | "L" | "T";
type TasteDimension = "texture" | "flavor" | "enjoyment";

export const englishQuestions: Record<string, { title: string; options: Record<string, string> }> = {
  q1: {
    title: "You arrive 20 minutes before meeting a friend.",
    options: {
      "0": "Look for a comfortable seat for your friend in advance",
      "1": "Look out the window and give today's scene a title",
      "2": "Notice the little details in this unfamiliar place",
      "3": "Choose the seat you feel like sitting in right now",
    },
  },
  q2: {
    title: "Your afternoon plans suddenly clear up.",
    options: {
      "0": "Take a short break without deciding what to do",
      "1": "Walk down a nearby alley you have never explored",
      "2": "Follow your usual favorite walking route",
      "3": "Gather ideas from the friends you could spend time with",
    },
  },
  q3: {
    title: "What if you held a little event of your own at a café?",
    options: {
      "0": "Make invitations that leave nobody out",
      "1": "Start by inventing a quirky, cute name for the event",
      "2": "Create a quiet corner where everyone can pause for a while",
      "3": "Find a way for everyone to join in comfortably",
    },
  },
  q4: {
    title: "An unfamiliar little object is sitting on the table.",
    options: {
      "0": "Look closely to find out how it was made",
      "1": "Clearly notice which parts suit your taste and which do not",
      "2": "Suggest trying it out together",
      "3": "Choose a proper place for it and set it down neatly",
    },
  },
  q5: {
    title: "The plan you made together has hit a small snag.",
    options: {
      "0": "First look after the friend who seems flustered",
      "1": "Find the information you need and work out the cause",
      "2": "Take a breath now that an unexpected pause has opened up",
      "3": "Rearrange the schedule into an order that will work",
    },
  },
  q6: {
    title: "If you could make one postcard about anything...",
    options: {
      "0": "Draw something you imagined today",
      "1": "Write the one thing you really want to say",
      "2": "Write in big letters what you could do together next time",
      "3": "Collect a little message from everyone",
    },
  },
  q7: {
    title: "A friend tells you what is troubling them.",
    options: {
      "0": "Find one small way to help right now",
      "1": "Use a different metaphor to see the situation in a new way",
      "2": "Suggest going outside together for some fresh air",
      "3": "Look for common ground between different opinions",
    },
  },
  q8: {
    title: "You are starting a new hobby.",
    options: {
      "0": "First learn how it works and which tools you need",
      "1": "First decide how you want to do it",
      "2": "Learn slowly, without putting pressure on yourself",
      "3": "Set aside a time that you can stick to regularly",
    },
  },
  q9: {
    title: "You open the menu with a friend. What comes to mind first?",
    options: {
      "0": "What would the friend sharing this with me enjoy?",
      "1": "Shall we take our time and choose something to suit today's mood?",
      "2": "What would that unfamiliar combination taste like?",
      "3": "Shall I start with what matters most to my own taste?",
    },
  },
  q10: {
    title: "Which texture would you most welcome in the first bite?",
    options: {
      soft: "A fluffy, soft soufflé",
      cold: "Cold bingsu that gently melts away",
      mixed: "A combination of different textures in one bite",
      any: "I am happy with a different texture each day",
    },
  },
  q11: {
    title: "Which dessert flavor appeals to you most today?",
    options: {
      fruit: "Fruit flavors such as strawberry, peach, or mango",
      sesame: "The nutty flavor of black sesame",
      coffee: "The flavor of coffee",
      cocoa: "The flavor of cocoa",
      "cream-caramel": "Cream and caramel together",
      any: "Any of these sounds good",
    },
  },
  q12: {
    title: "How do you most like to enjoy a bite of dessert?",
    options: {
      focus: "Fully savoring one flavor you love",
      "fruit-cream": "Fruit and cream together in one bite",
      contrast: "Enjoying the contrast between soufflé and its toppings",
      combine: "Mixing a little of each accompaniment to make your own combination",
      any: "However I feel like eating it—anything goes",
    },
  },
};

type EnglishCharacter = {
  name: string;
  menu: string;
  quote: string;
  story: string;
  traits: string[];
  quirk: string;
  features: string[];
  tie: string;
  pairStory: string;
  category: string;
  scene: string;
  action: string;
  appearance: string;
  alt: string;
};

export const englishCharacters: Record<DessertId, EnglishCharacter> = {
  S: {
    name: "Strawberry Class Captain",
    menu: "Strawberry Soufflé",
    quote: "Everyone has a place with us, right?",
    story: "You notice the smallest changes in expression and step in when something needs doing. Like carefully arranging each strawberry, you are a warm friend who looks after the feelings around you.",
    traits: ["You never miss a little change", "You reach out first to someone on your mind", "You love moments when everyone feels at ease"],
    quirk: "You sometimes choose your own seat last while looking after everyone else.",
    features: ["A round soufflé covered in cream", "Strawberry decorations, herbs, and red crumbs", "Strawberry pieces arranged around the plate"],
    tie: "Looking around and caring for others first",
    pairStory: "One of you takes care of the place, while the other fills it with stories.",
    category: "Seasonal Menu",
    scene: "An afternoon tending the strawberry seats",
    action: "A little captain sits on the edge of a soufflé, neatly tending the strawberries. Whoever arrives, there is always a comfortable place ready for them.",
    appearance: "A round coral-colored body, petal-like ears, and a green neckerchief",
    alt: "A little coral-colored character arranging strawberries on a strawberry soufflé",
  },
  P: {
    name: "Peach Daydreamer",
    menu: "Peach Soufflé",
    quote: "Not just any afternoon—an afternoon like a movie.",
    story: "You give familiar scenes new titles. Like a scene imagined while lying on a peach-covered hill, you remember ordinary days in your own special way.",
    traits: ["You weave stories into little scenes", "You enjoy looking from a different perspective", "You remember atmospheres that stay with you"],
    quirk: "With so many scenes coming to mind, your story can wander off on a little detour.",
    features: ["A round soufflé with a dusted top", "Thin peach slices arranged like a fan", "A scoop of ice cream on the side"],
    tie: "Imagining a new scene",
    pairStory: "Together, you bring an imagined little scene to life through thoughtful actions.",
    category: "Seasonal Menu",
    scene: "A daydream on a peach-covered hill",
    action: "A daydreamer lies back on a fluffy soufflé as if it were a bed. Among the peach slices, today's imaginings unfold at their own gentle pace.",
    appearance: "A soft pale-purple body, drooping ears, and a relaxed expression",
    alt: "A little pale-purple character resting comfortably on a peach soufflé with peaches and ice cream",
  },
  D: {
    name: "Dubai Explorer Captain",
    menu: "Dubai Soufflé",
    quote: "Wait, how does this work?",
    story: "When you encounter something new, you want to know the reason behind it. A small investigation into a single topping can become the joy of your day.",
    traits: ["You take another look at things that make you curious", "You enjoy learning how things work", "You find fun in even the smallest differences"],
    quirk: "Once something captures your curiosity, you can lose track of time.",
    features: ["A round top covered in cocoa", "A small green topping in the center", "A light-colored lower layer and ice cream on the side"],
    tie: "Finding out what makes you curious",
    pairStory: "You gather discoveries one by one and get the next experiment ready.",
    category: "Soufflé",
    scene: "A little discovery on a cocoa hill",
    action: "An explorer captain examines a green topping with a magnifying glass. Even a tiny difference everyone else has passed by is worth stopping for.",
    appearance: "A plump light-green body, pointed ears, and a curled tail",
    alt: "A little light-green character examining the green topping on a Dubai soufflé with a magnifying glass",
  },
  C: {
    name: "Brûlée True-to-Me",
    menu: "Crème Brûlée Soufflé",
    quote: "Gentle words, a clear sense of what matters to me.",
    story: "You listen to different views and calmly express the choices that matter to you. Like settling comfortably on a golden hill, you hold on to your own standards with warmth.",
    traits: ["You know why you like what you like", "You speak honestly about important choices", "You respect what matters to others, too"],
    quirk: "You sometimes say it is fine before mentioning an important condition a little later.",
    features: ["White cream flowing over the soufflé", "A golden caramel surface and a small herb", "A rounded line of sauce on the plate"],
    tie: "Calmly expressing what matters to you",
    pairStory: "You listen to each other's standards and find a place where they meet.",
    category: "Soufflé",
    scene: "A place to be yourself on a golden hill",
    action: "A quietly confident friend in a green scarf sits tall on a golden soufflé. Resting on a little spoon, they comfortably hold their own place.",
    appearance: "A broad cream-colored body, small round ears, and a dark-green scarf",
    alt: "A cream-colored character sitting on a crème brûlée soufflé with a little spoon for support",
  },
  B: {
    name: "Black Sesame Pause",
    menu: "Black Sesame Bingsu",
    quote: "No rush. Go on, I am listening.",
    story: "You do not rush to fill an empty moment, and you wait until a story has been told. Like resting against the edge of a bowl, you help the people beside you feel comfortable moving at their own pace.",
    traits: ["You value time spent listening more than rushing to answer", "You feel at ease in quiet moments", "You give everyone time to move at their own pace"],
    quirk: "Wanting a little more rest can make you slow to set off.",
    features: ["A gray base and black powder in a low bowl", "A dried topping on the right", "A scoop, orange decoration, herbs, and light-colored powder"],
    tie: "Taking time to listen and rest",
    pairStory: "You share the job of deciding when to start a walk and where to pause along the way.",
    category: "Bingsu",
    scene: "A slow rest by the edge of the bowl",
    action: "A little pause leans against a black sesame bingsu bowl with eyes closed. Even that long tail is set down for a moment with no need to hurry.",
    appearance: "A round charcoal-colored body, a light belly, and a long fluffy tail",
    alt: "A little charcoal-colored character with a long tail resting against the edge of a black sesame bingsu bowl",
  },
  M: {
    name: "Mango Let's-Go Captain",
    menu: "Mango Bingsu",
    quote: "Sounds good—let's give it a go!",
    story: "When a good idea appears, you turn it into a small first action. Like stepping boldly onto a mango-covered hill, you are the first to discover the excitement of a new moment.",
    traits: ["You love the excitement of getting started", "You casually suggest a new path", "You turn ideas into little actions"],
    quirk: "You are quick to set off, but sometimes check your supplies a little late.",
    features: ["Mango fanning out in three directions across the bowl", "Thin, overlapping fruit slices", "A branch-like herb in the center"],
    tie: "Getting started and giving it a try",
    pairStory: "You explore a new path and discover places to rest together along the way.",
    category: "Bingsu",
    scene: "A first step on a mango hill",
    action: "A captain strides onto a mango slice with an orange neckerchief flying behind. If a path looks fun, they are the first to reach for it.",
    appearance: "A yellow teardrop-shaped body, ears swept back, and an orange neckerchief",
    alt: "A little yellow character excitedly taking a step onto the fruit slices of a mango bingsu",
  },
  L: {
    name: "Lotus Routine Keeper",
    menu: "Lotus Coffee Bingsu",
    quote: "A little order today, for tomorrow's me.",
    story: "Small routines and familiar habits make your day more comfortable. Even the simple act of lining up two spoons gives tomorrow a little breathing room.",
    traits: ["You enjoy the breathing room that a little preparation brings", "You put things in order for next time", "You keep up the habits that have worked well"],
    quirk: "When your usual order changes, you sometimes want a moment to rearrange it.",
    features: ["A base of brown biscuit crumbs", "A white scoop, brown sauce, and an upright biscuit", "A small coffee pitcher on the side"],
    tie: "Making a few small preparations",
    pairStory: "You give new discoveries an order that helps them carry on for longer.",
    category: "Bingsu",
    scene: "A little preparation by the biscuit house",
    action: "A routine keeper lines up two spoons beside a coffee pitcher. A few small preparations for the next moment make room to relax.",
    appearance: "A plump caramel-colored body, small round ears, and a calm expression",
    alt: "A little caramel-colored character arranging spoons beside a Lotus coffee bingsu and coffee pitcher",
  },
  T: {
    name: "Tiramisu Together",
    menu: "Cocoa Tiramisu Balls",
    quote: "We are all different, and being together makes it fun.",
    story: "You find ways to come together even when you do not all like the same things. Like opening both arms between cocoa balls, you warmly connect everyone's different places.",
    traits: ["You easily find what people have in common", "You enjoy bringing different ideas together", "You think about ways for everyone to join in"],
    quirk: "Gathering everyone's opinions can sometimes make decisions take a little longer.",
    features: ["Three balls coated in cocoa powder", "White cream and a leaf decoration on the side", "A square plate with rounded corners"],
    tie: "Finding where people connect",
    pairStory: "You listen to what matters to each person and gather around one table.",
    category: "Dessert",
    scene: "A gathering among the cocoa balls",
    action: "A little friend sits between tiramisu balls with both arms wide open. They love little gatherings that bring different places together.",
    appearance: "A rosy teardrop-shaped body, ears stretching sideways, and open arms",
    alt: "A little rosy character with open arms on a square plate with three cocoa tiramisu balls and cream",
  },
};

type EnglishSituation = { situation: string; setting: string; title: string; description: string; alt: string };

export const englishSituations: Record<DessertId, EnglishSituation[]> = {
  S: [
    {
      situation: "Getting ready to meet a friend",
      setting: "A sunny living room · Morning",
      title: "Your seat before mine",
      description: "As soon as a friend arrives, you offer the softest cushion. You beam as they choose a comfortable spot—then realize you have not picked a seat for yourself yet.",
      alt: "Strawberry Class Captain beaming while offering Peach Daydreamer a cushion in a sunny living room",
    },
    {
      situation: "When it suddenly rains",
      setting: "A rainy alley · Evening",
      title: "The umbrella goes your way first",
      description: "When your friend huddles against the rain, you tilt the umbrella toward them first. Only after they move closer in relief do you notice that your own ear is a little wet.",
      alt: "Strawberry Class Captain tilting an umbrella toward Peach Daydreamer and putting an arm around them in a rainy evening alley",
    },
    {
      situation: "When a friend is feeling low",
      setting: "A bus stop · Night",
      title: "A little care before words",
      description: "You crouch beside your downhearted friend and offer a handkerchief. Without rushing them to answer, you pat their shoulder, and little by little they lift their head.",
      alt: "Strawberry Class Captain offering a handkerchief and patting a downhearted Peach Daydreamer's shoulder at a bus stop at night",
    },
    {
      situation: "Taking a break on your own",
      setting: "A hammock on the veranda · Sunset",
      title: "Today, I look after myself too",
      description: "Today, you save the softest spot for yourself. Hugging a cushion and stretching out, you feel your usually busy heart begin to unwind.",
      alt: "Strawberry Class Captain smiling in a sunset-lit veranda hammock, hugging a cushion with legs stretched out",
    },
  ],
  P: [
    {
      situation: "Getting ready to meet a friend",
      setting: "A tram stop · Dusk",
      title: "A movie before we even meet",
      description: "You love the sky you sketched while waiting. When your friend arrives, you hold up your sketchbook and excitedly talk about what kind of day this could become.",
      alt: "An excited Peach Daydreamer showing Strawberry Class Captain a sunset sketch at a tram stop at dusk",
    },
    {
      situation: "When it suddenly rains",
      setting: "A rainy entrance · Afternoon",
      title: "Give the rainy day a new title",
      description: "Your walk is postponed, but the sky is reflected in a puddle. You take your friend's hand and point to the sparkling ripples, turning a disappointing afternoon into a little game.",
      alt: "Peach Daydreamer holding Strawberry Class Captain's hand and pointing to reflections and ripples in a puddle by a rainy entrance",
    },
    {
      situation: "When a friend shares a worry",
      setting: "A studio by the window · Late evening",
      title: "What if we looked from another angle?",
      description: "Your friend sighs over a drawing that is not coming together. You turn the sketchbook to show another composition, and curiosity returns to their furrowed face.",
      alt: "Peach Daydreamer turning a sketchbook for a surprised Strawberry Class Captain in a studio late in the evening",
    },
    {
      situation: "Taking a break on your own",
      setting: "A starry rooftop · Midnight",
      title: "Body here, imagination far away",
      description: "Lying on a rooftop, you connect the stars one by one. Lost in a story made of tiny lights, you find that the night you meant to rest in has already grown late.",
      alt: "Peach Daydreamer lying on a rooftop blanket at midnight, pointing at the stars in wonder",
    },
  ],
  D: [
    {
      situation: "Getting ready to meet a friend",
      setting: "A subway entrance · Morning",
      title: "A little exploration before we leave",
      description: "You first check the map for the quickest route. As you trace the way with your friend, you discover an interesting place too, giving you more to talk about before you even set off.",
      alt: "Dubai Explorer Captain and Lotus Routine Keeper opening a map and tracing a route at a subway entrance in the morning",
    },
    {
      situation: "When plans go off track",
      setting: "A woodworking studio · Around sunset",
      title: "Wait, where did it get tangled?",
      description: "When a cart wheel stops, you first inspect what has gone wrong. While your friend holds the wheel, you repair its axle, then check together that it turns again.",
      alt: "Dubai Explorer Captain repairing a cart wheel's axle while Lotus Routine Keeper holds it in a sunset-lit woodworking studio",
    },
    {
      situation: "When a friend shares a worry",
      setting: "A neighborhood study room · Early evening",
      title: "Break the problem into little pieces",
      description: "Your friend feels overwhelmed by a pile of work. After listening, you divide the tasks into three groups and choose together where to begin.",
      alt: "Dubai Explorer Captain dividing books into three groups and pointing out a starting point beside a tired Lotus Routine Keeper in a study room in the early evening",
    },
    {
      situation: "Taking a break on your own",
      setting: "A dewy forest path · Dawn",
      title: "One discovery, even while resting",
      description: "A little ladybug on a leaf catches your eye. Following its movements through a magnifying glass, you bring home a new discovery even from a break.",
      alt: "Dubai Explorer Captain marveling at a ladybug on a leaf through a magnifying glass on a forest path at dawn",
    },
  ],
  C: [
    {
      situation: "Getting ready to meet a friend",
      setting: "A park pavilion · Midday",
      title: "Be honest about your favorite seat",
      description: "When the sun is strong, you say you would prefer the shade. Your friend nods and moves a chair, so a comfortable meeting begins without either of you having to pretend everything is fine.",
      alt: "Brûlée True-to-Me pointing toward a shaded seat as Tiramisu Together moves a chair in a park pavilion at midday",
    },
    {
      situation: "When plans go off track",
      setting: "Beside an outdoor performance venue · Night",
      title: "Plans can change; my standards remain",
      description: "When a noisy place feels uncomfortable, you suggest somewhere quiet. Taking your friend's hand, you move to a bench on the side and protect your comfort even as the plan changes.",
      alt: "Brûlée True-to-Me covering one ear while guiding Tiramisu Together to a quiet bench beside an outdoor performance venue at night",
    },
    {
      situation: "When a friend shares a worry",
      setting: "A veranda at home · Evening",
      title: "Your choice and my thoughts both matter",
      description: "Even when you disagree, you listen to your friend's whole story. With a hand on your chest, you honestly share your thoughts while leaving the final choice to them.",
      alt: "Brûlée True-to-Me sharing a thought with a hand on their chest as Tiramisu Together nods on a veranda in the evening",
    },
    {
      situation: "Taking a break on your own",
      setting: "A little library · Afternoon",
      title: "What I love, before what is popular",
      description: "You open a book you have always loved once again. Resting a fingertip on a favorite passage and smiling, you fill the time with something good that needs no explanation to anyone else.",
      alt: "Brûlée True-to-Me pointing to a favorite passage in a book and smiling with eyes closed in a library in the afternoon",
    },
  ],
  B: [
    {
      situation: "Getting ready to meet a friend",
      setting: "A train platform · Early morning",
      title: "Even when I arrive first, there is no rush",
      description: "Your late friend arrives out of breath. You reach out as if to say it is all right and point to the seat beside you, giving your hurried friend a moment to breathe.",
      alt: "Black Sesame Pause offering the next seat to Mango Let's-Go Captain, who has hurried to an early-morning train station",
    },
    {
      situation: "When it suddenly rains",
      setting: "A hillside shelter · A rainy evening",
      title: "Then let's rest here for a moment",
      description: "When your rain-soaked friend grumbles, you suggest sitting down for a while. A pat on the shoulder and a dry place to sit help those drooping ears gradually relax.",
      alt: "Black Sesame Pause patting a wet Mango Let's-Go Captain's shoulder and leading them toward a dry bench in a hillside shelter on a rainy evening",
    },
    {
      situation: "When a friend shares a worry",
      setting: "An attic sofa · Night",
      title: "A place to be heard to the very end",
      description: "When your friend stops speaking, you do not rush to ask another question. You wait beside them with an arm around their shoulders, and the story they have been holding in slowly begins to flow again.",
      alt: "Black Sesame Pause listening with an arm around a tearful Mango Let's-Go Captain on an attic sofa at night",
    },
    {
      situation: "Taking a break on your own",
      setting: "A log in the forest · Afternoon",
      title: "It is all right to do nothing",
      description: "Leaning against a log, you hug your long tail. A big yawn and closed eyes let your tasks drift away for a while—though sometimes it feels so comfortable that you set off a little late.",
      alt: "Black Sesame Pause lying on a forest log in the afternoon, hugging a long tail and yawning widely",
    },
  ],
  M: [
    {
      situation: "Getting ready to meet a friend",
      setting: "The entrance at home · Morning",
      title: "All right, I will head out first!",
      description: "Your bag is still open, but you are already out the door. Even as you take the map your friend offers, your step is full of excitement. It is a departure where your friend gives those forgotten preparations one more check.",
      alt: "Mango Let's-Go Captain excitedly rushing out of the entrance in the morning and accepting a map from Black Sesame Pause",
    },
    {
      situation: "When plans go off track",
      setting: "A blocked forest path · A cloudy day",
      title: "Another path could be fun too!",
      description: "When the bridge you meant to cross is blocked, you first look for a safe path nearby. You smile and point it out to your friend, putting a little energy back into their hesitant steps.",
      alt: "Mango Let's-Go Captain pointing out a safe forest detour beside a blocked bridge as Black Sesame Pause looks along it on a cloudy day",
    },
    {
      situation: "When a friend is feeling low",
      setting: "A neighborhood park · A cloudy afternoon",
      title: "Want to take just one step with me?",
      description: "You offer your downhearted friend a hand and suggest a short walk. When they take your hand and stand up, you match their pace and share the very first step.",
      alt: "Mango Let's-Go Captain holding Black Sesame Pause's hand and waiting for their first step beside a park bench on a cloudy afternoon",
    },
    {
      situation: "Taking a break on your own",
      setting: "A windy field · Midday",
      title: "A break turns into a new hobby",
      description: "You launch a kite you made, and the wind suddenly tugs hard. Surprise makes you lean back, but you soon break into a wide smile. Trying something new becomes your day-off game.",
      alt: "Mango Let's-Go Captain leaning backward as a kite string pulls, laughing excitedly in a windy field at midday",
    },
  ],
  L: [
    {
      situation: "Getting ready to meet a friend",
      setting: "A room with a desk · Morning",
      title: "A little preparation makes room to relax",
      description: "Packing a notebook and pencils in your bag puts your mind at ease. When your friend arrives, you confidently show the place you have prepared and get ready for an unhurried start.",
      alt: "Lotus Routine Keeper showing Dubai Explorer Captain a neatly prepared notebook and bag in a room in the morning",
    },
    {
      situation: "When plans go off track",
      setting: "A busy train station · Late afternoon",
      title: "Put the new order back together",
      description: "Missing the train you planned to catch leaves you briefly flustered. You reopen the map with your friend, trace the next possible route, and rearrange the order of your changed day.",
      alt: "A flustered Lotus Routine Keeper reopening a map with Dubai Explorer Captain at a train station in the late afternoon",
    },
    {
      situation: "When a friend shares a worry",
      setting: "A neighborhood workspace · Evening",
      title: "Start with one little box for today",
      description: "Beside a friend who has stopped in front of a pile of books, you choose the one book to look at today. Putting it in the bag together and pointing to the first box makes a big task feel a little smaller.",
      alt: "Lotus Routine Keeper choosing one book with Dubai Explorer Captain and putting it in a bag in a workspace in the evening",
    },
    {
      situation: "Taking a break on your own",
      setting: "A bedroom · Late night",
      title: "A little gift for tomorrow's me",
      description: "You fold a blanket neatly and leave tomorrow's bag nearby. You may be yawning, but one look at the prepared room helps you settle into bed with an easy mind.",
      alt: "A sleepy Lotus Routine Keeper yawning widely while folding a blanket in a bedroom late at night",
    },
  ],
  T: [
    {
      situation: "Getting ready to meet a friend",
      setting: "An outdoor terrace · Early evening",
      title: "Different tastes, one table",
      description: "You choose a comfortable cushion for each friend. Drawing the chairs together so everyone can face one another, you bring all their different preferences into one gathering.",
      alt: "Tiramisu Together arranging chairs in a circle for Brûlée True-to-Me and Strawberry Class Captain on a terrace in the early evening",
    },
    {
      situation: "When plans go off track",
      setting: "A seaside pavilion · A rainy afternoon",
      title: "Then shall we gather over here?",
      description: "When it rains, you move under a roof. Holding the corners of a blanket with your friends, you spread out a new spot, and the gathering continues even in a different place.",
      alt: "Tiramisu Together spreading a blanket with Brûlée True-to-Me and Strawberry Class Captain in a seaside pavilion on a rainy afternoon",
    },
    {
      situation: "When a friend shares a worry",
      setting: "A gathering room · Night",
      title: "Different voices, still our story",
      description: "When two friends disagree, you sit between them and listen. You make space for them to face each other and keep their words moving, helping those tight expressions gradually soften.",
      alt: "Tiramisu Together keeping a conversation going with hands on the shoulders of Brûlée True-to-Me and Mango Let's-Go Captain, who disagree, in a gathering room at night",
    },
    {
      situation: "Taking a break on your own",
      setting: "A little attic · Late night",
      title: "A happy gathering on one page",
      description: "You draw the moments when everyone laughed together in your notebook. Remembering your friends makes you smile to yourself, and you save another page for things you could try together next time.",
      alt: "Tiramisu Together hugging a notebook filled with drawings of friends, smiling with eyes closed in an attic late at night",
    },
  ],
};

type EnglishMenuProfile = {
  bridge: string;
  tags: string[];
  reasons: Record<TasteDimension, string>;
};

export const englishMenuProfiles: Record<DessertId, EnglishMenuProfile> = {
  S: {
    tags: ["Fluffy soufflé", "Strawberries and cream"],
    bridge: "A caring captain who makes sure strawberries and cream are shared all around. A friend's empty plate catches your eye before your own next bite.",
    reasons: {
      texture: "Enjoy a soft bite of fluffy soufflé.",
      flavor: "Add strawberries and enjoy their fruit flavor.",
      enjoyment: "Enjoy strawberries and cream together on the soufflé.",
    },
  },
  P: {
    tags: ["Fluffy soufflé", "Peach flavor"],
    bridge: "Lean back on a fluffy soufflé and drift into a peach-colored daydream. You prefer to take your time and linger over the moments you love.",
    reasons: {
      texture: "Enjoy a soft bite of fluffy soufflé.",
      flavor: "Add peaches and enjoy their fruit flavor.",
      enjoyment: "Enjoy peaches and accompaniments together on the soufflé.",
    },
  },
  D: {
    tags: ["Soufflé and kataifi", "Cocoa flavor"],
    bridge: "A bite of soufflé, a bite of kataifi—when something makes you curious, you have to taste it yourself. Your eyes light up when you discover a new combination.",
    reasons: {
      texture: "Pair fluffy soufflé with kataifi.",
      flavor: "Taste a bite of cocoa-coated soufflé.",
      enjoyment: "Taste the soufflé and kataifi separately and together.",
    },
  },
  C: {
    tags: ["Soft cream", "Golden caramel"],
    bridge: "Your words may be as soft as cream, but you know what you like. Enjoy a bite of caramel-topped soufflé your own way.",
    reasons: {
      texture: "Pair fluffy soufflé with soft cream.",
      flavor: "Enjoy cream and caramel in one bite.",
      enjoyment: "Pair the soufflé with cream and caramel.",
    },
  },
  B: {
    tags: ["Cold bingsu", "Black sesame flavor"],
    bridge: "Pause over a spoonful of nutty black sesame. A friend who eats slowly, smiles leisurely, and never knows the need to hurry.",
    reasons: {
      texture: "Enjoy a refreshing spoonful of cold bingsu.",
      flavor: "Savor the nutty flavor of black sesame.",
      enjoyment: "Enjoy black sesame bingsu slowly, one spoonful at a time.",
    },
  },
  M: {
    tags: ["Cold bingsu", "Mango flavor"],
    bridge: "Excitement from the very first spoonful! When mango comes into view, this friend steps forward first without hesitation.",
    reasons: {
      texture: "Enjoy a refreshing spoonful of cold bingsu.",
      flavor: "Add mango and enjoy its fruit flavor.",
      enjoyment: "Enjoy the bingsu with pieces of mango.",
    },
  },
  L: {
    tags: ["Cold bingsu", "Coffee and biscuits"],
    bridge: "Set out a biscuit and add some coffee, and your own little moment begins. You enjoy your favorite combination in a familiar order.",
    reasons: {
      texture: "Pair cold bingsu with a biscuit.",
      flavor: "Add a Lotus biscuit to the flavor of coffee.",
      enjoyment: "Enjoy coffee and biscuits a little at a time.",
    },
  },
  T: {
    tags: ["Cocoa flavor", "Cream on the side"],
    bridge: "Like pairing cocoa balls with cream, you bring different charms into one place. You are good at finding the moments that are more fun together.",
    reasons: {
      texture: "Enjoy a bite of cocoa balls with cream.",
      flavor: "Taste cocoa-coated tiramisu balls.",
      enjoyment: "Enjoy cocoa balls with a little cream at a time.",
    },
  },
};

const combinations: Record<DessertId, string> = {
  S: "Soufflé with strawberries and cream",
  P: "Soufflé with peaches",
  D: "Soufflé with kataifi",
  C: "Soufflé with cream and caramel",
  B: "Bingsu with black sesame toppings",
  M: "Bingsu with mango pieces",
  L: "Bingsu with biscuits",
  T: "Cocoa balls with cream",
};

const flavors: Record<DessertId, string> = {
  S: "strawberry", P: "peach", D: "cocoa", C: "caramel", B: "black sesame", M: "mango", L: "coffee", T: "cocoa",
};

export function englishTasteReasons(id: DessertId, dimension: TasteDimension, answer: string): string {
  if (dimension === "enjoyment") {
    if (answer === "focus") return `Slowly savor the flavor of ${flavors[id]}.`;
    if (answer === "combine") return `${combinations[id]}—mix a little at a time to enjoy them your own way.`;
    if (answer === "contrast") return `${combinations[id]}—taste them separately and together.`;
  }
  if (dimension === "texture" && answer === "mixed") return `${combinations[id]}—enjoy several textures in one bite.`;
  return englishMenuProfiles[id].reasons[dimension];
}
