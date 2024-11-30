export function speak(text: string, lang: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const voice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang === lang);

  if (voice) {
    utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }
}
