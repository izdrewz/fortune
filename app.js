import { firebaseConfig } from "./firebase-config.js";

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";

import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  runTransaction,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


/* =========================================================
   CONTENT
   ========================================================= */

const TYPE_DATA = {
  normal: {
    label: "Normal",
    icon: "🥠",
    chance: 73
  },

  broken: {
    label: "Broken",
    icon: "💔",
    chance: 6
  },

  hard: {
    label: "Hard",
    icon: "🪨",
    chance: 5
  },

  shiny: {
    label: "Shiny",
    icon: "✨",
    chance: 5
  },

  legendary: {
    label: "Legendary",
    icon: "👑",
    chance: 1
  },

  personality: {
    label: "Personality",
    icon: "🎭",
    chance: 5
  },

  country: {
    label: "Country",
    icon: "🌍",
    chance: 5
  }
};


const NORMAL_FORTUNES = [
  "A pleasant surprise will find you when you are not looking for it.",
  "Something small today will become important later.",
  "Your next good idea deserves to be followed.",
  "Someone is thinking fondly of you.",
  "A change of scenery will bring a useful thought.",
  "Your patience will pay off in an unexpected way.",
  "A lucky coincidence is closer than it seems.",
  "Today rewards curiosity.",
  "An ordinary moment will become a good memory.",
  "You will soon have a reason to laugh.",
  "A kind message will arrive at the right time.",
  "Trust the idea you keep returning to.",
  "A forgotten plan deserves another look.",
  "Your next choice will be easier than the last.",
  "Good news likes inconvenient timing.",
  "The thing you almost ignored may be worth noticing.",
  "You are due a satisfying little victory.",
  "A familiar person will surprise you.",
  "A quiet day can still change things.",
  "Keep a little room in your plans for luck.",
  "Something you've been waiting for will finally move.",
  "An unexpected invitation may be worth accepting.",
  "Your next laugh will be better than you expect.",
  "A tiny risk may produce a disproportionately good result."
];


const BAD_FORTUNES = [
  "An inconvenience approaches with suspicious confidence.",
  "Today may contain a deeply unnecessary problem.",
  "Your next minor mistake will be impressively timed.",
  "Something you put somewhere safe may become too safe.",
  "The universe has scheduled a small betrayal by technology.",
  "Your snack may disappoint you.",
  "One of your plans has misunderstood the assignment.",
  "Beware of objects placed near the edge of tables.",
  "A task you thought was finished may have one final form.",
  "Your luck has gone out for lunch.",
  "Something will load to 99% and reconsider.",
  "A door, drawer, cable or zipper may become your enemy."
];


const GREAT_FORTUNES = [
  "A remarkable piece of luck is heading directly toward you.",
  "Something you genuinely want is moving closer.",
  "Your next bold choice may work far better than expected.",
  "You are entering an unusually fortunate chapter.",
  "A very good memory is waiting to happen.",
  "Someone you love will give you a reason to feel incredibly lucky.",
  "A wish you keep returning to is worth taking seriously.",
  "Fortune is firmly on your side.",
  "A door you thought was closed may open.",
  "You are about to absolutely cook.",
  "The odds are preparing to behave themselves for once.",
  "A future version of you is extremely glad you kept going."
];


const PERSONALITIES = [

  {
    id: "diva",
    name: "Diva",
    icon: "💅",
    stickers: [
      { id: "served", art: "💅✨", label: "SERVED" },
      { id: "diva-down", art: "💋⬇️", label: "DIVA DOWN" },
      { id: "girlboss", art: "👑💖", label: "GIRLBOSS" }
    ],
    fortunes: [
      "ur slaying the game girlboss. fortune literally has no choice but to serve",
      "DIVA UP. the universe has approved the outfit, the plan and the audacity",
      "your future is giving main event. everyone else may form an orderly queue",
      "a win is approaching and yes babe it IS because you're iconic",
      "diva down temporarily. dramatic recovery followed by unreasonable success"
    ]
  },

  {
    id: "catboy",
    name: "Catboy",
    icon: "🐱",
    stickers: [
      { id: "master", art: "ฅ^•ﻌ•^ฅ", label: "MASTER CODED" },
      { id: "nya", art: ":3 ✨", label: "NYA" },
      { id: "paws", art: "🐾💗", label: "SERVE U" }
    ],
    fortunes: [
      "ur so master coded everyone will serve you meows :3",
      "mrrp!! good fortune detected master!! absolutely no bias here :3",
      "the stars say u deserve treats immediately nya",
      "future status: cozy, adored and dangerously powerful :3",
      "someone will think about u today. probably meow related"
    ]
  },

  {
    id: "cat",
    name: "Cat",
    icon: "🐈",
    stickers: [
      { id: "dither", art: "▓▒░🐈░▒▓", label: "DITHERED CAT" },
      { id: "mrow", art: "M R O W", label: "MROW" },
      { id: "question", art: "🐈?", label: "MEOW?" }
    ],
    fortunes: [
      "MEOWGENRE: prophecy\nmeow... mrrrp... MEOOOOW.",
      "MEOWGENRE: romance\nmrrp ♡ meow meow prrrp",
      "MEOWGENRE: metal\nMEEEOOOOWWW. MRRAAAOW. meow.",
      "MEOWGENRE: corporate\nmeow. please circle back. mrrp regards.",
      "MEOWGENRE: ancient omen\n...mrow... mrow... the bowl shall be filled."
    ]
  },

  {
    id: "weeb",
    name: "Weeb",
    icon: "🌸",
    stickers: [
      { id: "sparkle", art: "✨(≧▽≦)✨", label: "PROTAGONIST" },
      { id: "senpai", art: "🌸👀", label: "SENPAI" },
      { id: "powerup", art: "⚡🌸", label: "POWER UP" }
    ],
    fortunes: [
      "your next arc contains suspicious amounts of character development",
      "fortune has selected you as today's protagonist. do not waste the episode",
      "a power-up approaches. soundtrack optional but recommended",
      "your filler arc is ending. plot relevance incoming",
      "senpai luck has noticed you"
    ]
  },

  {
    id: "alpha",
    name: "Alpha",
    icon: "🐺",
    stickers: [
      { id: "grind", art: "🐺📈", label: "GRINDSET" },
      { id: "aura", art: "🗿⚡", label: "AURA" },
      { id: "wolf", art: "🌕🐺", label: "THE WOLF" }
    ],
    fortunes: [
      "the grindset predicts a 300% increase in extremely unnecessary confidence",
      "fortune doesn't knock. apparently you bench-pressed the door",
      "today you wake up, dominate the spreadsheet, and stare meaningfully at a mountain",
      "your aura has been promoted to regional manager",
      "wolves don't consult fortune cookies. except this wolf apparently"
    ]
  },

  {
    id: "rude",
    name: "Rude",
    icon: "🙄",
    stickers: [
      { id: "eyeroll", art: "🙄", label: "PLEASE" },
      { id: "whatever", art: "💅🙄", label: "WHATEVER" },
      { id: "skillissue", art: "📉💀", label: "SKILL ISSUE" }
    ],
    fortunes: [
      "you'll probably succeed. somehow. don't make it weird",
      "good fortune is coming. try not to fumble it this time",
      "apparently the universe believes in you. embarrassing for everyone involved",
      "your plan might actually work. disgusting",
      "congratulations in advance I guess"
    ]
  },

  {
    id: "goth",
    name: "Goth",
    icon: "🦇",
    stickers: [
      { id: "abyss", art: "🦇🖤", label: "ABYSS" },
      { id: "moon", art: "🌙🥀", label: "OMEN" },
      { id: "doom", art: "☠️✨", label: "CUTE DOOM" }
    ],
    fortunes: [
      "the abyss reviewed your application. strangely, it predicts a lovely afternoon",
      "doom approaches. unfortunately for doom, so do you",
      "the moon has issued a favourable but emotionally complicated omen",
      "your darkness shall be rewarded with a surprisingly nice snack",
      "a beautiful tragedy awaits. by tragedy I mean minor inconvenience"
    ]
  },

  {
    id: "pirate",
    name: "Pirate",
    icon: "🏴‍☠️",
    stickers: [
      { id: "parrot", art: "🏴‍☠️🦜", label: "YARR" },
      { id: "treasure", art: "🗺️💰", label: "TREASURE" },
      { id: "captain", art: "⚓👑", label: "CAPTAIN" }
    ],
    fortunes: [
      "fortune be blowin' fair winds toward ye",
      "a treasure ye weren't huntin' may soon cross yer path",
      "trust yer compass, unless it starts pointin' at snacks",
      "good tides be ahead, matey",
      "yer next adventure may be worth leavin' port for"
    ]
  }

];


