/**
 * MindReader.exe — English Banter & Comedy Database
 * Features witty, hilarious observational comedy across 13 facial expressions,
 * context-independent killer transition lines, internal telepathic thoughts,
 * and adaptive comedic style prefixes.
 */

export const JOKES = {
  // 😄 Happy
  happy: [
    "That smile contains classified information.",
    "Someone is suspiciously happy. I do not trust this development.",
    "The smile has been detected. Something dangerous just happened.",
    "You know something the rest of us don't.",
    "Smiling at a laptop screen? Either you fixed the bug or you gave up completely.",
    "A rare sighting of human joy. Let's document this before reality strikes.",
    "Dopamine levels rising. Expecting a crash in approximately four minutes.",
    "Warning: excessive happiness detected in a software environment.",
    "Whatever just happened, you look like you just won the lottery.",
    "That grin is doing 90% of the emotional lifting today.",
    "Can't hide that happiness, can you?",
    "That is a dangerously bright face for this hour.",
    "Did someone just text you, or did your code actually compile?",
    "Suspicious cheerfulness logged in system archives.",
    "Keep smiling like that and people are going to start asking questions.",
    "I haven't seen a human smile like that since weekend started.",
  ],

  // 😂 Laughing (Friend-group banter)
  laughing: [
    "What is so funny? Show the class!",
    "Okay, calm down! The cheeks are working overtime.",
    "Uncontrollable giggles detected. Did someone make a pun or did code fail funny?",
    "Laughter containment protocol has officially breached aisle four.",
    "You're laughing so hard I'm starting to laugh too.",
    "Did you just remember an old inside joke from three years ago?",
    "System alert: human laughter approaching comedic overload.",
    "Finish laughing first, then tell me what happened.",
    "Someone is having way too much fun for someone with unfinished tasks.",
    "Cheek muscles at 100% capacity. Please maintain structural facial integrity.",
    "That laugh is doing heavy lifting for your mental stability.",
    "Are you alone in the room laughing at your monitor? Peak comedy.",
    "That was pure, unfiltered silliness.",
    "Warning: stomach cramps imminent if giggling continues.",
    "Okay, take a breath. Resetting laughter counter.",
  ],

  // 🧐 Concentration (Teasing serious work vibe)
  concentrating: [
    "What are you staring at so intensely? Is that code or a sacred text?",
    "Looks like someone is solving quantum physics over there.",
    "Do not disturb: human is in extreme deep-work mode.",
    "Are you going to finish that task or move into that screen permanently?",
    "The laser stare is real. If looks could compile, this project would be done.",
    "Forehead wrinkles indicate intense computational load.",
    "Important mental calculation underway: deciding what to eat for lunch.",
    "Concentration level: 99%. The rest of the universe has ceased to exist.",
    "Relax your eyebrows a little... it's not a final exam.",
    "The gaze is piercing right through the pixels.",
    "High-focus tunnel vision detected. Do not approach without coffee.",
    "Single-threaded CPU mode engaged. Background audio muted.",
    "Hold that thought... the brain gears are turning at 5000 RPM.",
  ],

  // 😨 Fear (Teasing scared reaction)
  fearful: [
    "Whoa, what did you just see?!",
    "Did you just run DROP DATABASE in production?",
    "Eyes wide, pupils dilated. Did a surprise deadline just jump out?",
    "Looks like you just encountered a ghost in the terminal.",
    "Pure fight-or-flight energy radiating from the face.",
    "Take a breath! It's probably only a minor catastrophe.",
    "Did you accidentally hit 'Reply All' to the whole company?",
    "The face of someone who just realized what they agreed to.",
    "Heart rate estimated at 180 BPM. Evacuate the desk area.",
    "Panic levels rising. Don't worry, I won't tell anyone you screamed internally.",
    "Whatever you just remembered, it was definitely due yesterday.",
    "High alert mode! The face is preparing to flee the scene.",
  ],

  // 😔 Sad (Gentle teasing + concern)
  sad: [
    "Hey... what happened? Who hurt you?",
    "Emotional damage detected. Deploying absolutely no helpful solutions.",
    "The face says sadness. The git commit log probably explains why.",
    "Initiating dramatic background cello music... internally.",
    "That is the face of someone who just realized tomorrow is Monday.",
    "The facial muscles have surrendered to gravity and despair.",
    "A moment of silence for whatever just went wrong on that screen.",
    "Why so glum, friend? Shake it off, it's just pixels.",
    "Melancholy index: 94%. We recommend snacks and closing unnecessary tabs.",
    "Even your posture looks sad. Give us a smile!",
    "It's going to be okay. Computers are terrible anyway.",
  ],

  // 🤨 Confused (Puzzled, comical)
  confused: [
    "Brain.exe has stopped responding. Would you like to restart the human?",
    "You are looking at that screen like it personally betrayed your ancestors.",
    "Did you understand any of that? Because I certainly didn't.",
    "That eyebrow tilt is doing 90% of the thinking right now.",
    "Staring at the code like it's written in ancient Mesopotamian cuneiform.",
    "Cognitive buffer underflow. The gears are turning, but nothing is connected.",
    "The screen is not confused. Only you are.",
    "Your face is literally a living question mark right now.",
    "Processing... processing... still processing... no comprehension found.",
    "Did the logic just do a backflip? You look totally lost.",
    "One eyebrow up, one down. Classic puzzled detective face.",
    "Take another look. The answer won't jump out and bite you.",
  ],

  // 😲 Surprised (Shock & awe)
  surprised: [
    "Whoa! What was THAT?!",
    "Plot twist detected! The universe has delivered the unexpected.",
    "The eyebrows have officially launched into low Earth orbit.",
    "Jaw dropped. Did your code actually compile on the very first try?",
    "Sudden reality shockwave registered across all facial sectors.",
    "Eyes wide. Pupil expansion confirms pure, unfiltered disbelief.",
    "Whatever just popped up on your screen, I hope you didn't click accept.",
    "That was definitely, undeniably not in the script.",
    "Close your mouth before a bug flies in!",
    "Shock level: 100%. The consequences are still loading.",
    "Can you repeat that face? That was an award-winning reaction.",
  ],

  // 🤔 Thinking (Contemplation, remembering)
  thinking: [
    "What are you pondering so deeply?",
    "Big executive meeting happening inside that skull right now.",
    "Thinking hard or hardly thinking? Hard to tell from here.",
    "Did you remember where you left your keys, or is that a philosophical dilemma?",
    "The gears are turning. Smoke should start coming out any second.",
    "Calculating life choices... please do not interrupt the algorithm.",
    "That head tilt means a critical decision is hanging in the balance.",
    "Are we overthinking this, or is this genuine brilliance?",
    "Looking up into the ceiling for answers. Did you find any up there?",
    "Brain department running at maximum capacity.",
    "Take your time. We've got all day to wait for that conclusion.",
  ],

  // 😐 Neutral (Continuous baseline)
  neutral: [
    "Face: perfectly neutral. Brain: absolute, unadulterated chaos.",
    "No emotional activity detected. Highly suspicious.",
    "The face is calm. The 47 background anxiety threads are not.",
    "Poker face detected. What disaster are you hiding behind those eyes?",
    "Default human state loaded. Waiting for external stimuli.",
    "Zero facial expression. Either deep meditation or total mental dissociation.",
    "Running baseline idle animations. Human CPU load at 12%.",
    "Completely serene. I'm keeping my eye on you anyway.",
    "Standing by. Let's see some emotion, human.",
    "Not a single muscle moving. Are you a statue or a programmer?",
  ],

  // 😠 Angry
  angry: [
    "Uh oh. Someone has chosen violence today.",
    "Anger level increasing. I strongly recommend closing the laptop before it flies.",
    "The compiler has successfully ruined another promising human day.",
    "One more minor error and the keyboard is going through drywall.",
    "Facial sensors indicate high probability of drafting a passive-aggressive email.",
    "ABORT MISSION. The user has officially entered boss fight mode.",
  ],

  // 😴 Sleepy
  sleepy: [
    "The eyelids are currently negotiating terms of surrender with gravity.",
    "Productivity has officially left the chat, packed its bags, and moved to Spain.",
    "System entering low-power hibernation mode. Do not unplug human.",
    "Yawn frequency approaching supersonic levels.",
    "Caffeine deficit detected. Brain running on 2% reserve battery.",
  ],

  // 🥱 Bored
  bored: [
    "Boredom detected. Even your facial muscles are looking for another tab.",
    "You have been staring at this screen since the dawn of the Jurassic period.",
    "The brain is currently on paid administrative leave.",
    "Current stimulation level: dial-up connection in 1996.",
  ],

  // 🤢 Disgusted
  disgusted: [
    "Physical rejection of the surroundings detected.",
    "Whoever wrote what you're looking at owes your eyes an apology.",
    "Nose curled. That is the universal face for 'ew, absolutely not'.",
    "Tasteful disgust registered. We support your harsh aesthetic standards.",
  ],
};

