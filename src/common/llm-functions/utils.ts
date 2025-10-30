export async function checkAvailability() {
  const availability = await LanguageModel.availability();
  if (availability !== 'available') {
    console.error(
      'Unable to extract themes from the content due to ',
      availability,
    );
  }

  return availability === 'available';
}

export async function createPromptSession() {
  const session = await LanguageModel.create({
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        console.log(`Downloaded ${e.loaded * 100}%`);
      });
    },
  });

  return session;
}