const COUNTRIES = [

  {
    id: "argentina",
    country: "Argentina",
    flag: "🇦🇷",
    food: "Empanada",
    foodEmoji: "🥟",
    language: "Spanish",
    saying: "Al mal tiempo, buena cara.",
    translation: "In bad times, put on a brave face."
  },

  {
    id: "japan",
    country: "Japan",
    flag: "🇯🇵",
    food: "Gyoza",
    foodEmoji: "🥟",
    language: "Japanese",
    saying: "七転び八起き",
    translation: "Fall seven times, stand up eight."
  },

  {
    id: "italy",
    country: "Italy",
    flag: "🇮🇹",
    food: "Panzerotto",
    foodEmoji: "🥟",
    language: "Italian",
    saying: "La fortuna aiuta gli audaci.",
    translation: "Fortune favours the bold."
  },

  {
    id: "france",
    country: "France",
    flag: "🇫🇷",
    food: "Chausson",
    foodEmoji: "🥐",
    language: "French",
    saying: "Qui ne risque rien n'a rien.",
    translation: "Nothing ventured, nothing gained."
  },

  {
    id: "germany",
    country: "Germany",
    flag: "🇩🇪",
    food: "Maultasche",
    foodEmoji: "🥟",
    language: "German",
    saying: "Jeder ist seines Glückes Schmied.",
    translation: "Everyone is the smith of their own fortune."
  },

  {
    id: "poland",
    country: "Poland",
    flag: "🇵🇱",
    food: "Pieróg",
    foodEmoji: "🥟",
    language: "Polish",
    saying: "Nie ma tego złego, co by na dobre nie wyszło.",
    translation: "Something good can come out of something bad."
  },

  {
    id: "turkey",
    country: "Türkiye",
    flag: "🇹🇷",
    food: "Börek",
    foodEmoji: "🥟",
    language: "Turkish",
    saying: "Kısmetse olur.",
    translation: "If it is meant to be, it will happen."
  },

  {
    id: "india",
    country: "India",
    flag: "🇮🇳",
    food: "Samosa",
    foodEmoji: "🥟",
    language: "Hindi",
    saying: "जहाँ चाह, वहाँ राह।",
    translation: "Where there is a will, there is a way."
  }

];


/* =========================================================
   ACHIEVEMENTS
   ========================================================= */

const INDIVIDUAL_ACHIEVEMENTS = [

  {
    id: "first-cookie",
    icon: "🥠",
    name: "First Crumb",
    description: "Open your first cookie.",
    target: 1,
    value: m => m.total
  },

  {
    id: "first-shiny",
    icon: "✨",
    name: "Ooh, Shiny",
    description: "Find your first Shiny.",
    target: 1,
    value: m => m.shiny
  },

  {
    id: "legend",
    icon: "👑",
    name: "Chosen by Fortune",
    description: "Find a Legendary.",
    target: 1,
    value: m => m.legendary
  },

  {
    id: "inedible",
    icon: "🪨",
    name: "Absolutely Inedible",
    description: "Get 10 Hard cookies.",
    target: 10,
    value: m => m.hard
  },

  {
    id: "crumbles",
    icon: "💔",
    name: "Structural Integrity",
    description: "Get 10 Broken cookies.",
    target: 10,
    value: m => m.broken
  },

  {
    id: "passport",
    icon: "🌍",
    name: "Passport Please",
    description: "Discover 5 countries.",
    target: 5,
    value: m => m.stamps
  },

  {
    id: "cast",
    icon: "🎭",
    name: "Full Cast",
    description: "Meet 5 personalities.",
    target: 5,
    value: m => m.personalities
  },

  {
    id: "stickers",
    icon: "💌",
    name: "Sticker Cabinet",
    description: "Unlock 12 unique personality stickers.",
    target: 12,
    value: m => m.stickers
  },

  {
    id: "collector",
    icon: "📚",
    name: "Cookie Archivist",
    description: "Collect 50 cookies.",
    target: 50,
    value: m => m.total
  },

  {
    id: "hundred",
    icon: "💯",
    name: "Vending Problem",
    description: "Collect 100 cookies.",
    target: 100,
    value: m => m.total
  },

  {
    id: "special",
    icon: "❤️",
    name: "Keeper",
    description: "Have 10 of your cookies marked special.",
    target: 10,
    value: m => m.special
  },

  {
    id: "chatty",
    icon: "💬",
    name: "Yapper",
    description: "Send 50 messages or collectibles.",
    target: 50,
    value: m => m.messages
  }

];


const SHARED_ACHIEVEMENTS = [

  {
    id: "two-kind",
    icon: "💕",
    name: "Two of a Kind",
    description: "Both discover the same personality.",
    target: 1,
    value: m => m.sharedPersonality
  },

  {
    id: "couple",
    icon: "🍪",
    name: "Cookie Couple",
    description: "Collect 100 cookies together.",
    target: 100,
    value: m => m.totalCookies
  },

  {
    id: "world",
    icon: "🌎",
    name: "World Tour",
    description: "Together discover every currently available country.",
    target: COUNTRIES.length,
    value: m => m.countries
  },

  {
    id: "special-us",
    icon: "💖",
    name: "Our Fortunes",
    description: "Mark 25 fortunes special together.",
    target: 25,
    value: m => m.special
  },

  {
    id: "messages",
    icon: "💌",
    name: "Long Distance Snack",
    description: "Send 100 messages together.",
    target: 100,
    value: m => m.messages
  },

  {
    id: "legendary-pair",
    icon: "👑",
    name: "Legendary Pair",
    description: "Both find at least one Legendary.",
    target: 2,
    value: m => m.playersWithLegendary
  }

];


/* =========================================================
   STATE
   ========================================================= */

const state = {

  user: null,

  roomCode: null,
  room: null,

  cookies: [],
  messages: [],
  yoms: [],

  pendingCookie: null,
  lastReveal: null,

  albumFilter: "all",
  albumOwner: "mine",

  subscriptions: [],

  installPrompt: null,

  busy: false

};


let firebaseApp;
let auth;
let db;


/* =========================================================
   DOM
   ========================================================= */

const $ = selector => document.querySelector(selector);

const setupError = $("#setupError");
const authView = $("#authView");
const roomView = $("#roomView");
const appView = $("#appView");

const emailInput = $("#emailInput");
const passwordInput = $("#passwordInput");
const authForm = $("#authForm");
const registerButton = $("#registerButton");
const resetPasswordButton = $("#resetPasswordButton");
const authStatus = $("#authStatus");

