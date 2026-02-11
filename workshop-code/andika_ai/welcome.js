const translations = {
  en: {
    title: 'Andika AI',
    desc: 'To get started, we need to initialize the built-in AI model on your device. This will happen locally and preserve your privacy.',
    initBtn: 'Initiate Setup',
    statusReady: 'Ready to download',
    statusChecking: 'Checking model availability...',
    contentNotAvailable: 'Built-in AI is not available in your browser. Ensure you have the necessary flags enabled.',
    downloading: 'Downloading model components...',
    readyToUse: 'Setup complete! You can now use the AI tools.',
    openSidePanel: 'Open AI Assistant',
    error: 'An error occurred: '
  },
  fr: {
    title: 'Andika AI',
    desc: 'Pour commencer, nous devons initialiser le modèle d\'IA intégré sur votre appareil. Cela se passera localement pour préserver votre vie privée.',
    initBtn: 'Lancer l\'installation',
    statusReady: 'Prêt pour le téléchargement',
    statusChecking: 'Vérification de la disponibilité du modèle...',
    contentNotAvailable: 'L\'IA intégrée n\'est pas disponible dans votre navigateur. Vérifiez que les flags nécessaires sont activés.',
    downloading: 'Téléchargement des composants du modèle...',
    readyToUse: 'Installation terminée ! Vous pouvez maintenant utiliser les outils d\'IA.',
    openSidePanel: 'Ouvrir l\'Assistant IA',
    error: 'Une erreur est survenue : '
  }
};

const userLang = navigator.language.startsWith('fr') ? 'fr' : 'en';
const t = translations[userLang];

document.addEventListener('DOMContentLoaded', () => {
  // Set translated text
  document.getElementById('welcome-title').textContent = t.title;
  document.getElementById('welcome-desc').textContent = t.desc;
  document.getElementById('init-btn').textContent = t.initBtn;
  document.getElementById('status').textContent = t.statusReady;

  const initBtn = document.getElementById('init-btn');
  const statusDiv = document.getElementById('status');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');

  initBtn.addEventListener('click', async () => {
    initBtn.disabled = true;
    statusDiv.textContent = t.statusChecking;

    if (!('LanguageModel' in self)) {
      statusDiv.textContent = t.contentNotAvailable;
      statusDiv.style.color = 'red';
      return;
    }

    try {
      const availabilityResult = await self.LanguageModel.availability();
      const available = availabilityResult.available || availabilityResult; // Handle different API versions

      if (available === 'no') {
        statusDiv.textContent = t.contentNotAvailable;
        statusDiv.style.color = 'red';
        return;
      }

      statusDiv.textContent = t.downloading;
      progressContainer.style.display = 'block';

      const session = await self.LanguageModel.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = (e.loaded / e.total) * 100;
            progressBar.style.width = `${progress}%`;
          });
        }
      });

      statusDiv.textContent = t.readyToUse;
      progressBar.style.width = '100%';
      initBtn.textContent = t.openSidePanel;
      initBtn.disabled = false;
      
      initBtn.onclick = () => {
          // Close the welcome page or redirect
          window.close();
      };

    } catch (e) {
      statusDiv.textContent = t.error + e.message;
      statusDiv.style.color = 'red';
      initBtn.disabled = false;
    }
  });
});
