---
title: Hybrid Mode (Cloud)
group: Advanced
order: 6
---

# Build a hybrid AI experience

[Built-in AI](https://developer.chrome.com/docs/ai/built-in) comes with a number of benefits, most notably:

- **Local processing of sensitive data**: If you work with sensitive data, you can offer AI features to users with end-to-end encryption.
- **Offline AI usage**: Your users can access AI features, even when they're offline or have lapsed connectivity

While these benefits don't apply to cloud applications, you can ensure a seamless experience for those who cannot access built-in AI.

> **Caution**: When you fallback to the cloud, there may be legal or functional consequences for your application. If you process sensitive information, be sure to make the appropriate terms and conditions available for user review and consent.

## Get started with Firebase

1.  **[Create a Firebase project](https://console.firebase.google.com/)** and register your web application.
2.  Read the **[Firebase JavaScript SDK documentation](https://firebase.google.com/docs/web/setup)** to continue your web application setup.

Firebase projects create a Google Cloud project, with Firebase-specific configurations and services. Learn more about Google Cloud and Firebase.

## Install the SDK

This workflow uses npm and requires module bundlers or JavaScript framework tooling. **Firebase AI Logic** is optimized to work with module bundlers to eliminate unused code and decrease SDK size.

```bash
npm install firebase
```

Once installed, initialize the Firebase in your application.

## Use Firebase AI Logic

Once Firebase is installed and initialized, choose either the Gemini Developer API or the Vertex AI Gemini API, then initialize and create an instance.

Once initialized, you can prompt the model with text or multimodal input.

> **Note**: The following examples demonstrate streaming LLM responses, so you can work with chunks of output as received or the complete response.

### Text prompts

You can use plain text for your instructions to the model. For example, you could ask the model to tell you a joke.

You have some options for how the request is routed:

-   **Use the built-in AI by default** when it's available by setting the mode to `'prefer_on_device'` in the `getGenerativeModel()` function. If the built-in model isn't available, the request will fall back seamlessly to use the cloud model (if you're online).
-   **Use the cloud model by default** when you're online by setting the mode to `'prefer_in_cloud'` in the `getGenerativeModel()` function. If you're offline, the request will fall back seamlessly to use the built-in AI when available.

```javascript
// Initialize the Google AI service.
const googleAI = getAI(firebaseApp);

// Create a `GenerativeModel` instance with a model that supports your use case.
const model = getGenerativeModel(googleAI, { mode: 'prefer_on_device' });

const prompt = 'Tell me a joke';

const result = await model.generateContentStream(prompt);

for await (const chunk of result.stream) {
  const chunkText = chunk.text();
  console.log(chunkText);
}
console.log('Complete response', await result.response);
```

### Multimodal prompts

You can also prompt with image or audio, in addition to text. You could tell the model to describe an image's contents or transcribe an audio file.

Images need to be passed as a base64-encoded string as a `Firebase FileDataPart` object, which you can do with the helper function `fileToGenerativePart()`.

```javascript
// Converts a File object to a `FileDataPart` object.
// https://firebase.google.com/docs/reference/js/vertexai.filedatapart
async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const fileInputEl = document.querySelector('input[type=file]');

  fileInputEl.addEventListener('change', async () => {
    const prompt = 'Describe the contents of this image.';

    const imagePart = await fileToGenerativePart(fileInputEl.files[0]);

    // To generate text output, call generateContent with the text and image
    const result = await model.generateContentStream([prompt, imagePart]);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
    }
    console.log('Complete response: ', await result.response);
  });
```