const createNameInput = $("#createNameInput");
const joinNameInput = $("#joinNameInput");
const joinCodeInput = $("#joinCodeInput");
const createRoomButton = $("#createRoomButton");
const joinRoomButton = $("#joinRoomButton");
const roomStatus = $("#roomStatus");
const roomLogoutButton = $("#roomLogoutButton");

const headerPlayerName = $("#headerPlayerName");
const headerRoomCode = $("#headerRoomCode");

const machineDisplay = $("#machineDisplay");
const vendButton = $("#vendButton");
const openButton = $("#openButton");
const machineOwnerTitle = $("#machineOwnerTitle");
const quickStats = $("#quickStats");
const revealArea = $("#revealArea");

const albumOwnerSelect = $("#albumOwnerSelect");
const albumFilters = $("#albumFilters");
const albumGrid = $("#albumGrid");
const stickersGrid = $("#stickersGrid");
const stampsGrid = $("#stampsGrid");
const yomList = $("#yomList");

const messageList = $("#messageList");
const messageForm = $("#messageForm");
const messageInput = $("#messageInput");
const collectibleSelect = $("#collectibleSelect");
const sendCollectibleButton = $("#sendCollectibleButton");
const quickCollectibles = $("#quickCollectibles");

const achievementList = $("#achievementList");
const sharedAchievementList = $("#sharedAchievementList");

const compareGrid = $("#compareGrid");

const settingsRoomCode = $("#settingsRoomCode");
const copyCodeButton = $("#copyCodeButton");
const copyInviteButton = $("#copyInviteButton");
const renameInput = $("#renameInput");
const renameButton = $("#renameButton");
const ownerControls = $("#ownerControls");
const resetPartnerButton = $("#resetPartnerButton");
const accountEmail = $("#accountEmail");
const installButton = $("#installButton");
const forgetRoomButton = $("#forgetRoomButton");
const logoutButton = $("#logoutButton");

const toastBox = $("#toast");


/* =========================================================
   BOOT
   ========================================================= */

function firebaseConfigured() {

  return (
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("PASTE_") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("PASTE_")
  );

}


async function boot() {

  bindStaticEvents();

  if ("serviceWorker" in navigator) {

    navigator.serviceWorker
      .register("./service-worker.js")
      .catch(console.error);

  }

  if (!firebaseConfigured()) {

    showOnly(setupError);
    return;

  }

  firebaseApp = initializeApp(firebaseConfig);

  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);

  await setPersistence(auth, browserLocalPersistence);

  onAuthStateChanged(auth, async user => {

    clearSubscriptions();

    state.user = user;
    state.room = null;
    state.roomCode = null;

    if (!user) {

      showOnly(authView);
      return;

    }

    await restoreRoom();

  });

}


function bindStaticEvents() {

  document.querySelectorAll(".tab").forEach(button => {

    button.addEventListener("click", () => {

      document.querySelectorAll(".tab")
        .forEach(x => x.classList.remove("active"));

      document.querySelectorAll(".panel")
        .forEach(x => x.classList.remove("active"));

      button.classList.add("active");

      $(`#panel-${button.dataset.panel}`)
        .classList.add("active");

    });

  });


  authForm.addEventListener("submit", async event => {

    event.preventDefault();
    await login();

  });


  registerButton.addEventListener("click", registerAccount);

  resetPasswordButton.addEventListener(
    "click",
    resetPassword
  );


  createRoomButton.addEventListener(
    "click",
    createRoom
  );

  joinRoomButton.addEventListener(
    "click",
    joinRoom
  );


  roomLogoutButton.addEventListener(
    "click",
    () => signOut(auth)
  );


  vendButton.addEventListener(
    "click",
    vendCookie
  );

  openButton.addEventListener(
    "click",
    openCookie
  );


  albumOwnerSelect.addEventListener("change", () => {

    state.albumOwner = albumOwnerSelect.value;

    renderAlbum();

  });


  messageForm.addEventListener("submit", async event => {

    event.preventDefault();
    await sendTextMessage();

  });


  sendCollectibleButton.addEventListener(
    "click",
    sendSelectedCollectible
  );


  copyCodeButton.addEventListener(
    "click",
    copyRoomCode
  );

  copyInviteButton.addEventListener(
    "click",
    copyInvite
  );

  renameButton.addEventListener(
    "click",
    renameMe
  );

  resetPartnerButton.addEventListener(
    "click",
    resetPartner
  );

  forgetRoomButton.addEventListener(
    "click",
    forgetRoom
  );

  logoutButton.addEventListener(
    "click",
    () => signOut(auth)
  );


  installButton.addEventListener(
    "click",
    installApp
  );


  window.addEventListener(
    "beforeinstallprompt",
    event => {

      event.preventDefault();

      state.installPrompt = event;

    }
  );

}


boot();


/* =========================================================
   VIEW MANAGEMENT
   ========================================================= */

function showOnly(element) {

  [
    setupError,
    authView,
    roomView,
    appView
  ].forEach(x => x.classList.add("hidden"));

  element.classList.remove("hidden");

}


function showRoomScreen(prefill = "") {

  showOnly(roomView);

  roomStatus.textContent = "";

  if (prefill) {

    joinCodeInput.value = normalizeRoomCode(prefill);

  }

}


function showApp() {

  showOnly(appView);

  renderAll();

}


/* =========================================================
   AUTH
   ========================================================= */

async function login() {

  authStatus.textContent = "";

  try {

    await signInWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value
    );

  } catch (error) {

    authStatus.textContent = friendlyFirebaseError(error);

  }

}


async function registerAccount() {

  authStatus.textContent = "";

  try {

    await createUserWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value
    );

  } catch (error) {

    authStatus.textContent = friendlyFirebaseError(error);

  }

}


async function resetPassword() {

  const email = emailInput.value.trim();

  if (!email) {

    authStatus.textContent =
      "Enter your email address first.";

    return;

  }

  try {

    await sendPasswordResetEmail(auth, email);

    authStatus.textContent =
      "Password reset email sent.";

  } catch (error) {

    authStatus.textContent = friendlyFirebaseError(error);

  }

}


/* =========================================================
   ROOMS
   ========================================================= */

function roomStorageKey() {

  return `fortunes-room:${state.user.uid}`;

}


function roomRef(code) {

  return doc(db, "rooms", normalizeRoomCode(code));

}


function roomCollection(name) {

  return collection(
    db,
    "rooms",
    state.roomCode,
    name
  );

}


function normalizeRoomCode(value) {

  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

}


function generateRoomCode() {

  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const bytes = new Uint8Array(12);

  crypto.getRandomValues(bytes);

  return [...bytes]
    .map(value =>
      alphabet[value % alphabet.length]
    )
    .join("");

}


async function restoreRoom() {

  const urlRoom = new URLSearchParams(
    location.search
  ).get("room");

  const savedRoom =
    localStorage.getItem(roomStorageKey());

  const candidate =
    normalizeRoomCode(savedRoom || urlRoom || "");

  if (!candidate) {

    showRoomScreen(urlRoom || "");
    return;

  }

  try {

    const snapshot = await getDoc(roomRef(candidate));

    if (
      snapshot.exists() &&
      isRoomMember(snapshot.data())
    ) {

      connectRoom(candidate);
      return;

    }

  } catch (error) {

    console.error(error);

  }

  localStorage.removeItem(roomStorageKey());

  showRoomScreen(urlRoom || "");

}