// 🧨 Context-independent killer lines (Injected during emotional transitions & random moments)
export const KILLER_LINES = [
  "Everything you're thinking is written all over your face.",
  "Control your face, friend. You're giving away all the secrets.",
  "I'm going to pretend I didn't see that reaction.",
  "I didn't say a word. Your face did all the talking.",
  "Hmm... yeah, that makes total sense.",
  "Your face is actively betraying you right now.",
  "Now that was an award-winning reaction.",
  "I saw that coming from a mile away.",
  "Whatever you do, don't look at the camera with that expression.",
  "Your face is telling a completely different story than your words.",
  "Nothing gets past this camera. Absolutely nothing.",
  "Your eyebrows are having their own independent conversation.",
  "Try to act natural... well, more natural than that.",
  "That expression was priceless. Let me file that in the records.",
  "You can't fool the optical sensors, buddy.",
];

// First-person fictional internal thoughts for "Mind Reading Mode"
export const INTERNAL_THOUGHTS = {
  happy: [
    "“I just remembered there are leftover snacks waiting for me in the kitchen.”",
    "“If I don't look at my bank account, today has actually been pretty great.”",
    "“I have no idea why it worked, but I am taking full credit anyway.”",
    "“Everything is awesome and I refuse to let reality ruin this 30-second window.”",
  ],
  laughing: [
    "“I shouldn't be laughing at this, which makes it 400% funnier.”",
    "“If someone asks why I am giggling at my screen, I have no plausible excuse.”",
    "“We have officially crossed the threshold from exhaustion into hysteria.”",
    "“This is peak comedy and my humor is officially broken.”",
  ],
  concentrating: [
    "“Do not blink. Do not breathe. If you lose focus now, the logic puzzle collapses.”",
    "“If someone speaks to me right now, I will forget the last 40 minutes of thoughts.”",
    "“Focusing so hard my hairline feels like it's calculating square roots.”",
    "“Hold the memory in L1 cache. Keep the pointer alive. Almost got it.”",
  ],
  fearful: [
    "“Did I push to main? I definitely pushed to main. I am so fired.”",
    "“Wait... was that microphone on the whole time I was muttering to myself?!”",
    "“The deadline was today?! Which today?! UTC or local time?!”",
    "“If I don't look at the error log, technically the error does not exist.”",
  ],
  sad: [
    "“Why did I agree to do this? Why did I wake up today? What is existence?”",
    "“My code doesn't work, my back hurts, and my coffee is cold. Perfect.”",
    "“I could fake my own disappearance and start a sheep farm in New Zealand.”",
    "“I am one minor setback away from wrapping myself in a blanket forever.”",
  ],
  confused: [
    "“If I nod thoughtfully, maybe they will think I understand what is going on.”",
    "“What did I just read? I know all those individual words, but not in that order.”",
    "“Is the bug in line 42, or is the bug in my decision to pursue technology?”",
    "“Wait... which button did I just click? Oh no.”",
  ],
  surprised: [
    "“Wait, did that actually compile on the very first try?! That cannot be right.”",
    "“Hold on... is it 2:00 AM already?! Where did the last six hours go?!”",
    "“I did NOT see that coming. Nobody briefed me on this plot twist.”",
    "“Did that just work or did I just break the universe?”",
  ],
  thinking: [
    "“Should I do this option or that option? Let me get a snack first and decide later.”",
    "“There is an error somewhere in this plan... I just can't remember where.”",
    "“There is a massive traffic jam of thoughts happening in my head right now.”",
    "“If I look up at the ceiling long enough, maybe the solution will appear.”",
  ],
  neutral: [
    "“Maintaining a calm exterior while screaming internally in lowercase.”",
    "“Nothing to see here, just a human pretending to be functioning normally.”",
    "“Thinking about literally nothing. Just waiting for the loading bar of life.”",
    "“The mind is a blank canvas. Currently painted in shades of beige.”",
  ],
  angry: [
    "“If this spinner loads for one more second, I am dismantling this laptop with a hammer.”",
    "“I typed it correctly. It worked yesterday. Computers are a mistake.”",
  ],
  sleepy: [
    "“If I close my eyes for just 10 seconds while scrolling, it counts as resting.”",
    "“My pillow is calling me. Not calling—it sent a high-priority calendar invite.”",
  ],
  bored: [
    "“There are exactly 43 holes in this speaker grill. Now let's count the ceiling dots.”",
    "“How long has it been? Three minutes? Felt like an entire geologic epoch.”",
  ],
  disgusted: [
    "“Who committed this 4,000-line function with zero comments? Disgusting.”",
  ],
};

