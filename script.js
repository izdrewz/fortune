const fortunes = [
  "You are doing better than your inner critic is willing to admit.",
  "Something you nearly gave up on is worth one more attempt.",
  "You have excellent taste. Evidence: you opened this cookie.",
  "Today is a suspiciously good day to back yourself.",
  "Someone thinks you're much cooler than you think you are.",
  "You are allowed to be proud before everything is perfect.",
  "A little nerve will get you further than another hour of overthinking.",
  "You have the rare ability to make chaos look intentional.",
  "Future you is begging you to stop procrastinating. Present you has muted them.",
  "Your potential is enormous. Your attention span has filed an appeal.",
  "You radiate main-character energy, occasionally from the wrong film.",
  "You have the confidence of someone who definitely did not read the instructions.",
  "Your problem-solving skills are impressive once panic gets bored.",
  "Confidence looks good on you. Guesswork is doing some heavy lifting too.",
  "You are one minor inconvenience away from becoming a local legend.",
  "A brilliant plan is forming. Unfortunately, you're involved.",
  "You survived every questionable decision that led you here. Statistically impressive.",
  "Your standards are high. Your bedtime is a public disgrace.",
  "You bring a lot to the table. Sometimes it is just problems, but still.",
  "You are not behind. You are taking the scenic route with questionable navigation.",
  "An unexpected compliment is coming. Try not to argue with it.",
  "Your luck is improving because frankly it had nowhere else to go.",
  "Be yourself. The alternatives have already complained.",
  "You are capable of incredible things, including making easy things unnecessarily complicated.",
  "You have a gift for surviving situations you absolutely helped create.",
  "Good news is coming. The awkward news can wait.",
  "You're smarter than your last decision suggests.",
  "Your aura says mysterious. Your browser tabs say overwhelmed.",
  "Do something today that would make your future self slightly less irritated.",
  "You will make an excellent decision soon. Enjoy this rare event.",
  "You're not everyone's cup of tea. Some people have terrible taste.",
  "A door is about to open for you. Try pulling before assuming it's locked.",
  "You deserve nice things. Even after that thing you said in 2019.",
  "Your charm is carrying several departments that should be doing their own work.",
  "The odds are in your favour. Please stop giving them additional challenges.",
  "You are proof that confidence can arrive before the plan does."
];

const cookieButton = document.getElementById("cookieButton");
const fortunePaper = document.getElementById("fortunePaper");
const fortuneText = document.getElementById("fortuneText");
const againButton = document.getElementById("againButton");

let lastIndex = -1;

function randomFortune() {
  if (fortunes.length === 1) return fortunes[0];
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * fortunes.length);
  } while (nextIndex === lastIndex);
  lastIndex = nextIndex;
  return fortunes[nextIndex];
}

function crackCookie() {
  fortuneText.textContent = randomFortune();
  cookieButton.classList.add("cracked");
  fortunePaper.classList.add("show");
  fortunePaper.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    againButton.hidden = false;
  }, 850);
}

function resetCookie() {
  cookieButton.classList.remove("cracked");
  fortunePaper.classList.remove("show");
  fortunePaper.setAttribute("aria-hidden", "true");
  againButton.hidden = true;
  void cookieButton.offsetWidth;
}

cookieButton.addEventListener("click", crackCookie);
againButton.addEventListener("click", resetCookie);