async function createRoom() {

  const name = createNameInput.value.trim();

  if (!name) {

    roomStatus.textContent =
      "Give yourself a name first.";

    return;

  }

  roomStatus.textContent = "Creating room...";

  try {

    let code;
    let ref;

    for (let attempt = 0; attempt < 5; attempt++) {

      code = generateRoomCode();

      ref = roomRef(code);

      const existing = await getDoc(ref);

      if (!existing.exists()) break;

      code = null;

    }

    if (!code) {

      throw new Error("Could not generate room code.");

    }

    await setDoc(ref, {

      createdAt: Date.now(),
      updatedAt: Date.now(),

      member1: state.user.uid,
      member1Name: name,

      member2: null,
      member2Name: "",

      joinedAt: null

    });

    localStorage.setItem(
      roomStorageKey(),
      code
    );

    connectRoom(code);

  } catch (error) {

    console.error(error);

    roomStatus.textContent =
      friendlyFirebaseError(error);

  }

}


async function joinRoom() {

  const name = joinNameInput.value.trim();

  const code = normalizeRoomCode(
    joinCodeInput.value
  );

  if (!name || !code) {

    roomStatus.textContent =
      "Enter your name and the room code.";

    return;

  }

  roomStatus.textContent = "Joining...";

  try {

    await runTransaction(
      db,
      async transaction => {

        const ref = roomRef(code);

        const snapshot =
          await transaction.get(ref);

        if (!snapshot.exists()) {

          throw new Error(
            "That room does not exist."
          );

        }

        const room = snapshot.data();

        if (
          room.member1 === state.user.uid ||
          room.member2 === state.user.uid
        ) {

          return;

        }

        if (room.member2) {

          throw new Error(
            "That room already has two people."
          );

        }

        transaction.update(ref, {

          member2: state.user.uid,
          member2Name: name,
          joinedAt: Date.now(),
          updatedAt: Date.now()

        });

      }
    );

    localStorage.setItem(
      roomStorageKey(),
      code
    );

    connectRoom(code);

  } catch (error) {

    console.error(error);

    roomStatus.textContent =
      error.message || friendlyFirebaseError(error);

  }

}


function connectRoom(code) {

  clearSubscriptions();

  state.roomCode = normalizeRoomCode(code);

  localStorage.setItem(
    roomStorageKey(),
    state.roomCode
  );

  const roomUnsub = onSnapshot(
    roomRef(state.roomCode),
    snapshot => {

      if (!snapshot.exists()) {

        forgetRoom();
        return;

      }

      const data = snapshot.data();

      if (!isRoomMember(data)) {

        toast(
          "This account is no longer a member of that room."
        );

        forgetRoom();
        return;

      }

      state.room = data;

      showApp();

    }
  );


  const cookiesUnsub = onSnapshot(

    query(
      roomCollection("cookies"),
      orderBy("createdAt", "desc")
    ),

    snapshot => {

      state.cookies =
        snapshot.docs.map(item => ({
          id: item.id,
          ...item.data()
        }));

      renderAll();

    }

  );


  const messagesUnsub = onSnapshot(

    query(
      roomCollection("messages"),
      orderBy("createdAt", "asc")
    ),

    snapshot => {

      state.messages =
        snapshot.docs.map(item => ({
          id: item.id,
          ...item.data()
        }));

      renderChat();
      renderAchievements();

    }

  );


  const yomsUnsub = onSnapshot(

    query(
      roomCollection("yoms"),
      orderBy("createdAt", "desc")
    ),

    snapshot => {

      state.yoms =
        snapshot.docs.map(item => ({
          id: item.id,
          ...item.data()
        }));

      renderYoms();

    }

  );


  state.subscriptions.push(
    roomUnsub,
    cookiesUnsub,
    messagesUnsub,
    yomsUnsub
  );

}


function clearSubscriptions() {

  state.subscriptions.forEach(unsubscribe => {

    try {
      unsubscribe();
    } catch {}

  });

  state.subscriptions = [];

}


function isRoomMember(room = state.room) {

  if (!room || !state.user) return false;

  return (
    room.member1 === state.user.uid ||
    room.member2 === state.user.uid
  );

}


function myName() {

  if (!state.room) return "";

  if (state.room.member1 === state.user.uid) {

    return state.room.member1Name;

  }

  return state.room.member2Name;

}


function partnerUid() {

  if (!state.room) return null;

  if (state.room.member1 === state.user.uid) {

    return state.room.member2;

  }

  return state.room.member1;

}


function partnerName() {

  if (!state.room) return "Partner";

  if (state.room.member1 === state.user.uid) {

    return (
      state.room.member2Name ||
      "Waiting for partner"
    );

  }

  return state.room.member1Name;

}


function ownerName(uid) {

  if (!state.room) return "Unknown";

  if (uid === state.room.member1) {

    return state.room.member1Name;

  }

  if (uid === state.room.member2) {

    return state.room.member2Name;

  }

  return "Unknown";

}


function isRoomOwner() {

  return (
    state.room &&
    state.room.member1 === state.user.uid
  );

}


async function renameMe() {

  const value = renameInput.value.trim();

  if (!value) return;

  const field =
    state.room.member1 === state.user.uid
      ? "member1Name"
      : "member2Name";

  await updateDoc(
    roomRef(state.roomCode),
    {
      [field]: value,
      updatedAt: Date.now()
    }
  );

  toast("Name updated.");

}


async function resetPartner() {

  if (!isRoomOwner()) return;

  if (!state.room.member2) {

    toast("The partner slot is already empty.");
    return;

  }

  const okay = confirm(
    "Reset the partner slot? Their account will lose access until they join again."
  );

  if (!okay) return;

  await updateDoc(
    roomRef(state.roomCode),
    {
      member2: null,
      member2Name: "",
      joinedAt: null,
      updatedAt: Date.now()
    }
  );

  toast("Partner slot reset.");

}


function forgetRoom() {

  if (state.user) {

    localStorage.removeItem(
      roomStorageKey()
    );

  }

  clearSubscriptions();

  state.room = null;
  state.roomCode = null;

  state.cookies = [];
  state.messages = [];
  state.yoms = [];

  state.pendingCookie = null;
  state.lastReveal = null;

  showRoomScreen();

}


/* =========================================================
   RANDOMIZATION
   ========================================================= */

function randomNumber() {

  const array = new Uint32Array(1);

  crypto.getRandomValues(array);

  return array[0] / 4294967296;

}


function pick(items) {

  return items[
    Math.floor(randomNumber() * items.length)
  ];

}


function rollCookieType() {

  const roll = randomNumber() * 100;

  if (roll < 73) return "normal";
  if (roll < 79) return "broken";
  if (roll < 84) return "hard";
  if (roll < 89) return "shiny";
  if (roll < 90) return "legendary";
  if (roll < 95) return "personality";

  return "country";

}


function buildCookie() {

  const type = rollCookieType();

  const cookie = {

    type,

    ownerUid: state.user.uid,

    fortune: "",

    personalityId: null,
    stickerId: null,

    countryId: null,

    special: false,
    note: "",

    createdAt: Date.now(),
    updatedAt: Date.now()

  };


  if (type === "normal") {

    cookie.fortune =
      pick(NORMAL_FORTUNES);

  }


  if (type === "broken") {

    cookie.fortune =
      pick(BAD_FORTUNES);

  }


  if (type === "hard") {

    cookie.fortune = "";

  }


  if (type === "shiny") {

    cookie.fortune =
      pick(GREAT_FORTUNES);

  }


  if (type === "legendary") {

    cookie.fortune =
      pick(GREAT_FORTUNES);

  }


  if (type === "personality") {

    const personality =
      pick(PERSONALITIES);

    const sticker =
      pick(personality.stickers);

    cookie.personalityId =
      personality.id;

    cookie.stickerId =
      sticker.id;

    cookie.fortune =
      pick(personality.fortunes);

  }


  if (type === "country") {

    const country =
      pick(COUNTRIES);

    cookie.countryId =
      country.id;

    cookie.fortune =
      country.saying;

  }


  return cookie;

}


