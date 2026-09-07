const moves = [
  {
    label: "Move one · White",
    notation: "Nf3",
    from: "G1",
    to: "F3",
    instruction: "Move White’s knight from G1 to F3.",
    consequence: "The knight supports D4 and watches E5 while White keeps several openings available.",
    observation: "Which two central squares does White’s knight now influence?"
  },
  {
    label: "Move one · Black",
    notation: "… Nf6",
    from: "G8",
    to: "F6",
    instruction: "Move Black’s knight from G8 to F6.",
    consequence: "Black mirrors the idea, contesting E4 and D5 without fixing the pawn structure.",
    observation: "What choices has Black preserved by developing before moving a central pawn?"
  },
  {
    label: "Move two · White",
    notation: "c4",
    from: "C2",
    to: "C4",
    instruction: "Push White’s C-pawn from C2 to C4.",
    consequence: "White gains space and challenges Black’s control of D5.",
    observation: "Look only at the board. Which central square is White preparing to pressure?"
  },
  {
    label: "Move two · Black",
    notation: "… g6",
    from: "G7",
    to: "G6",
    instruction: "Advance Black’s G-pawn from G7 to G6.",
    consequence: "A long diagonal opens for the dark-squared bishop, and Black prepares a sheltered king.",
    observation: "Before revealing the next move, find the diagonal Black has just opened."
  },
  {
    label: "Move three · White",
    notation: "Nc3",
    from: "B1",
    to: "C3",
    instruction: "Develop White’s knight from B1 to C3.",
    consequence: "White adds another defender to D5 and increases control of the center.",
    observation: "Which White pawn can now advance with both knights helping the center?"
  },
  {
    label: "Move three · Black",
    notation: "… Bg7",
    from: "F8",
    to: "G7",
    instruction: "Move Black’s bishop from F8 to G7.",
    consequence: "The bishop takes the long diagonal and aims through the center toward B2.",
    observation: "Trace the bishop’s line from G7. Which pieces currently interrupt it?"
  },
  {
    label: "Move four · White",
    notation: "d4",
    from: "D2",
    to: "D4",
    instruction: "Advance White’s D-pawn from D2 to D4.",
    consequence: "White makes the first broad claim in the center and supports the pawn on C4.",
    observation: "White now has space. Which central pawn has become the base of that claim?"
  },
  {
    label: "Move four · Black",
    notation: "… O-O",
    from: "E8",
    to: "G8",
    instruction: "Castle Black’s king from E8 to G8, and place the rook from H8 on F8.",
    consequence: "Black completes kingside safety before striking at White’s center.",
    observation: "Compare development, space, and king safety. Which side leads in each category?"
  },
  {
    label: "Move five · White",
    notation: "Bf4",
    from: "C1",
    to: "F4",
    instruction: "Develop White’s bishop from C1 to F4.",
    consequence: "The bishop leaves the back rank and adds pressure along the dark squares.",
    observation: "What did White’s fourth move have to clear before this bishop could develop?"
  },
  {
    label: "Move five · Black",
    notation: "… d5",
    from: "D7",
    to: "D5",
    instruction: "Strike with Black’s D-pawn from D7 to D5.",
    consequence: "Black challenges White’s center immediately rather than allowing it to settle.",
    observation: "If White does nothing, where can the central tension be released?"
  },
  {
    label: "Move six · White",
    notation: "Qb3",
    from: "D1",
    to: "B3",
    instruction: "Move White’s queen from D1 to B3.",
    consequence: "The queen eyes B7 and adds another attacker to the pressure on D5.",
    observation: "Find both targets of White’s queen from B3. Which one is harder for Black to ignore?"
  },
  {
    label: "Move six · Black",
    notation: "… dxc4",
    from: "D5",
    to: "C4",
    instruction: "Remove White’s pawn from C4, then move Black’s D-pawn from D5 to C4.",
    consequence: "Black releases the center on chosen terms and asks White’s queen to recover the pawn.",
    observation: "The excerpt ends here. Before resetting, describe what changed in the center—not just what was captured."
  }
];

const ui = {
  sleeve: document.querySelector("#move-sleeve"),
  sealed: document.querySelector("#sealed-state"),
  revealed: document.querySelector("#revealed-state"),
  label: document.querySelector("#move-label"),
  notation: document.querySelector("#move-notation"),
  from: document.querySelector("#move-from"),
  to: document.querySelector("#move-to"),
  instruction: document.querySelector("#move-instruction"),
  consequence: document.querySelector("#move-consequence"),
  observation: document.querySelector("#observation-card"),
  observationText: document.querySelector("#observation-text"),
  previous: document.querySelector("#previous-move"),
  next: document.querySelector("#next-move"),
  hear: document.querySelector("#hear-move"),
  reset: document.querySelector("#reset-demo"),
  current: document.querySelector("#progress-current"),
  total: document.querySelector("#progress-total"),
  progress: document.querySelector("#progress-bar"),
  status: document.querySelector("#console-status"),
  conceptOpen: document.querySelector("#open-concept"),
  conceptClose: document.querySelector("#close-concept"),
  conceptDialog: document.querySelector("#concept-dialog")
};