// Comedic style prefixes in English
export const STYLE_PREFIXES = {
  Sarcastic: [
    "Oh, wonderful.",
    "Fascinating discovery:",
    "Brilliant work, human:",
    "Surprise, surprise:",
    "Groundbreaking telemetry:",
  ],
  Roast: [
    "Respectfully,",
    "I say this with zero love:",
    "Breaking news for your ego:",
    "Reality check incoming:",
    "Diagnosis: catastrophic.",
  ],
  Dramatic: [
    "ATTENTION CITIZENS:",
    "THE PROPHECY HAS COME TO PASS:",
    "EMERGENCY BULLETIN:",
    "THE UNIVERSE TREMBLES:",
    "SEISMIC PSYCHOLOGICAL EVENT:",
  ],
  Chaotic: [
    "WAIT WAIT WAIT—",
    "ABSOLUTE PANDEMONIUM:",
    "WHO LET THIS HAPPEN:",
    "SYSTEM ALERT 9000:",
    "HOLD ONTO YOUR SOCKS:",
  ],
  Deadpan: [
    "Observation.",
    "Recorded data point.",
    "Telemetry received.",
    "Noted.",
    "Status report.",
  ],
  Programmer: [
    "Runtime exception:",
    "Console.warn():",
    "Compiler note:",
    "Stack trace diagnosis:",
    "NullPointerException in human cortex:",
  ],
  Psychological: [
    "Freudian analysis suggests:",
    "Cognitive assessment complete:",
    "Behavioral pattern unmasked:",
    "Diagnostic DSM-6 entry:",
  ],
  Narrator: [
    "And here we observe the human in its natural habitat:",
    "The camera captures a pivotal moment in civilization:",
    "Little did the human know, the machine was watching:",
    "Our narrator can only marvel at this specimen:",
  ],
  Absurd: [
    "According to the quantum cheese theorem:",
    "A pigeon in Ohio has sensed your distress:",
    "Your third chakra is emitting 5G interference:",
  ],
  Random: [
    "",
    "Observation:",
    "Telemetry update:",
    "Noticeable development:",
    "",
  ],
};

// No-face funny dialogues in English
export const NO_FACE_JOKES = [
  "Where did you go? I can't read your mind if you leave the frame.",
  "Human has vanished. Mind reading paused due to lack of target brain.",
  "Excellent stealth technique. But the camera sees through your tricks.",
  "Target lost. Are you hiding from your responsibilities under the desk?",
  "Zero faces detected. Either you moved or you have achieved invisibility.",
  "Come back! I was just getting to the embarrassing part of your mind.",
];