/* =========================================================
   MACHINE
   ========================================================= */

function vendCookie() {

  if (state.pendingCookie || state.busy) return;

  state.pendingCookie = buildCookie();

  state.lastReveal = null;

  renderMachine();

}


async function openCookie() {

  if (
    !state.pendingCookie ||
    state.busy
  ) return;

  state.busy = true;

  renderMachine();

  try {

    const cookie = {
      ...state.pendingCookie
    };

    const cookieRef =
      doc(roomCollection("cookies"));

    const batch = writeBatch(db);

    batch.set(
      cookieRef,
      cookie
    );


    if (cookie.type === "legendary") {

      const yomRef =
        doc(roomCollection("yoms"));

      batch.set(
        yomRef,
        {
          ownerUid: state.user.uid,

          cookieId: cookieRef.id,

          request: "",

          status: "unused",

          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      );

    }


    await batch.commit();


    state.lastReveal = {
      id: cookieRef.id,
      ...cookie
    };

    state.pendingCookie = null;

  } catch (error) {

    console.error(error);

    toast(
      "Could not save that cookie. Try again."
    );

  }

  state.busy = false;

  renderAll();

}


/* =========================================================
   COOKIE CONTENT HELPERS
   ========================================================= */

function personalityFor(cookie) {

  return PERSONALITIES.find(
    item =>
      item.id === cookie.personalityId
  );

}


function stickerFor(cookie) {

  const personality =
    personalityFor(cookie);

  return personality?.stickers.find(
    item =>
      item.id === cookie.stickerId
  );

}


function countryFor(cookie) {

  return COUNTRIES.find(
    item =>
      item.id === cookie.countryId
  );

}


function cookieTitle(cookie) {

  if (cookie.type === "personality") {

    return `${personalityFor(cookie)?.name || "Personality"} Cookie`;

  }

  if (cookie.type === "country") {

    const country =
      countryFor(cookie);

    return `${country?.food || "Country Treat"} Fortune`;

  }

  return `${TYPE_DATA[cookie.type].label} Cookie`;

}


function cookieIcon(cookie) {

  if (cookie.type === "personality") {

    return (
      personalityFor(cookie)?.icon ||
      "🎭"
    );

  }

  if (cookie.type === "country") {

    return (
      countryFor(cookie)?.foodEmoji ||
      "🌍"
    );

  }

  return TYPE_DATA[cookie.type].icon;

}


/* =========================================================
   RENDER MACHINE
   ========================================================= */

function renderMachine() {

  if (!state.room) return;


  vendButton.disabled =
    Boolean(state.pendingCookie) ||
    state.busy;

  openButton.disabled =
    !state.pendingCookie ||
    state.busy;


  if (!state.pendingCookie) {

    machineDisplay.innerHTML = `
      <div class="cookie-stage">
        <div class="cookie-shell" style="opacity:.35">
          <div class="cookie-fallback">🥠</div>
        </div>

        <div class="stage-title">
          The tray is empty
        </div>

        <div class="stage-subtitle">
          Turn the handle.
        </div>
      </div>
    `;

    return;

  }


  const cookie =
    state.pendingCookie;


  if (cookie.type === "country") {

    const country =
      countryFor(cookie);

    machineDisplay.innerHTML = `
      <div class="cookie-stage">

        <div class="country-cookie">

          <div class="country-food">
            ${country.foodEmoji}
          </div>

          <div class="variant-overlay">
            ${country.flag} ${escapeHtml(country.country)}
          </div>

        </div>

        <div class="stage-title">
          ${escapeHtml(country.food)}
        </div>

        <div class="stage-subtitle">
          Something is inside it.
        </div>

      </div>
    `;

    return;

  }


  const personality =
    personalityFor(cookie);


  machineDisplay.innerHTML = `
    <div class="cookie-stage">

      <div class="cookie-shell ${cookie.type}">

        <img
          src="./assets/cookies/normal-closed.png"
          alt="Closed fortune cookie"
          onerror="
            this.style.display='none';
            this.nextElementSibling.style.display='grid';
          "
        >

        <div
          class="cookie-fallback"
          style="display:none">
          🥠
        </div>

        <div class="variant-overlay">
          ${TYPE_DATA[cookie.type].icon}
          ${TYPE_DATA[cookie.type].label}
        </div>

        ${
          personality
            ? `
              <div class="personality-symbol">
                ${personality.icon}
              </div>
            `
            : ""
        }

      </div>

      <div class="stage-title">
        ${escapeHtml(cookieTitle(cookie))}
      </div>

      <div class="stage-subtitle">
        ${
          cookie.type === "legendary"
            ? "This is definitely not normal."
            : cookie.type === "shiny"
            ? "It is sparkling."
            : cookie.type === "hard"
            ? "It feels worryingly solid."
            : cookie.type === "broken"
            ? "Oh."
            : cookie.type === "personality"
            ? "It has an attitude."
            : "Ready to open."
        }
      </div>

    </div>
  `;

}


function renderReveal() {

  const cookie =
    state.lastReveal;

  if (!cookie) {

    revealArea.innerHTML = "";
    return;

  }


  if (cookie.type === "hard") {

    revealArea.innerHTML = `
      <div class="reveal hard">

        <h2>🪨 Hard Cookie</h2>

        <p>
          You pull it. Twist it. Threaten it.
          Nothing happens.
        </p>

        <div class="reward-chip">
          NO FORTUNE
        </div>

      </div>
    `;

    return;

  }


  let title =
    TYPE_DATA[cookie.type].label.toUpperCase();

  let fortune =
    cookie.fortune;

  let translation = "";

  let reward = "";


  if (cookie.type === "personality") {

    const personality =
      personalityFor(cookie);

    const sticker =
      stickerFor(cookie);

    title =
      personality.name.toUpperCase();

    reward = `
      <div class="reward-chip">
        ${escapeHtml(sticker.art)}
        ${escapeHtml(sticker.label)} unlocked
      </div>
    `;

  }


  if (cookie.type === "country") {

    const country =
      countryFor(cookie);

    title =
      `${country.flag} ${country.country.toUpperCase()}`;

    translation =
      `${country.translation} · ${country.language}`;

    reward = `
      <div class="reward-chip">
        ${country.flag}
        ${escapeHtml(country.country)} stamp unlocked
      </div>
    `;

  }


  if (cookie.type === "legendary") {

    reward = `
      <div class="reward-chip">
        👑 YOU OWE ME unlocked
      </div>
    `;

  }


  revealArea.innerHTML = `
    <div class="reveal ${cookie.type}">

      <h2>
        ${cookieIcon(cookie)}
        ${escapeHtml(cookieTitle(cookie))}
      </h2>

      <div class="open-scene">

        <img
          src="./assets/cookies/normal-open.png"
          alt="Opened fortune cookie"
          onerror="
            this.style.display='none';
            this.nextElementSibling.style.display='grid';
          "
        >

        <div class="open-image-fallback"></div>

        <div class="original-title-cover"></div>

        <div class="generated-title">
          ${escapeHtml(title)}
        </div>

        <div class="generated-fortune-strip">

          <div>

            <div class="generated-fortune">
              ${escapeHtml(fortune).replace(/\n/g, "<br>")}
            </div>

            ${
              translation
                ? `
                  <div class="generated-translation">
                    ${escapeHtml(translation)}
                  </div>
                `
                : ""
            }

          </div>

        </div>

        ${
          ["shiny", "legendary"].includes(cookie.type)
            ? `<div class="open-sparkles"></div>`
            : ""
        }

      </div>

      ${reward}

    </div>
  `;

}


/* =========================================================
   COLLECTION HELPERS
   ========================================================= */

function cookiesFor(uid) {

  if (!uid) return [];

  return state.cookies.filter(
    cookie =>
      cookie.ownerUid === uid
  );

}


function countType(uid, type) {

  return cookiesFor(uid).filter(
    cookie =>
      cookie.type === type
  ).length;

}


function uniqueStickers(uid) {

  const seen =
    new Map();


  cookiesFor(uid)
    .filter(
      cookie =>
        cookie.type === "personality" &&
        cookie.personalityId &&
        cookie.stickerId
    )
    .forEach(cookie => {

      const personality =
        personalityFor(cookie);

      const sticker =
        stickerFor(cookie);

      if (!personality || !sticker) return;

      const key =
        `${personality.id}:${sticker.id}`;

      seen.set(
        key,
        {
          key,
          personality,
          sticker
        }
      );

    });


  return [...seen.values()];

}


function uniquePersonalities(uid) {

  return new Set(

    cookiesFor(uid)
      .filter(
        cookie =>
          cookie.personalityId
      )
      .map(
        cookie =>
          cookie.personalityId
      )

  );

}


function uniqueCountries(uid) {

  const seen =
    new Map();


  cookiesFor(uid)
    .filter(
      cookie =>
        cookie.type === "country" &&
        cookie.countryId
    )
    .forEach(cookie => {

      const country =
        countryFor(cookie);

      if (country) {

        seen.set(
          country.id,
          country
        );

      }

    });


  return [...seen.values()];

}


/* =========================================================
   STATS
   ========================================================= */

function renderQuickStats() {

  const uid =
    state.user.uid;

  const cookies =
    cookiesFor(uid);

  machineOwnerTitle.textContent =
    `${myName()}'s fortunes`;

  quickStats.innerHTML = `

    <div class="stat">
      <strong>${cookies.length}</strong>
      <span>Total</span>
    </div>

    <div class="stat">
      <strong>${countType(uid, "shiny")}</strong>
      <span>Shiny</span>
    </div>

    <div class="stat">
      <strong>${countType(uid, "legendary")}</strong>
      <span>Legendary</span>
    </div>

    <div class="stat">
      <strong>${cookies.filter(x => x.special).length}</strong>
      <span>Special</span>
    </div>

  `;

}


/* =========================================================
   ALBUM
   ========================================================= */

const FILTERS = [
  ["all", "All"],
  ["special", "❤️ Special"],
  ["normal", "Normal"],
  ["broken", "Broken"],
  ["hard", "Hard"],
  ["shiny", "Shiny"],
  ["legendary", "Legendary"],
  ["personality", "Personality"],
  ["country", "Country"]
];


function renderAlbumFilters() {

  albumFilters.innerHTML =
    FILTERS
      .map(([id, label]) => `
        <button
          class="filter-button ${state.albumFilter === id ? "active" : ""}"
          data-filter="${id}">
          ${label}
        </button>
      `)
      .join("");


  albumFilters
    .querySelectorAll("[data-filter]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          state.albumFilter =
            button.dataset.filter;

          renderAlbumFilters();
          renderAlbum();

        }
      );

    });

}