let currentMove = -1;
let speaking = false;

ui.total.textContent = String(moves.length);

function stopNarration() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  speaking = false;
  ui.hear.classList.remove("is-speaking");
  ui.hear.innerHTML = '<span class="audio-icon" aria-hidden="true">◖</span> Hear instruction';
}

function renderMove(announce = true) {
  stopNarration();

  const isClosed = currentMove < 0;
  const isLast = currentMove === moves.length - 1;

  ui.sealed.hidden = !isClosed;
  ui.revealed.hidden = isClosed;
  ui.observation.hidden = isClosed;
  ui.previous.disabled = isClosed;
  ui.hear.disabled = isClosed || !("speechSynthesis" in window);
  ui.current.textContent = String(Math.max(0, currentMove + 1));
  ui.progress.style.width = `${Math.max(0, ((currentMove + 1) / moves.length) * 100)}%`;

  if (isClosed) {
    ui.next.disabled = false;
    ui.next.innerHTML = 'Reveal first move <span aria-hidden="true">→</span>';
    ui.status.textContent = "Your move strip is closed.";
    return;
  }

  const move = moves[currentMove];
  ui.label.textContent = move.label;
  ui.notation.textContent = move.notation;
  ui.from.textContent = move.from;
  ui.to.textContent = move.to;
  ui.instruction.textContent = move.instruction;
  ui.consequence.textContent = move.consequence;
  ui.observationText.textContent = move.observation;

  ui.revealed.classList.remove("reveal-in");
  ui.observation.classList.remove("is-new");
  requestAnimationFrame(() => {
    ui.revealed.classList.add("reveal-in");
    ui.observation.classList.add("is-new");
  });

  ui.next.disabled = isLast;
  ui.next.innerHTML = isLast
    ? 'Excerpt complete <span aria-hidden="true">◇</span>'
    : 'Reveal next move <span aria-hidden="true">→</span>';
  ui.status.textContent = isLast
    ? "Excerpt complete. The identities, history, and result remain sealed."
    : `${move.label} is open. Play it, let the board settle, then continue.`;

  if (announce) {
    ui.sleeve.dataset.move = String(currentMove + 1);
  }
}

function nextMove() {
  if (currentMove < moves.length - 1) {
    currentMove += 1;
    renderMove();
  }
}

function previousMove() {
  if (currentMove >= 0) {
    currentMove -= 1;
    renderMove();
  }
}

function resetDemo() {
  currentMove = -1;
  renderMove(false);
}

function selectNarratorVoice() {
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const preferred = voices.find((voice) => /daniel|arthur|george|alex|david/i.test(voice.name));
  return preferred || voices[0] || null;
}

function hearCurrentMove() {
  if (currentMove < 0 || !("speechSynthesis" in window)) return;

  if (speaking) {
    stopNarration();
    ui.status.textContent = "Narration stopped.";
    return;
  }

  stopNarration();
  const move = moves[currentMove];
  const utterance = new SpeechSynthesisUtterance(`${move.label}. ${move.instruction}`);
  const voice = selectNarratorVoice();

  if (voice) utterance.voice = voice;
  utterance.rate = 0.82;
  utterance.pitch = 0.88;
  utterance.volume = 1;

  utterance.onstart = () => {
    speaking = true;
    ui.hear.classList.add("is-speaking");
    ui.hear.innerHTML = '<span class="audio-icon" aria-hidden="true">■</span> Stop narration';
    ui.status.textContent = `Playing the instruction for ${move.label.toLowerCase()}.`;
  };

  utterance.onend = () => {
    speaking = false;
    ui.hear.classList.remove("is-speaking");
    ui.hear.innerHTML = '<span class="audio-icon" aria-hidden="true">◖</span> Hear instruction';
    ui.status.textContent = "Instruction complete. Let the new position settle.";
  };

  utterance.onerror = () => {
    speaking = false;
    ui.hear.classList.remove("is-speaking");
    ui.hear.innerHTML = '<span class="audio-icon" aria-hidden="true">◖</span> Hear instruction';
    ui.status.textContent = "Narration is unavailable in this browser. The written move remains exact.";
  };

  window.speechSynthesis.speak(utterance);
}

ui.next.addEventListener("click", nextMove);
ui.previous.addEventListener("click", previousMove);
ui.reset.addEventListener("click", resetDemo);
ui.hear.addEventListener("click", hearCurrentMove);

if (!("speechSynthesis" in window)) {
  ui.hear.title = "Audio narration is not supported by this browser.";
}

if (ui.conceptDialog && typeof ui.conceptDialog.showModal === "function") {
  ui.conceptOpen.addEventListener("click", () => ui.conceptDialog.showModal());
  ui.conceptClose.addEventListener("click", () => ui.conceptDialog.close());
  ui.conceptDialog.addEventListener("click", (event) => {
    const bounds = ui.conceptDialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) ui.conceptDialog.close();
  });
} else {
  ui.conceptOpen.addEventListener("click", () => window.open("assets/chess-archived-system.png", "_blank", "noopener,noreferrer"));
}

window.addEventListener("beforeunload", stopNarration);
renderMove(false);
