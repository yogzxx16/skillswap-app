import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

// ── 50 Skills List ─────────────────────────────────────────
export const ALL_SKILLS = [
  // Tech
  "JavaScript", "Python", "React", "Node.js", "TypeScript",
  "Java", "C++", "Swift", "Kotlin", "PHP",
  "HTML/CSS", "SQL", "MongoDB", "Firebase", "Git",
  "Machine Learning", "Data Science", "Cybersecurity", "DevOps", "UI/UX Design",
  // Creative
  "Guitar", "Piano", "Drums", "Singing", "Music Production",
  "Drawing", "Painting", "Digital Art", "Photography", "Video Editing",
  "Graphic Design", "Animation", "3D Modeling", "Filmmaking", "Podcasting",
  // Languages
  "Spanish", "French", "Japanese", "Mandarin", "German",
  "Hindi", "Arabic", "Korean", "Italian", "Portuguese",
  // Life Skills
  "Cooking", "Baking", "Yoga", "Meditation", "Fitness Training",
  "Public Speaking", "Chess", "Dancing", "Writing", "Marketing",
];

// ── Question Bank (for skills that have questions) ──────────
const QUESTIONS = {
  JavaScript: [
    { q: "What does 'typeof null' return?", options: ["null", "object", "undefined", "string"], correct: 1 },
    { q: "Which method adds element to end of array?", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
    { q: "What is a closure?", options: ["Function with no params", "Function that remembers outer scope", "Infinite loop", "Error handler"], correct: 1 },
    { q: "What does '===' check?", options: ["Only value", "Only type", "Both value and type", "Neither"], correct: 2 },
    { q: "Block-scoped variable keyword?", options: ["var", "let", "function", "global"], correct: 1 },
    { q: "What does async/await do?", options: ["Speeds up code", "Handles async code", "Creates arrays", "Defines classes"], correct: 1 },
    { q: "What is the DOM?", options: ["A framework", "Document Object Model", "A CSS property", "A database"], correct: 1 },
    { q: "Which removes last array element?", options: ["shift()", "pop()", "splice()", "delete()"], correct: 1 },
    { q: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java Standard Object Names", "JavaScript Online Network", "Joint Source Object"], correct: 0 },
    { q: "What is event bubbling?", options: ["Creating events", "Event propagating up DOM", "Deleting events", "Animating elements"], correct: 1 },
  ],
  Python: [
    { q: "Output of print(type([]))?", options: ["list", "<class 'list'>", "array", "[]"], correct: 1 },
    { q: "Comment symbol in Python?", options: ["//", "/*", "#", "--"], correct: 2 },
    { q: "What does len() do?", options: ["Returns last element", "Returns length", "Deletes element", "Loops through list"], correct: 1 },
    { q: "How to create a dictionary?", options: ["[]", "()", "{}", "<>"], correct: 2 },
    { q: "What is a lambda?", options: ["A loop type", "An anonymous function", "A class method", "A variable type"], correct: 1 },
    { q: "What is a list comprehension?", options: ["A loop type", "Shorthand to create lists", "A sort method", "A string method"], correct: 1 },
    { q: "What does 'self' mean in classes?", options: ["Class name", "Reference to current instance", "Built-in function", "Variable type"], correct: 1 },
    { q: "What is pip?", options: ["A data type", "Package installer", "A loop type", "An IDE"], correct: 1 },
    { q: "What does append() do?", options: ["Removes last item", "Adds item to end", "Sorts list", "Reverses list"], correct: 1 },
    { q: "What is a tuple?", options: ["A mutable list", "An immutable sequence", "A dictionary type", "A loop"], correct: 1 },
  ],
  React: [
    { q: "What is JSX?", options: ["A database", "JavaScript XML syntax", "A CSS framework", "A testing tool"], correct: 1 },
    { q: "What is a React component?", options: ["A database table", "Reusable UI piece", "A CSS class", "A server file"], correct: 1 },
    { q: "What does useState do?", options: ["Fetches data", "Manages component state", "Styles components", "Creates routes"], correct: 1 },
    { q: "What is a prop in React?", options: ["A database field", "Data passed to components", "A CSS property", "A hook"], correct: 1 },
    { q: "What does useEffect do?", options: ["Manages state", "Handles side effects", "Creates components", "Styles elements"], correct: 1 },
    { q: "What is the virtual DOM?", options: ["A real browser DOM", "A lightweight copy of DOM", "A database", "A CSS framework"], correct: 1 },
    { q: "How do you pass data from parent to child?", options: ["Using state", "Using props", "Using context only", "Using localStorage"], correct: 1 },
    { q: "What is React Router used for?", options: ["Styling", "Navigation between pages", "Data fetching", "State management"], correct: 1 },
    { q: "What is a key prop used for?", options: ["Styling list items", "Uniquely identifying list items", "Passing data", "Event handling"], correct: 1 },
    { q: "What does lifting state up mean?", options: ["Making state global", "Moving state to parent component", "Deleting state", "Copying state"], correct: 1 },
  ],
  "Node.js": [
    { q: "What is Node.js?", options: ["A browser", "JavaScript runtime on server", "A database", "A CSS framework"], correct: 1 },
    { q: "What is npm?", options: ["A JavaScript syntax", "Node Package Manager", "A database tool", "A testing framework"], correct: 1 },
    { q: "What does require() do?", options: ["Creates a server", "Imports a module", "Deletes a file", "Makes HTTP request"], correct: 1 },
    { q: "What is Express.js?", options: ["A database", "Web framework for Node.js", "A CSS tool", "A testing library"], correct: 1 },
    { q: "What is middleware in Express?", options: ["A database layer", "Function between request and response", "A routing system", "An error type"], correct: 1 },
    { q: "What does app.listen() do?", options: ["Reads a file", "Starts the server on a port", "Connects to database", "Handles errors"], correct: 1 },
    { q: "What is the event loop in Node?", options: ["A for loop", "Mechanism handling async operations", "A database query", "A routing method"], correct: 1 },
    { q: "What is a callback function?", options: ["A synchronous function", "Function passed as argument to another", "A class method", "A global variable"], correct: 1 },
    { q: "What does fs module do?", options: ["Formats strings", "File system operations", "Frontend styling", "Function storage"], correct: 1 },
    { q: "What is a REST API?", options: ["A database type", "Architectural style for web services", "A programming language", "A testing tool"], correct: 1 },
  ],
  TypeScript: [
    { q: "What is TypeScript?", options: ["A new language", "JavaScript with static types", "A CSS framework", "A database"], correct: 1 },
    { q: "What does 'interface' do in TypeScript?", options: ["Creates a class", "Defines object structure", "Imports modules", "Handles errors"], correct: 1 },
    { q: "What is a type annotation?", options: ["A comment", "Declaring variable's type", "A function name", "A CSS class"], correct: 1 },
    { q: "What is 'any' type?", options: ["Strict type", "Accepts any type value", "A number type", "An array type"], correct: 1 },
    { q: "What does TypeScript compile to?", options: ["Python", "Java", "JavaScript", "HTML"], correct: 2 },
    { q: "What is a union type?", options: ["Merging two classes", "Variable that can be multiple types", "A loop", "A function type"], correct: 1 },
    { q: "What is a generic in TypeScript?", options: ["A variable", "Reusable type placeholder", "A function", "An error"], correct: 1 },
    { q: "What does '?' mean in TypeScript?", options: ["Required property", "Optional property", "Error type", "Generic type"], correct: 1 },
    { q: "What is an enum?", options: ["A loop type", "Set of named constants", "A function type", "A class method"], correct: 1 },
    { q: "What is type assertion?", options: ["Throwing an error", "Telling compiler a variable's type", "Creating a type", "Deleting a type"], correct: 1 },
  ],
  Guitar: [
    { q: "How many strings does standard guitar have?", options: ["4", "5", "6", "8"], correct: 2 },
    { q: "What is a chord?", options: ["Single note", "Multiple notes together", "A guitar type", "A music genre"], correct: 1 },
    { q: "What does a capo do?", options: ["Tunes guitar", "Changes key without retuning", "Mutes strings", "Holds the pick"], correct: 1 },
    { q: "Which part do you press to change notes?", options: ["Body", "Fretboard", "Bridge", "Tuning peg"], correct: 1 },
    { q: "What is strumming?", options: ["Pressing strings", "Tuning guitar", "Sweeping across strings", "Removing strings"], correct: 2 },
    { q: "What is a barre chord?", options: ["A single note", "One finger pressing all strings", "A guitar brand", "A strumming pattern"], correct: 1 },
    { q: "What does EADGBE represent?", options: ["Guitar brands", "Standard string tuning", "Music notes", "Chord names"], correct: 1 },
    { q: "What is fingerpicking?", options: ["Using a pick", "Plucking strings with fingers", "Tuning method", "A chord type"], correct: 1 },
    { q: "What is a riff?", options: ["A guitar type", "A short repeated phrase", "A tuning peg", "A music genre"], correct: 1 },
    { q: "What is the nut on a guitar?", options: ["A bolt", "Groove holding strings at headstock", "A chord type", "A capo"], correct: 1 },
  ],
  Piano: [
    { q: "How many keys does a standard piano have?", options: ["72", "76", "88", "96"], correct: 2 },
    { q: "What are the black keys called?", options: ["Major keys", "Minor keys", "Sharps and flats", "Natural notes"], correct: 2 },
    { q: "What does 'forte' mean in music?", options: ["Soft", "Loud", "Fast", "Slow"], correct: 1 },
    { q: "What is an octave?", options: ["8 half steps", "8 whole steps between same notes", "A chord type", "A rhythm pattern"], correct: 1 },
    { q: "What does the sustain pedal do?", options: ["Makes notes louder", "Lets notes ring longer", "Mutes notes", "Changes pitch"], correct: 1 },
    { q: "What is a scale?", options: ["A piano brand", "Series of notes in specific pattern", "A chord type", "A rhythm"], correct: 1 },
    { q: "What does 'piano' mean in Italian?", options: ["Loud", "Fast", "Soft", "Slow"], correct: 2 },
    { q: "What is middle C?", options: ["Highest note", "Central reference note", "A black key", "A chord"], correct: 1 },
    { q: "What is sight-reading?", options: ["Memorizing music", "Playing music on first viewing", "Reading notes loudly", "Watching tutorials"], correct: 1 },
    { q: "What is a treble clef?", options: ["A bass symbol", "Symbol for higher notes staff", "A chord name", "A piano brand"], correct: 1 },
  ],
  Singing: [
    { q: "What is vocal range?", options: ["How loud you sing", "Span of notes you can sing", "How long you sing", "Your singing style"], correct: 1 },
    { q: "What is vibrato?", options: ["Singing off-key", "Rapid pitch variation in a note", "A singing style", "Breathing technique"], correct: 1 },
    { q: "What does diaphragm do in singing?", options: ["Controls pitch", "Supports breath for singing", "Makes voice louder", "Adds vibrato"], correct: 1 },
    { q: "What is a falsetto?", options: ["Wrong notes", "High register above normal voice", "A singing exercise", "A vocal chord"], correct: 1 },
    { q: "What does 'pitch' mean?", options: ["How loud a note is", "Highness or lowness of a note", "Speed of singing", "Type of song"], correct: 1 },
    { q: "What is sight singing?", options: ["Singing with closed eyes", "Singing from written music first time", "Singing quietly", "Memorizing songs"], correct: 1 },
    { q: "What warms up your voice?", options: ["Cold water", "Vocal exercises and humming", "Loud screaming", "Silence"], correct: 1 },
    { q: "What is harmony?", options: ["Singing alone", "Multiple notes sounding together", "A singing style", "A song type"], correct: 1 },
    { q: "What is a vocal break?", options: ["Taking a break", "Transition between vocal registers", "A wrong note", "A singing pause"], correct: 1 },
    { q: "What is a cappella?", options: ["Singing with instruments", "Singing without instruments", "A song type", "A vocal exercise"], correct: 1 },
  ],
  "Music Production": [
    { q: "What is a DAW?", options: ["A mixing board", "Digital Audio Workstation", "A microphone type", "A speaker system"], correct: 1 },
    { q: "What is BPM?", options: ["Bass Per Minute", "Beats Per Minute", "Bars Per Measure", "Basic Production Mode"], correct: 1 },
    { q: "What is mastering?", options: ["First step in production", "Final step optimizing for distribution", "Adding instruments", "Recording vocals"], correct: 1 },
    { q: "What is a VST plugin?", options: ["A recording device", "Virtual instrument/effect software", "A speaker type", "A microphone"], correct: 1 },
    { q: "What is EQ used for?", options: ["Adding reverb", "Adjusting frequency levels", "Controlling volume", "Adding delay"], correct: 1 },
    { q: "What is compression in audio?", options: ["Making files smaller", "Reducing dynamic range", "Adding bass", "Speeding up tempo"], correct: 1 },
    { q: "What is a MIDI?", options: ["A music file format", "Protocol for music instruments/software", "A microphone type", "A speaker brand"], correct: 1 },
    { q: "What is reverb?", options: ["A drum pattern", "Simulation of acoustic space", "A bass effect", "A vocal technique"], correct: 1 },
    { q: "What is a sample?", options: ["A test sound", "Pre-recorded audio used in music", "A music note", "A drum brand"], correct: 1 },
    { q: "What is mixing?", options: ["Combining ingredients", "Balancing and combining audio tracks", "Recording vocals", "Writing melodies"], correct: 1 },
  ],
  Photography: [
    { q: "What does ISO measure?", options: ["Lens size", "Camera's light sensitivity", "Shutter speed", "Focal length"], correct: 1 },
    { q: "What is aperture?", options: ["Shutter speed", "Opening controlling light entry", "Camera brand", "Image format"], correct: 1 },
    { q: "What is the golden hour?", options: ["Midday sunlight", "Hour after sunrise or before sunset", "Night photography", "Studio lighting"], correct: 1 },
    { q: "What is depth of field?", options: ["Image width", "Range of sharp focus in image", "Camera zoom", "Image height"], correct: 1 },
    { q: "What does RAW format mean?", options: ["Compressed image", "Unprocessed image data", "Low quality image", "Black and white"], correct: 1 },
    { q: "What is the rule of thirds?", options: ["Use 3 cameras", "Divide frame into 9 parts", "Take 3 photos", "Use 3 colors"], correct: 1 },
    { q: "What causes motion blur?", options: ["Wide aperture", "Slow shutter speed", "High ISO", "Long lens"], correct: 1 },
    { q: "What is bokeh?", options: ["Camera shake", "Blurred background effect", "Overexposure", "A lens type"], correct: 1 },
    { q: "What is white balance?", options: ["Image brightness", "Color temperature adjustment", "Contrast level", "Saturation"], correct: 1 },
    { q: "What is a wide angle lens used for?", options: ["Close-up shots", "Capturing wide scenes", "Portraits", "Sports photography"], correct: 1 },
  ],
  "Graphic Design": [
    { q: "What is kerning?", options: ["Font size", "Space between individual letters", "Line spacing", "Font weight"], correct: 1 },
    { q: "What does RGB stand for?", options: ["Red Green Blue", "Red Gray Black", "Round Grid Border", "Right Group Box"], correct: 0 },
    { q: "What is a vector graphic?", options: ["Pixel-based image", "Math-based scalable image", "A photo", "A video frame"], correct: 1 },
    { q: "What is CMYK used for?", options: ["Screen design", "Print design color model", "Web colors", "Video editing"], correct: 1 },
    { q: "What is leading in typography?", options: ["Letter spacing", "Space between lines of text", "Font size", "Font weight"], correct: 1 },
    { q: "What is a logo?", options: ["A color palette", "Visual symbol representing brand", "A font type", "An image filter"], correct: 1 },
    { q: "What is negative space?", options: ["Dark colors", "Empty space around subjects", "Bad design", "Background color"], correct: 1 },
    { q: "What does DPI stand for?", options: ["Design Per Image", "Dots Per Inch", "Digital Print Index", "Display Pixel Index"], correct: 1 },
    { q: "What is a mood board?", options: ["A deadline tracker", "Visual collection of design inspiration", "A color wheel", "A font library"], correct: 1 },
    { q: "What is a brand identity?", options: ["A company name", "Visual elements representing a brand", "A logo only", "A website"], correct: 1 },
  ],
  Spanish: [
    { q: "How do you say 'Hello'?", options: ["Bonjour", "Hola", "Ciao", "Hallo"], correct: 1 },
    { q: "What does 'Gracias' mean?", options: ["Please", "Sorry", "Thank you", "Hello"], correct: 2 },
    { q: "How do you say 'Good morning'?", options: ["Buenas noches", "Buenos días", "Buenas tardes", "Hola"], correct: 1 },
    { q: "What does 'Casa' mean?", options: ["Car", "House", "Street", "Food"], correct: 1 },
    { q: "How to say 'I don't understand'?", options: ["No entiendo", "No problema", "No gracias", "No habla"], correct: 0 },
    { q: "What does 'Agua' mean?", options: ["Fire", "Earth", "Water", "Air"], correct: 2 },
    { q: "How to say 'Please'?", options: ["Gracias", "Por favor", "De nada", "Lo siento"], correct: 1 },
    { q: "What does 'Amigo' mean?", options: ["Enemy", "Stranger", "Friend", "Teacher"], correct: 2 },
    { q: "How to say 'Goodbye'?", options: ["Hola", "Gracias", "Adiós", "Buenos días"], correct: 2 },
    { q: "What does 'Perro' mean?", options: ["Cat", "Bird", "Dog", "Fish"], correct: 2 },
  ],
  French: [
    { q: "How do you say 'Hello' in French?", options: ["Hola", "Bonjour", "Ciao", "Hallo"], correct: 1 },
    { q: "What does 'Merci' mean?", options: ["Please", "Sorry", "Thank you", "Hello"], correct: 2 },
    { q: "How do you say 'water' in French?", options: ["Agua", "Wasser", "Eau", "Maji"], correct: 2 },
    { q: "What does 'Oui' mean?", options: ["No", "Maybe", "Yes", "Please"], correct: 2 },
    { q: "How to say 'I love you' in French?", options: ["Te quiero", "Je t'aime", "Ti amo", "Ich liebe dich"], correct: 1 },
    { q: "What does 'Bonsoir' mean?", options: ["Good morning", "Good afternoon", "Good evening", "Goodbye"], correct: 2 },
    { q: "How do you say 'cat' in French?", options: ["Gato", "Katze", "Chat", "Neko"], correct: 2 },
    { q: "What does 'S'il vous plaît' mean?", options: ["Thank you", "Please", "Sorry", "Excuse me"], correct: 1 },
    { q: "How to say 'bread' in French?", options: ["Pan", "Brot", "Pain", "Pane"], correct: 2 },
    { q: "What does 'Au revoir' mean?", options: ["Hello", "Thank you", "Please", "Goodbye"], correct: 3 },
  ],
  Japanese: [
    { q: "How do you say 'Thank you' in Japanese?", options: ["Arigatou", "Konnichiwa", "Sayonara", "Ohayou"], correct: 0 },
    { q: "What does 'Konnichiwa' mean?", options: ["Good morning", "Hello/Good afternoon", "Goodbye", "Thank you"], correct: 1 },
    { q: "How many main writing systems does Japanese have?", options: ["1", "2", "3", "4"], correct: 2 },
    { q: "What does 'Sayonara' mean?", options: ["Hello", "Thank you", "Goodbye", "Please"], correct: 2 },
    { q: "What is Hiragana?", options: ["Chinese characters", "Japanese phonetic alphabet", "Numbers system", "Punctuation marks"], correct: 1 },
    { q: "How do you say 'Yes' in Japanese?", options: ["Hai", "Iie", "Sou", "Demo"], correct: 0 },
    { q: "What does 'Ohayou' mean?", options: ["Goodnight", "Good afternoon", "Good morning", "Hello"], correct: 2 },
    { q: "How do you say 'water' in Japanese?", options: ["Mizu", "Hana", "Kaze", "Tsuki"], correct: 0 },
    { q: "What does 'Sumimasen' mean?", options: ["Thank you", "Goodbye", "Excuse me/Sorry", "Good morning"], correct: 2 },
    { q: "How do you say 'I understand' in Japanese?", options: ["Wakarimasen", "Wakarimasu", "Hanashimasu", "Ikimasu"], correct: 1 },
  ],
  Cooking: [
    { q: "What does 'sauté' mean?", options: ["Boil slowly", "Fry quickly in oil", "Bake in oven", "Steam with water"], correct: 1 },
    { q: "What is blanching?", options: ["Slow cooking", "Briefly boiling then cooling", "Deep frying", "Grilling"], correct: 1 },
    { q: "What does 'fold' mean in baking?", options: ["Mix vigorously", "Gently combine ingredients", "Beat fast", "Knead dough"], correct: 1 },
    { q: "What is a roux?", options: ["A sauce", "Flour and fat cooked together", "A spice blend", "A type of pasta"], correct: 1 },
    { q: "What does 'al dente' mean?", options: ["Overcooked", "Firm to the bite", "Very soft", "Cold"], correct: 1 },
    { q: "What is braising?", options: ["Frying in oil", "Slow cooking in liquid", "Grilling on fire", "Baking dry"], correct: 1 },
    { q: "What does mise en place mean?", options: ["A French dish", "Everything in its place before cooking", "A cooking technique", "A sauce type"], correct: 1 },
    { q: "What is caramelization?", options: ["Adding caramel", "Sugar browning with heat", "Cooling sugar", "Melting butter"], correct: 1 },
    { q: "What is an emulsion?", options: ["A cooking oil", "Stable mixture of oil and water", "A type of sauce", "A baking powder"], correct: 1 },
    { q: "What does 'reduce' mean in cooking?", options: ["Add more liquid", "Simmer liquid to thicken", "Cool the dish", "Add spices"], correct: 1 },
  ],
  Yoga: [
    { q: "What does 'yoga' mean in Sanskrit?", options: ["Stretch", "Union or connection", "Peace", "Balance"], correct: 1 },
    { q: "What is 'asana'?", options: ["Breathing exercise", "Physical yoga pose", "Meditation", "A yoga mat"], correct: 1 },
    { q: "What is pranayama?", options: ["A yoga pose", "Breathing techniques", "A meditation style", "A warm-up"], correct: 1 },
    { q: "What is the mountain pose called?", options: ["Savasana", "Tadasana", "Downdog", "Warrior"], correct: 1 },
    { q: "What is Savasana?", options: ["Standing pose", "Corpse/relaxation pose", "Balancing pose", "Inversion pose"], correct: 1 },
    { q: "How many chakras are in the body?", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "What does 'namaste' mean?", options: ["Goodbye", "I bow to you", "Thank you", "Welcome"], correct: 1 },
    { q: "What is Vinyasa yoga?", options: ["Still poses", "Flow of poses with breath", "Hot yoga", "Chair yoga"], correct: 1 },
    { q: "What does 'Om' represent?", options: ["A word", "Universal sound/vibration", "A greeting", "A pose name"], correct: 1 },
    { q: "What is the child's pose used for?", options: ["Strength building", "Rest and relaxation", "Balance training", "Core strength"], correct: 1 },
  ],
  Chess: [
    { q: "How many squares on a chessboard?", options: ["32", "48", "64", "72"], correct: 2 },
    { q: "Which piece can jump over others?", options: ["Bishop", "Rook", "Knight", "Queen"], correct: 2 },
    { q: "What is 'checkmate'?", options: ["King is in check and can't escape", "King is captured", "Game is draw", "First move"], correct: 0 },
    { q: "What is castling?", options: ["Capturing a piece", "King and rook special move", "Promoting a pawn", "A check move"], correct: 1 },
    { q: "How does a bishop move?", options: ["Straight lines", "L-shape", "Diagonally", "Any direction"], correct: 2 },
    { q: "What is en passant?", options: ["A checkmate type", "Special pawn capture", "A draw rule", "Opening move"], correct: 1 },
    { q: "What happens when pawn reaches the end?", options: ["It's removed", "It can be promoted", "Game ends", "It goes back"], correct: 1 },
    { q: "What is a 'stalemate'?", options: ["King in check", "No legal moves but not check", "Game won", "Draw by agreement"], correct: 1 },
    { q: "How does the queen move?", options: ["Only straight", "Only diagonal", "Any direction any squares", "L-shape"], correct: 2 },
    { q: "What is the most valuable piece?", options: ["Queen", "Rook", "King (can't be captured)", "Bishop"], correct: 2 },
  ],
  "Public Speaking": [
    { q: "What is the most common speaking fear?", options: ["Forgetting words", "Fear of audience judgment", "Technical issues", "Stage fright"], correct: 3 },
    { q: "What does 'pacing' mean in speaking?", options: ["Walking around", "Speed of your speech", "Hand gestures", "Eye contact"], correct: 1 },
    { q: "What is the rule of three in speeches?", options: ["Speak for 3 minutes", "Use 3 points or examples", "Have 3 speakers", "Pause 3 times"], correct: 1 },
    { q: "What are filler words?", options: ["Important words", "Meaningless words like 'um' 'uh'", "Technical words", "Opening words"], correct: 1 },
    { q: "Best way to reduce nervousness?", options: ["Avoid speaking", "Practice regularly", "Speak faster", "Look at ceiling"], correct: 1 },
    { q: "What is a hook in a speech?", options: ["Ending statement", "Attention-grabbing opening", "A joke only", "A question only"], correct: 1 },
    { q: "What does body language communicate?", options: ["Nothing important", "Emotions and confidence", "Only your words", "Only your posture"], correct: 1 },
    { q: "What is impromptu speaking?", options: ["Planned speech", "Speech without preparation", "Written speech", "Group speech"], correct: 1 },
    { q: "Why is eye contact important?", options: ["Not important", "Builds trust and connection", "Shows nervousness", "Distracts audience"], correct: 1 },
    { q: "What is the ideal speech structure?", options: ["Just talk freely", "Introduction, Body, Conclusion", "Only conclusion", "Only introduction"], correct: 1 },
  ],
  Marketing: [
    { q: "What is a target audience?", options: ["Everyone", "Specific group you market to", "Your team", "Competitors"], correct: 1 },
    { q: "What is SEO?", options: ["Social Email Outreach", "Search Engine Optimization", "Sales Engagement Online", "Site Edit Options"], correct: 1 },
    { q: "What is a call to action (CTA)?", options: ["A phone call", "Prompt telling users what to do next", "A marketing budget", "A social media post"], correct: 1 },
    { q: "What is brand awareness?", options: ["Your logo design", "How familiar people are with your brand", "Your marketing budget", "Your social media following"], correct: 1 },
    { q: "What is content marketing?", options: ["Buying ads", "Creating valuable content to attract customers", "Cold calling", "Email spam"], correct: 1 },
    { q: "What is a conversion rate?", options: ["Currency exchange", "Percentage of visitors who take desired action", "Email open rate", "Social media growth"], correct: 1 },
    { q: "What is A/B testing?", options: ["Testing two teams", "Comparing two versions to see which works better", "A grading system", "A software test"], correct: 1 },
    { q: "What is organic reach?", options: ["Paid advertising", "Audience reached without paid promotion", "Environmental marketing", "Local marketing"], correct: 1 },
    { q: "What is a buyer persona?", options: ["A real customer", "Fictional ideal customer profile", "A marketing team member", "A competitor"], correct: 1 },
    { q: "What is viral marketing?", options: ["Dangerous marketing", "Content that spreads rapidly by sharing", "Email marketing", "TV advertising"], correct: 1 },
  ],
  Writing: [
    { q: "What is a thesis statement?", options: ["A book title", "Main argument of an essay", "A paragraph type", "A conclusion"], correct: 1 },
    { q: "What is the 'show don't tell' rule?", options: ["Use more dialogue", "Describe through action not statement", "Add more adjectives", "Write longer sentences"], correct: 1 },
    { q: "What is a protagonist?", options: ["Villain of the story", "Main character of the story", "A narrator", "A side character"], correct: 1 },
    { q: "What is dialogue in writing?", options: ["Description of setting", "Characters speaking to each other", "Internal thoughts", "Action scenes"], correct: 1 },
    { q: "What is the climax of a story?", options: ["The beginning", "The highest point of tension", "The ending", "A subplot"], correct: 1 },
    { q: "What is foreshadowing?", options: ["Describing weather", "Hints about future events", "Flashbacks", "Character description"], correct: 1 },
    { q: "What is a metaphor?", options: ["A comparison using 'like' or 'as'", "Direct comparison without 'like' or 'as'", "A rhyme scheme", "A type of dialogue"], correct: 1 },
    { q: "What is point of view in writing?", options: ["A character's opinion", "Perspective from which story is told", "A plot device", "A writing style"], correct: 1 },
    { q: "What is editing vs proofreading?", options: ["Same thing", "Editing=content, Proofreading=grammar", "Proofreading=content, Editing=grammar", "Neither matters"], correct: 1 },
    { q: "What is a plot twist?", options: ["A new character", "Unexpected change in story direction", "A chapter ending", "A conflict"], correct: 1 },
  ],
  "Fitness Training": [
    { q: "What is a rep in exercise?", options: ["A rest period", "One complete movement of an exercise", "A workout plan", "A training partner"], correct: 1 },
    { q: "What is progressive overload?", options: ["Exercising too much", "Gradually increasing workout intensity", "Starting with heavy weights", "Skipping rest days"], correct: 1 },
    { q: "What does HIIT stand for?", options: ["High Impact Intense Training", "High Intensity Interval Training", "Heavy Individual Interval Training", "High Internal Intensity Training"], correct: 1 },
    { q: "Why is protein important for fitness?", options: ["Gives energy", "Builds and repairs muscle", "Burns fat", "Hydrates body"], correct: 1 },
    { q: "What is a warm-up for?", options: ["Burning calories", "Preparing body for exercise", "Cooling down after workout", "Building strength"], correct: 1 },
    { q: "What is muscle hypertrophy?", options: ["Muscle weakness", "Muscle growth from training", "Muscle cramp", "Muscle soreness"], correct: 1 },
    { q: "What is DOMS?", options: ["Daily Optimum Movement Speed", "Delayed Onset Muscle Soreness", "Dynamic Output Muscle Strength", "Daily Output Maximum Sets"], correct: 1 },
    { q: "How many days should you rest between workouts?", options: ["0 days", "Depends on intensity/muscle group", "7 days always", "1 month"], correct: 1 },
    { q: "What is a compound exercise?", options: ["Simple movement", "Exercise using multiple muscle groups", "Exercise with equipment", "Stretching exercise"], correct: 1 },
    { q: "What is the best time to eat after workout?", options: ["24 hours later", "Within 30-60 minutes", "Before sleeping", "It doesn't matter"], correct: 1 },
  ],
  "Machine Learning": [
    { q: "What is supervised learning?", options: ["Learning with a teacher", "Training with labeled data", "Unsupervised training", "Learning without data"], correct: 1 },
    { q: "What is overfitting?", options: ["Model is too simple", "Model performs well on training but poorly on new data", "Model has too little data", "Model trains too slowly"], correct: 1 },
    { q: "What is a neural network?", options: ["A computer network", "System inspired by brain neurons", "An internet network", "A database"], correct: 1 },
    { q: "What is a training dataset?", options: ["Test data", "Data used to train the model", "Data for evaluation", "Final predictions"], correct: 1 },
    { q: "What is gradient descent?", options: ["A type of neural network", "Optimization algorithm to minimize errors", "A data preprocessing step", "A neural layer"], correct: 1 },
    { q: "What does accuracy mean in ML?", options: ["Speed of model", "Percentage of correct predictions", "Size of model", "Training time"], correct: 1 },
    { q: "What is a feature in ML?", options: ["A model type", "Input variable used for prediction", "A prediction output", "A training algorithm"], correct: 1 },
    { q: "What is classification?", options: ["Sorting data alphabetically", "Predicting which category data belongs to", "Predicting a number", "Clustering data"], correct: 1 },
    { q: "What is unsupervised learning?", options: ["Learning without internet", "Finding patterns in unlabeled data", "Learning with labeled data", "Random predictions"], correct: 1 },
    { q: "What is cross-validation?", options: ["Checking across teams", "Technique to evaluate model on different data splits", "A type of neural network", "A data format"], correct: 1 },
  ],
  Dancing: [
    { q: "What is rhythm in dancing?", options: ["Dance style", "Timing and pattern of movements", "A dance move", "Music genre"], correct: 1 },
    { q: "What is choreography?", options: ["A dance type", "Sequence of planned dance moves", "Dance music", "Dance costume"], correct: 1 },
    { q: "What does tempo mean in dance?", options: ["Dance style", "Speed of the music", "A dance move", "Dance formation"], correct: 1 },
    { q: "What is a pirouette?", options: ["A jump", "Spinning turn on one leg", "A hand gesture", "A dance style"], correct: 1 },
    { q: "What is freestyle dancing?", options: ["Dancing for free", "Improvised movement without choreography", "A dance style", "A competition type"], correct: 1 },
    { q: "What is a dance floor etiquette?", options: ["Dance rules made up", "Respectful behavior on dance floor", "A dance style", "A competition rule"], correct: 1 },
    { q: "What is the difference between beat and rhythm?", options: ["Same thing", "Beat is steady pulse, rhythm is pattern over beat", "Rhythm is faster", "Beat is louder"], correct: 1 },
    { q: "What is isolation in dance?", options: ["Dancing alone", "Moving one body part independently", "A dance style", "A warm-up"], correct: 1 },
    { q: "What is a dance combination?", options: ["Two dance styles", "Series of steps performed in sequence", "Dancing with partner", "A competition format"], correct: 1 },
    { q: "Why is stretching important for dancers?", options: ["Not important", "Prevents injury and improves flexibility", "Makes you taller", "Helps memorize moves"], correct: 1 },
  ],
  Meditation: [
    { q: "What is mindfulness?", options: ["Thinking about future", "Being fully present in the moment", "Ignoring thoughts", "Sleeping technique"], correct: 1 },
    { q: "What is the purpose of meditation?", options: ["Fall asleep", "Calm the mind and reduce stress", "Exercise the body", "Improve memory only"], correct: 1 },
    { q: "What is a mantra?", options: ["A meditation pose", "Word or phrase repeated during meditation", "A breathing technique", "A meditation tool"], correct: 1 },
    { q: "What is focused attention meditation?", options: ["Thinking about everything", "Concentrating on single point like breath", "Moving meditation", "Group meditation"], correct: 1 },
    { q: "How long should a beginner meditate?", options: ["2 hours", "5-10 minutes to start", "Only at night", "No time limit"], correct: 1 },
    { q: "What is body scan meditation?", options: ["Medical scan", "Systematically focusing attention on body parts", "A yoga pose", "Exercise meditation"], correct: 1 },
    { q: "What is loving-kindness meditation?", options: ["Loving yourself only", "Cultivating compassion for self and others", "A Hindu practice only", "Physical meditation"], correct: 1 },
    { q: "What happens to brain waves during meditation?", options: ["They stop", "They slow down to alpha/theta waves", "They speed up", "They stay the same"], correct: 1 },
    { q: "What is transcendental meditation?", options: ["Religious practice", "Technique using silent mantras", "Physical exercise", "Group therapy"], correct: 1 },
    { q: "What is the best position for meditation?", options: ["Lying down always", "Comfortable position with straight spine", "Standing only", "Any position that works for you"], correct: 3 },
  ],
  Baking: [
    { q: "What does 'proof' mean in bread making?", options: ["Testing recipe", "Letting dough rise with yeast", "Measuring ingredients", "Kneading dough"], correct: 1 },
    { q: "Why do recipes use baking soda?", options: ["For flavor", "As a leavening agent to make things rise", "For color", "For texture only"], correct: 1 },
    { q: "What is the creaming method?", options: ["Adding cream", "Beating butter and sugar until fluffy", "Adding milk", "A frosting technique"], correct: 1 },
    { q: "What does 'fold' mean in baking?", options: ["Fold the pan", "Gently combine without deflating", "Stir vigorously", "Knead thoroughly"], correct: 1 },
    { q: "Why is oven temperature important?", options: ["For appearance only", "Affects chemical reactions and texture", "Only for timing", "It's not important"], correct: 1 },
    { q: "What is gluten in baking?", options: ["A sugar type", "Protein giving bread its structure", "A leavening agent", "A flavor enhancer"], correct: 1 },
    { q: "What does 'blind baking' mean?", options: ["Baking without looking", "Baking pastry shell before filling", "Baking in dark oven", "Guessing recipe"], correct: 1 },
    { q: "Why do you let cake cool before frosting?", options: ["No reason", "Hot cake melts frosting", "For better flavor", "To save time"], correct: 1 },
    { q: "What is ganache?", options: ["A French pastry", "Chocolate and cream mixture", "A cake type", "A frosting type"], correct: 1 },
    { q: "What does 'room temperature' ingredients mean?", options: ["Ingredients from fridge", "Ingredients at 20-22°C for better mixing", "Warm ingredients", "Frozen ingredients"], correct: 1 },
  ],
};

// Generic fallback for skills without specific questions
const GENERIC_QUESTIONS = (skill) => [
  { q: `What is the most important thing when learning ${skill}?`, options: ["Natural talent only", "Consistent daily practice", "Expensive equipment", "Perfect conditions"], correct: 1 },
  { q: `How do you get better at ${skill} fastest?`, options: ["Watch others only", "Practice + get feedback", "Read theory only", "Wait for inspiration"], correct: 1 },
  { q: `What mindset helps most when learning ${skill}?`, options: ["Fixed mindset", "Growth mindset", "Competitive mindset", "Passive mindset"], correct: 1 },
  { q: `What should a beginner focus on in ${skill}?`, options: ["Advanced techniques", "Basic fundamentals first", "Competing immediately", "Skipping basics"], correct: 1 },
  { q: `How do you track progress in ${skill}?`, options: ["You can't", "Record yourself and compare over time", "Ask random people", "Just guess"], correct: 1 },
  { q: `What is deliberate practice in ${skill}?`, options: ["Casual practice", "Focused practice targeting weaknesses", "Any kind of practice", "Group practice"], correct: 1 },
  { q: `What role does rest play in learning ${skill}?`, options: ["Not important", "Helps consolidate learning", "Slows progress", "Only for athletes"], correct: 1 },
  { q: `How can you stay motivated learning ${skill}?`, options: ["Force yourself daily", "Set small achievable goals", "Compare with experts", "Only practice when inspired"], correct: 1 },
  { q: `What is the best resource for learning ${skill}?`, options: ["One book only", "Mix of learning + real practice", "YouTube only", "Formal classes only"], correct: 1 },
  { q: `What separates good from great in ${skill}?`, options: ["Age", "Consistent long-term practice", "Luck", "Natural talent alone"], correct: 1 },
];

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const getShuffledQuestions = (skill) => {
  const bank = QUESTIONS[skill] || GENERIC_QUESTIONS(skill);
  const picked = shuffleArray(bank).slice(0, 5);
  return picked.map(q => {
    const optionsWithCorrect = q.options.map((opt, i) => ({
      opt,
      isCorrect: i === q.correct,
    }));
    const shuffled = shuffleArray(optionsWithCorrect);
    return {
      q: q.q,
      options: shuffled.map(o => o.opt),
      correct: shuffled.findIndex(o => o.isCorrect),
    };
  });
};

const getSkillIcon = (skill) => {
  const icons = {
    'JavaScript': 'javascript', 'Python': 'terminal', 'React': 'code',
    'Node.js': 'hub', 'TypeScript': 'code_blocks', 'Java': 'coffee',
    'C++': 'memory', 'Swift': 'phone_iphone', 'Kotlin': 'android',
    'PHP': 'php', 'HTML/CSS': 'html', 'SQL': 'storage',
    'MongoDB': 'database', 'Firebase': 'local_fire_department', 'Git': 'merge_type',
    'Machine Learning': 'psychology', 'Data Science': 'analytics', 'Cybersecurity': 'security',
    'DevOps': 'settings', 'UI/UX Design': 'palette', 'Guitar': 'music_note',
    'Piano': 'piano', 'Drums': 'queue_music', 'Singing': 'mic', 'Music Production': 'headphones',
    'Drawing': 'draw', 'Painting': 'brush', 'Digital Art': 'tablet', 'Photography': 'photo_camera',
    'Video Editing': 'movie_edit', 'Graphic Design': 'design_services', 'Animation': 'animation',
    '3D Modeling': 'view_in_ar', 'Filmmaking': 'videocam', 'Podcasting': 'podcasts',
    'Spanish': 'language', 'French': 'language', 'Japanese': 'language', 'Mandarin': 'language',
    'German': 'language', 'Hindi': 'language', 'Arabic': 'language', 'Korean': 'language',
    'Italian': 'language', 'Portuguese': 'language', 'Cooking': 'restaurant', 'Baking': 'cake',
    'Yoga': 'self_improvement', 'Meditation': 'spa', 'Fitness Training': 'fitness_center',
    'Public Speaking': 'record_voice_over', 'Chess': 'casino', 'Dancing': 'directions_run',
    'Writing': 'edit_note', 'Marketing': 'campaign',
  };
  return icons[skill] || 'star';
};

export default function PracticeZonePage() {
  const { profile, updateProfile } = useAuth();
  const [duelState, setDuelState] = useState('SKILL_SELECTION');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lastUserAnswer, setLastUserAnswer] = useState(null);
  const [lastAiAnswer, setLastAiAnswer] = useState(null);
  const [showXpGain, setShowXpGain] = useState(false);
  const [xpSaved, setXpSaved] = useState(false);

  // ✅ Use ref to track score without stale closure
  const userScoreRef = useRef(0);

  const startPractice = (skill) => {
    userScoreRef.current = 0;
    setQuestions(getShuffledQuestions(skill));
    setSelectedSkill(skill);
    setDuelState('QUIZ');
    setCurrentQuestionIndex(0);
    setUserScore(0);
    setAiScore(0);
    setIsAnswered(false);
    setLastUserAnswer(null);
    setLastAiAnswer(null);
    setXpSaved(false);
  };

  const handleUserAnswer = (index) => {
    if (isAnswered || questions.length === 0) return;

    const question = questions[currentQuestionIndex];
    const isCorrect = index === question.correct;

    setLastUserAnswer(index);
    setIsAnswered(true);

    if (isCorrect) {
      userScoreRef.current += 1;
      setUserScore(prev => prev + 1);
      setShowXpGain(true);
      setTimeout(() => setShowXpGain(false), 1000);
    }

    setTimeout(() => {
      const aiCorrect = Math.random() < 0.7;
      let aiAns;
      if (aiCorrect) {
        aiAns = question.correct;
        setAiScore(prev => prev + 1);
      } else {
        const wrong = [0, 1, 2, 3].filter(i => i !== question.correct);
        aiAns = wrong[Math.floor(Math.random() * wrong.length)];
      }
      setLastAiAnswer(aiAns);

      setTimeout(() => {
        if (currentQuestionIndex < 4) {
          setCurrentQuestionIndex(prev => prev + 1);
          setIsAnswered(false);
          setLastUserAnswer(null);
          setLastAiAnswer(null);
        } else {
          // ✅ Use ref value — no stale closure!
          const finalXP = userScoreRef.current * 20;
          if (updateProfile && finalXP > 0 && !xpSaved) {
            updateProfile({ xp: (profile?.xp || 0) + finalXP });
            setXpSaved(true);
          }
          setDuelState('RESULTS');
        }
      }, 2000);
    }, 1500);
  };

  const availableSkills = Array.from(new Set([
    ...(profile?.teachSkills || []),
    ...(profile?.learnSkills || []),
    ...ALL_SKILLS,
  ]));

  const currentQ = questions[currentQuestionIndex];

  return (
    <PageTransition className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <section className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-tertiary text-xs animate-pulse">psychology</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-tertiary uppercase">Practice Session</span>
          </div>
          <h1 className="font-headline font-black text-3xl uppercase italic tracking-tighter">Practice <span className="text-tertiary">Arena</span></h1>
        </div>
        <div className="glass-panel px-4 py-2 border-r-4 border-tertiary flex flex-col items-end">
          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Practice makes</span>
          <span className="font-headline font-black text-lg">Perfect 🎯</span>
        </div>
      </section>

      <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
        <AnimatePresence mode="wait">

          {/* SKILL SELECTION */}
          {duelState === 'SKILL_SELECTION' && (
            <motion.div
              key="skill_selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center text-center space-y-8 glass-panel border border-white/5 rounded-2xl p-8 overflow-y-auto"
            >
              <div className="space-y-2">
                <h2 className="font-headline font-black text-4xl uppercase italic tracking-widest">Choose a Skill</h2>
                <p className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">Pick any skill to start your practice duel</p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 w-full max-w-5xl">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-4 glass-panel border-2 transition-all flex flex-col items-center gap-2 group ${selectedSkill === skill
                      ? 'border-tertiary bg-tertiary/10 scale-105'
                      : 'border-white/5 hover:border-white/20'
                      }`}
                  >
                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                      {getSkillIcon(skill)}
                    </span>
                    <span className="font-headline font-bold text-[10px] uppercase tracking-tighter text-center leading-tight">{skill}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => selectedSkill && startPractice(selectedSkill)}
                disabled={!selectedSkill}
                className={`px-12 py-4 font-headline font-black uppercase tracking-widest text-xs transition-all ${selectedSkill
                  ? 'bg-tertiary text-on-tertiary-fixed hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(140,231,255,0.3)]'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'
                  }`}
              >
                {selectedSkill ? `Start ${selectedSkill} Practice` : 'Select a Skill First'}
              </button>
            </motion.div>
          )}

          {/* QUIZ */}
          {duelState === 'QUIZ' && currentQ && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col w-full gap-6"
            >
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-tertiary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                />
              </div>

              <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
                {/* User Side */}
                <div className={`flex-1 glass-panel rounded-2xl p-8 border-l-4 transition-all ${isAnswered && lastUserAnswer === currentQ.correct ? 'border-primary' : 'border-white/10'
                  } relative flex flex-col justify-between`}>
                  <div className="absolute top-0 left-0 p-4 font-mono text-[8px] text-slate-500 tracking-widest uppercase">You</div>
                  <div className="text-center space-y-2">
                    <h3 className="font-headline font-black text-3xl italic uppercase">{profile?.displayName?.split(' ')[0] || 'USER'}</h3>
                    <div className="font-headline font-black text-5xl text-primary">{userScore}</div>
                  </div>
                  <AnimatePresence>
                    {showXpGain && (
                      <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: -50 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 -translate-x-1/2 top-1/2 font-headline font-black text-2xl text-primary pointer-events-none"
                      >
                        +20 XP
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="h-24 flex items-center justify-center">
                    {isAnswered && lastUserAnswer !== null && (
                      <span className={`material-symbols-outlined text-6xl ${lastUserAnswer === currentQ.correct ? 'text-primary' : 'text-secondary'
                        }`}>
                        {lastUserAnswer === currentQ.correct ? 'check_circle' : 'cancel'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Center */}
                <div className="flex-[2] flex flex-col gap-6">
                  <div className="glass-panel rounded-2xl p-8 border border-white/5 flex-1 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="font-mono text-[10px] text-tertiary uppercase tracking-[0.3em]">
                      Question {currentQuestionIndex + 1} / 5 — {selectedSkill}
                    </div>
                    <h2 className="font-headline font-black text-2xl md:text-3xl uppercase italic leading-tight">
                      {currentQ.q}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {currentQ.options.map((option, idx) => {
                        const isCorrect = idx === currentQ.correct;
                        const isSelected = lastUserAnswer === idx;
                        const isAiSelected = lastAiAnswer === idx;
                        let btnClass = "border-white/10 hover:border-white/30";
                        if (isAnswered) {
                          if (isCorrect) btnClass = "border-primary bg-primary/10 text-primary";
                          else if (isSelected) btnClass = "border-secondary bg-secondary/10 text-secondary";
                        }
                        return (
                          <button
                            key={idx}
                            onClick={() => handleUserAnswer(idx)}
                            disabled={isAnswered}
                            className={`p-4 border-2 font-headline font-bold text-sm uppercase tracking-tighter transition-all relative flex items-center justify-center ${btnClass} ${isAnswered ? 'cursor-default' : 'hover:scale-[1.02] active:scale-[0.98]'
                              }`}
                          >
                            {option}
                            {isAiSelected && (
                              <div className="absolute -right-2 -top-2 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-[10px] animate-bounce">AI</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AI Side */}
                <div className={`flex-1 glass-panel rounded-2xl p-8 border-r-4 transition-all ${isAnswered && lastAiAnswer === currentQ.correct ? 'border-secondary' : 'border-white/10'
                  } relative flex flex-col justify-between`}>
                  <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-slate-500 tracking-widest uppercase text-right">Opponent: AI</div>
                  <div className="text-center space-y-2">
                    <h3 className="font-headline font-black text-3xl italic uppercase text-secondary">AI BOT</h3>
                    <div className="font-headline font-black text-5xl text-secondary">{aiScore}</div>
                  </div>
                  <div className="h-24 flex items-center justify-center">
                    {lastAiAnswer !== null ? (
                      <span className={`material-symbols-outlined text-6xl ${lastAiAnswer === currentQ.correct ? 'text-secondary' : 'text-slate-600'
                        }`}>
                        {lastAiAnswer === currentQ.correct ? 'check_circle' : 'cancel'}
                      </span>
                    ) : isAnswered ? (
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-slate-800">memory</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS */}
          {duelState === 'RESULTS' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 glass-panel border border-white/5 rounded-2xl p-8"
            >
              <div className="w-32 h-32 rounded-full border-4 border-tertiary flex items-center justify-center shadow-[0_0_40px_rgba(140,231,255,0.2)]">
                <span className="material-symbols-outlined text-6xl text-tertiary">
                  {userScore > aiScore ? 'emoji_events' : userScore < aiScore ? 'sentiment_very_dissatisfied' : 'handshake'}
                </span>
              </div>
              <div className="space-y-4">
                <h2 className="font-headline font-black text-5xl uppercase italic tracking-widest text-tertiary">
                  {userScore > aiScore ? 'You Win! 🎉' : userScore < aiScore ? 'Defeated 😤' : 'Draw! 🤝'}
                </h2>
                <div className="flex items-center gap-8 justify-center">
                  <div className="text-center">
                    <div className="font-mono text-[10px] text-slate-500 uppercase">Your Score</div>
                    <div className="font-headline font-black text-4xl">{userScore}/5</div>
                  </div>
                  <div className="font-headline font-black text-2xl text-slate-700 italic">VS</div>
                  <div className="text-center">
                    <div className="font-mono text-[10px] text-slate-500 uppercase">AI Score</div>
                    <div className="font-headline font-black text-4xl text-secondary">{aiScore}/5</div>
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-xl inline-block">
                  <span className="font-headline font-black text-xl text-primary">
                    +{userScoreRef.current * 20} XP EARNED
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => startPractice(selectedSkill)}
                  className="px-10 py-4 bg-tertiary text-on-tertiary-fixed font-headline font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                >
                  Play Again
                </button>
                <button
                  onClick={() => { setDuelState('SKILL_SELECTION'); setSelectedSkill(null); }}
                  className="px-10 py-4 glass-panel border border-white/10 font-headline font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  Try Another Skill
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}