function albumCookies() {

  let items =
    [...state.cookies];


  if (state.albumOwner === "mine") {

    items = items.filter(
      item =>
        item.ownerUid === state.user.uid
    );

  }


  if (state.albumOwner === "partner") {

    items = items.filter(
      item =>
        item.ownerUid === partnerUid()
    );

  }


  if (state.albumFilter === "special") {

    items = items.filter(
      item =>
        item.special
    );

  } else if (state.albumFilter !== "all") {

    items = items.filter(
      item =>
        item.type === state.albumFilter
    );

  }


  return items.sort(
    (a, b) =>
      b.createdAt - a.createdAt
  );

}


function renderAlbum() {

  if (!state.room) return;

  const items =
    albumCookies();


  if (!items.length) {

    albumGrid.innerHTML = `
      <div class="card">
        <p class="muted">
          Nothing here yet.
        </p>
      </div>
    `;

  } else {

    albumGrid.innerHTML =
      items
        .map(cookie => {

          let fortune =
            cookie.fortune || "No fortune.";

          let translation = "";

          if (cookie.type === "country") {

            const country =
              countryFor(cookie);

            translation =
              country?.translation || "";

          }


          return `
            <article
              class="
                album-card
                ${cookie.type}
                ${cookie.special ? "special" : ""}
              ">

              <div class="album-owner">
                ${escapeHtml(ownerName(cookie.ownerUid))}
              </div>

              <div class="album-icon">
                ${cookieIcon(cookie)}
              </div>

              <h3>
                ${escapeHtml(cookieTitle(cookie))}
              </h3>

              <p class="album-fortune">
                ${escapeHtml(fortune)}
              </p>

              ${
                translation
                  ? `
                    <p class="muted tiny">
                      ${escapeHtml(translation)}
                    </p>
                  `
                  : ""
              }

              ${
                cookie.note
                  ? `
                    <div class="cookie-note">
                      ${escapeHtml(cookie.note)}
                    </div>
                  `
                  : ""
              }

              <div class="album-meta">
                ${formatDate(cookie.createdAt)}
              </div>

              <div class="album-actions">

                <button
                  class="icon-button"
                  data-special="${cookie.id}">
                  ${cookie.special ? "❤️ Special" : "♡ Special"}
                </button>

                <button
                  class="icon-button"
                  data-note="${cookie.id}">
                  📝 Note
                </button>

              </div>

            </article>
          `;

        })
        .join("");

  }


  albumGrid
    .querySelectorAll("[data-special]")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          const cookie =
            state.cookies.find(
              item =>
                item.id === button.dataset.special
            );

          if (!cookie) return;

          await updateDoc(
            doc(
              db,
              "rooms",
              state.roomCode,
              "cookies",
              cookie.id
            ),
            {
              special: !cookie.special,
              updatedAt: Date.now()
            }
          );

        }
      );

    });


  albumGrid
    .querySelectorAll("[data-note]")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          const cookie =
            state.cookies.find(
              item =>
                item.id === button.dataset.note
            );

          if (!cookie) return;

          const note = prompt(
            "Add a note to this fortune:",
            cookie.note || ""
          );

          if (note === null) return;

          await updateDoc(
            doc(
              db,
              "rooms",
              state.roomCode,
              "cookies",
              cookie.id
            ),
            {
              note: note.trim(),
              updatedAt: Date.now()
            }
          );

        }
      );

    });


  renderCollectibles();
  renderYoms();

}


function renderCollectibles() {

  const stickers =
    uniqueStickers(state.user.uid);

  const stamps =
    uniqueCountries(state.user.uid);


  stickersGrid.innerHTML =
    stickers.length
      ? stickers
          .map(item => `
            <div class="collectible">

              <div class="collectible-art">
                ${escapeHtml(item.sticker.art)}
              </div>

              <div class="collectible-name">
                ${escapeHtml(item.personality.name)}
                ·
                ${escapeHtml(item.sticker.label)}
              </div>

            </div>
          `)
          .join("")
      : `
        <p class="muted">
          No personality stickers yet.
        </p>
      `;


  stampsGrid.innerHTML =
    stamps.length
      ? stamps
          .map(country => `
            <div class="collectible">

              <div class="collectible-art">
                ${country.flag}
              </div>

              <div class="collectible-name">
                ${escapeHtml(country.country)}
              </div>

            </div>
          `)
          .join("")
      : `
        <p class="muted">
          No country stamps yet.
        </p>
      `;

}


/* =========================================================
   YOMS
   ========================================================= */

function renderYoms() {

  if (!state.room) return;


  if (!state.yoms.length) {

    yomList.innerHTML = `
      <p class="muted">
        No Legendary YOMs yet.
      </p>
    `;

    return;

  }


  yomList.innerHTML =
    state.yoms.map(yom => {

      const mine =
        yom.ownerUid === state.user.uid;

      const owner =
        ownerName(yom.ownerUid);


      let buttons = "";


      if (
        mine &&
        yom.status === "unused"
      ) {

        buttons = `
          <button
            class="button gold"
            data-yom-request="${yom.id}">
            Make request
          </button>
        `;

      }


      if (
        !mine &&
        yom.status === "requested"
      ) {

        buttons = `
          <button
            class="button gold"
            data-yom-accept="${yom.id}">
            Accept YOM
          </button>
        `;

      }


      if (
        !mine &&
        yom.status === "accepted"
      ) {

        buttons = `
          <button
            class="button gold"
            data-yom-fulfill="${yom.id}">
            Mark fulfilled
          </button>
        `;

      }


      return `
        <div class="yom-card">

          <h3>
            👑 YOU OWE ME
          </h3>

          <p>
            <strong>Owner:</strong>
            ${escapeHtml(owner)}
          </p>

          <p>
            <strong>Status:</strong>
            ${escapeHtml(yom.status)}
          </p>

          ${
            yom.request
              ? `
                <p>
                  <strong>Request:</strong>
                  ${escapeHtml(yom.request)}
                </p>
              `
              : ""
          }

          ${buttons}

        </div>
      `;

    }).join("");


  yomList
    .querySelectorAll("[data-yom-request]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          requestYom(
            button.dataset.yomRequest
          )
      );

    });


  yomList
    .querySelectorAll("[data-yom-accept]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          updateYomStatus(
            button.dataset.yomAccept,
            "accepted"
          )
      );

    });


  yomList
    .querySelectorAll("[data-yom-fulfill]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          updateYomStatus(
            button.dataset.yomFulfill,
            "fulfilled"
          )
      );

    });

}


async function requestYom(id) {

  const request = prompt(
    "You found a Legendary YOM. What do you want?"
  );

  if (!request?.trim()) return;


  const batch =
    writeBatch(db);


  const yomRef =
    doc(
      db,
      "rooms",
      state.roomCode,
      "yoms",
      id
    );


  batch.update(
    yomRef,
    {
      request: request.trim(),
      status: "requested",
      updatedAt: Date.now()
    }
  );


  const messageRef =
    doc(roomCollection("messages"));


  batch.set(
    messageRef,
    {
      senderUid: state.user.uid,
      type: "text",
      text: `👑 YOM REQUEST: ${request.trim()}`,
      collectible: null,
      createdAt: Date.now()
    }
  );


  await batch.commit();

}


async function updateYomStatus(
  id,
  status
) {

  await updateDoc(
    doc(
      db,
      "rooms",
      state.roomCode,
      "yoms",
      id
    ),
    {
      status,
      updatedAt: Date.now()
    }
  );

}


/* =========================================================
   CHAT
   ========================================================= */

function renderChat() {

  if (!state.room) return;


  if (!state.messages.length) {

    messageList.innerHTML = `
      <p class="muted">
        No messages yet.
      </p>
    `;

  } else {

    messageList.innerHTML =
      state.messages.map(message => {

        const mine =
          message.senderUid === state.user.uid;


        return `
          <div class="message ${mine ? "mine" : ""}">

            <div class="message-sender">
              ${escapeHtml(ownerName(message.senderUid))}
            </div>

            ${
              message.type === "collectible"
                ? renderMessageCollectible(
                    message.collectible
                  )
                : `
                  <div>
                    ${escapeHtml(message.text || "")}
                  </div>
                `
            }

            <div class="message-time">
              ${formatDate(message.createdAt)}
            </div>

          </div>
        `;

      }).join("");

  }


  messageList.scrollTop =
    messageList.scrollHeight;


  renderCollectiblePicker();

}


function renderCollectiblePicker() {

  const options = [
    `<option value="">
      Choose an unlocked sticker or stamp
    </option>`
  ];


  uniqueStickers(state.user.uid)
    .forEach(item => {

      options.push(`
        <option
          value="sticker|${item.personality.id}|${item.sticker.id}">
          ${escapeHtml(item.sticker.art)}
          ${escapeHtml(item.personality.name)}
          —
          ${escapeHtml(item.sticker.label)}
        </option>
      `);

    });


  uniqueCountries(state.user.uid)
    .forEach(country => {

      options.push(`
        <option
          value="stamp|${country.id}">
          ${country.flag}
          ${escapeHtml(country.country)} stamp
        </option>
      `);

    });


  collectibleSelect.innerHTML =
    options.join("");


  const quick = [

    ...uniqueStickers(state.user.uid)
      .map(item => ({
        key:
          `sticker|${item.personality.id}|${item.sticker.id}`,
        art:
          item.sticker.art
      })),

    ...uniqueCountries(state.user.uid)
      .map(country => ({
        key:
          `stamp|${country.id}`,
        art:
          country.flag
      }))

  ].slice(0, 12);


  quickCollectibles.innerHTML =
    quick.map(item => `
      <button
        class="quick-collectible"
        data-quick="${escapeHtml(item.key)}">
        ${escapeHtml(item.art)}
      </button>
    `).join("");


  quickCollectibles
    .querySelectorAll("[data-quick]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          sendCollectibleKey(
            button.dataset.quick
          )
      );

    });

}


async function sendTextMessage() {

  const text =
    messageInput.value.trim();

  if (!text) return;


  await addDoc(
    roomCollection("messages"),
    {
      senderUid: state.user.uid,
      type: "text",
      text,
      collectible: null,
      createdAt: Date.now()
    }
  );


  messageInput.value = "";

}


async function sendSelectedCollectible() {

  const key =
    collectibleSelect.value;

  if (!key) return;

  await sendCollectibleKey(key);

}


async function sendCollectibleKey(key) {

  const parts =
    key.split("|");


  let collectible;


  if (parts[0] === "sticker") {

    const personality =
      PERSONALITIES.find(
        x =>
          x.id === parts[1]
      );

    const sticker =
      personality?.stickers.find(
        x =>
          x.id === parts[2]
      );

    if (!personality || !sticker) return;


    const owned =
      uniqueStickers(state.user.uid)
        .some(
          item =>
            item.personality.id === personality.id &&
            item.sticker.id === sticker.id
        );

    if (!owned) return;


    collectible = {
      kind: "sticker",
      personalityId: personality.id,
      stickerId: sticker.id
    };

  } else {

    const country =
      COUNTRIES.find(
        x =>
          x.id === parts[1]
      );

    if (!country) return;


    const owned =
      uniqueCountries(state.user.uid)
        .some(
          item =>
            item.id === country.id
        );

    if (!owned) return;


    collectible = {
      kind: "stamp",
      countryId: country.id
    };

  }


  await addDoc(
    roomCollection("messages"),
    {
      senderUid: state.user.uid,
      type: "collectible",
      text: "",
      collectible,
      createdAt: Date.now()
    }
  );

}


function renderMessageCollectible(
  collectible
) {

  if (!collectible) return "";


  if (collectible.kind === "sticker") {

    const personality =
      PERSONALITIES.find(
        x =>
          x.id === collectible.personalityId
      );

    const sticker =
      personality?.stickers.find(
        x =>
          x.id === collectible.stickerId
      );


    return `
      <div class="message-collectible">

        ${escapeHtml(sticker?.art || "🎭")}

        <small>
          ${escapeHtml(personality?.name || "Personality")}
          ·
          ${escapeHtml(sticker?.label || "Sticker")}
        </small>

      </div>
    `;

  }


  if (collectible.kind === "stamp") {

    const country =
      COUNTRIES.find(
        x =>
          x.id === collectible.countryId
      );


    return `
      <div class="message-collectible">

        ${country?.flag || "🌍"}

        <small>
          ${escapeHtml(country?.country || "Country")}
          stamp
        </small>

      </div>
    `;

  }


  return "";

}


/* =========================================================
   ACHIEVEMENTS
   ========================================================= */

function playerMetrics(uid) {

  const cookies =
    cookiesFor(uid);


  return {

    total:
      cookies.length,

    normal:
      countType(uid, "normal"),

    broken:
      countType(uid, "broken"),

    hard:
      countType(uid, "hard"),

    shiny:
      countType(uid, "shiny"),

    legendary:
      countType(uid, "legendary"),

    personality:
      countType(uid, "personality"),

    country:
      countType(uid, "country"),

    special:
      cookies.filter(
        cookie =>
          cookie.special
      ).length,

    personalities:
      uniquePersonalities(uid).size,

    stickers:
      uniqueStickers(uid).length,

    stamps:
      uniqueCountries(uid).length,

    messages:
      state.messages.filter(
        message =>
          message.senderUid === uid
      ).length

  };

}


function sharedMetrics() {

  const first =
    state.room.member1;

  const second =
    state.room.member2;


  const firstPersonalities =
    uniquePersonalities(first);

  const secondPersonalities =
    uniquePersonalities(second);


  const sharedPersonality =
    [...firstPersonalities]
      .some(
        id =>
          secondPersonalities.has(id)
      )
      ? 1
      : 0;


  const countries =
    new Set([

      ...uniqueCountries(first)
        .map(x => x.id),

      ...uniqueCountries(second)
        .map(x => x.id)

    ]);


  return {

    totalCookies:
      state.cookies.length,

    messages:
      state.messages.length,

    special:
      state.cookies.filter(
        cookie =>
          cookie.special
      ).length,

    countries:
      countries.size,

    sharedPersonality,

    playersWithLegendary:
      [
        countType(first, "legendary") > 0,
        second &&
          countType(second, "legendary") > 0
      ].filter(Boolean).length

  };

}


function achievementMarkup(
  achievement,
  metrics
) {

  const value =
    achievement.value(metrics);

  const unlocked =
    value >= achievement.target;

  const percent =
    Math.min(
      100,
      Math.round(
        value /
        achievement.target *
        100
      )
    );


  return `
    <div
      class="
        achievement
        ${unlocked ? "unlocked" : "locked"}
      ">

      <div class="achievement-icon">
        ${unlocked ? achievement.icon : "🔒"}
      </div>

      <div>

        <strong>
          ${escapeHtml(achievement.name)}
        </strong>

        <p class="muted tiny">
          ${escapeHtml(achievement.description)}
        </p>

        <div class="progress">
          <div style="width:${percent}%"></div>
        </div>

        <div class="tiny muted">
          ${Math.min(value, achievement.target)}
          /
          ${achievement.target}
        </div>

      </div>

    </div>
  `;

}


function renderAchievements() {

  if (!state.room) return;


  const mine =
    playerMetrics(state.user.uid);

  const shared =
    sharedMetrics();


  achievementList.innerHTML =
    INDIVIDUAL_ACHIEVEMENTS
      .map(
        achievement =>
          achievementMarkup(
            achievement,
            mine
          )
      )
      .join("");


  sharedAchievementList.innerHTML =
    SHARED_ACHIEVEMENTS
      .map(
        achievement =>
          achievementMarkup(
            achievement,
            shared
          )
      )
      .join("");

}


/* =========================================================
   COMPARE
   ========================================================= */

function compareCard(
  uid,
  name
) {

  if (!uid) {

    return `
      <article class="compare-card">
        <h2>Waiting for partner</h2>
        <p class="muted">
          Share the room code so they can join.
        </p>
      </article>
    `;

  }


  const metrics =
    playerMetrics(uid);


  const rows = [

    ["All cookies", metrics.total],
    ["🥠 Normal", metrics.normal],
    ["💔 Broken", metrics.broken],
    ["🪨 Hard", metrics.hard],
    ["✨ Shiny", metrics.shiny],
    ["👑 Legendary", metrics.legendary],
    ["🎭 Personality", metrics.personality],
    ["🌍 Country", metrics.country],
    ["❤️ Special", metrics.special],
    ["Personas met", metrics.personalities],
    ["Stickers", metrics.stickers],
    ["Country stamps", metrics.stamps],
    ["Messages sent", metrics.messages]

  ];


  return `
    <article class="compare-card">

      <h2>
        ${escapeHtml(name)}
      </h2>

      ${
        rows.map(
          ([label, value]) => `
            <div class="compare-stat">
              <span>${label}</span>
              <strong>${value}</strong>
            </div>
          `
        ).join("")
      }

    </article>
  `;

}


function renderCompare() {

  if (!state.room) return;


  compareGrid.innerHTML =

    compareCard(
      state.room.member1,
      state.room.member1Name
    )

    +

    compareCard(
      state.room.member2,
      state.room.member2Name ||
      "Partner"
    );

}


/* =========================================================
   SETTINGS
   ========================================================= */

function renderSettings() {

  if (!state.room) return;


  settingsRoomCode.textContent =
    state.roomCode;

  headerRoomCode.textContent =
    state.roomCode;

  headerPlayerName.textContent =
    myName();

  renameInput.value =
    myName();

  accountEmail.textContent =
    state.user.email || "";

  ownerControls.classList.toggle(
    "hidden",
    !isRoomOwner()
  );

}


async function copyText(value) {

  try {

    await navigator.clipboard.writeText(
      value
    );

    toast("Copied.");

  } catch {

    prompt(
      "Copy this:",
      value
    );

  }

}


function copyRoomCode() {

  copyText(state.roomCode);

}


function copyInvite() {

  const url =
    new URL(location.href);

  url.search = "";

  url.searchParams.set(
    "room",
    state.roomCode
  );

  copyText(url.toString());

}


async function installApp() {

  if (state.installPrompt) {

    state.installPrompt.prompt();

    await state.installPrompt.userChoice;

    state.installPrompt = null;

    return;

  }

  alert(
    "If the install prompt is not available, use your browser menu and choose Add to Home Screen / Install App."
  );

}


/* =========================================================
   FULL RENDER
   ========================================================= */

function renderAll() {

  if (!state.room || !state.user) return;

  renderMachine();
  renderReveal();

  renderQuickStats();

  renderAlbumFilters();
  renderAlbum();

  renderChat();

  renderAchievements();

  renderCompare();

  renderSettings();

}


/* =========================================================
   UTILITIES
   ========================================================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function formatDate(timestamp) {

  if (!timestamp) return "";

  return new Date(timestamp)
    .toLocaleString();

}


let toastTimer;


function toast(message) {

  toastBox.textContent =
    message;

  toastBox.classList.add(
    "show"
  );

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(
      () =>
        toastBox.classList.remove(
          "show"
        ),
      2400
    );

}


function friendlyFirebaseError(
  error
) {

  const code =
    error?.code || "";

  if (
    code.includes("invalid-credential") ||
    code.includes("wrong-password")
  ) {

    return "Email or password is incorrect.";

  }

  if (
    code.includes("email-already-in-use")
  ) {

    return "That email already has an account.";

  }

  if (
    code.includes("weak-password")
  ) {

    return "Use a password at least 6 characters long.";

  }

  if (
    code.includes("invalid-email")
  ) {

    return "That email address is invalid.";

  }

  if (
    code.includes("network")
  ) {

    return "Network error. Check your connection.";

  }

  return (
    error?.message ||
    "Something went wrong."
  );

}