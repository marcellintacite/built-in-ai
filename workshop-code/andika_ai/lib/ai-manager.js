/**
 * AI Manager - Centralized AI API wrapper
 * Handles Writer, Rewriter, Translator, and LanguageDetector APIs
 * Exposed as global AndikaAI object
 */

const AndikaAI = (function() {
  'use strict';

  /**
   * Check availability and create a Writer instance
   */
  async function createWriter(options = {}, onProgress = null) {
    if (!('Writer' in self)) {
      throw new Error('Writer API is not available in this browser');
    }

    const availability = await self.Writer.availability();
    
    if (availability === 'no') {
      throw new Error('Writer model is not available on this device');
    }

    const writerOptions = {
      sharedContext: options.sharedContext || '',
      tone: options.tone || 'casual',
      format: options.format || 'plain-text',
      length: options.length || 'medium',
    };

    // Try to create with language options first, fall back if not supported
    try {
      // Add language options if provided
      if (options.inputLanguages && options.inputLanguages.length > 0) {
        writerOptions.expectedInputLanguages = options.inputLanguages;
        writerOptions.expectedContextLanguages = options.inputLanguages;
      }

      if (options.outputLanguage && options.outputLanguage !== 'auto') {
        writerOptions.outputLanguage = options.outputLanguage;
      }

      if (availability === 'readily' || availability === 'available') {
        return await self.Writer.create(writerOptions);
      } else {
        return await self.Writer.create({
          ...writerOptions,
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              const progress = (e.loaded / e.total) * 100;
              if (onProgress) onProgress(progress);
              console.log(`Writer download: ${progress.toFixed(1)}%`);
            });
          }
        });
      }
    } catch (error) {
      // If language options are not supported, retry without them
      if (error.message && error.message.includes('language')) {
        console.warn('Language options not supported, falling back to basic Writer API');
        const basicOptions = {
          sharedContext: options.sharedContext || '',
          tone: options.tone || 'casual',
          format: options.format || 'plain-text',
          length: options.length || 'medium',
        };

        if (availability === 'readily' || availability === 'available') {
          return await self.Writer.create(basicOptions);
        } else {
          return await self.Writer.create({
            ...basicOptions,
            monitor(m) {
              m.addEventListener('downloadprogress', (e) => {
                const progress = (e.loaded / e.total) * 100;
                if (onProgress) onProgress(progress);
                console.log(`Writer download: ${progress.toFixed(1)}%`);
              });
            }
          });
        }
      }
      throw error;
    }
  }

  /**
   * Check availability and create a Rewriter instance
   */
  async function createRewriter(onProgress = null) {
    if (!('Rewriter' in self)) {
      throw new Error('Rewriter API is not available in this browser');
    }

    const availability = await self.Rewriter.availability();
    
    if (availability === 'no') {
      throw new Error('Rewriter model is not available on this device');
    }

    if (availability === 'readily' || availability === 'available') {
      return await self.Rewriter.create();
    } else {
      return await self.Rewriter.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = (e.loaded / e.total) * 100;
            if (onProgress) onProgress(progress);
            console.log(`Rewriter download: ${progress.toFixed(1)}%`);
          });
        }
      });
    }
  }

  /**
   * Rewrite text using the Rewriter API
   */
  async function rewriteText(text, onProgress = null) {
    const rewriter = await createRewriter(onProgress);
    return await rewriter.rewrite(text);
  }

  /**
   * Write text using the Writer API with streaming
   */
  async function writeText(prompt, options = {}, onChunk = null, onProgress = null) {
    const writer = await createWriter(options, onProgress);
    const stream = writer.writeStreaming(prompt);
    
    let fullText = '';
    for await (const chunk of stream) {
      fullText += chunk;
      if (onChunk) onChunk(chunk);
    }
    
    return fullText;
  }

  /**
   * Translate text
   */
  async function translateText(text, sourceLanguage, targetLanguage, onProgress = null) {
    if (!('Translator' in self)) {
      throw new Error('Translator API is not available in this browser');
    }

    const availability = await self.Translator.availability();
    
    if (availability === 'no') {
      throw new Error('Translator model is not available on this device');
    }

    const translatorOptions = {
      sourceLanguage,
      targetLanguage,
    };

    let translator;
    if (availability === 'readily' || availability === 'available') {
      translator = await self.Translator.create(translatorOptions);
    } else {
      translator = await self.Translator.create({
        ...translatorOptions,
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = (e.loaded / e.total) * 100;
            if (onProgress) onProgress(progress);
            console.log(`Translator download: ${progress.toFixed(1)}%`);
          });
        }
      });
    }

    return await translator.translate(text);
  }

  /**
   * Detect language of text
   */
  async function detectLanguage(text) {
    if (!('LanguageDetector' in self)) {
      throw new Error('LanguageDetector API is not available in this browser');
    }

    const availability = await self.LanguageDetector.availability();
    
    if (availability === 'no') {
      throw new Error('LanguageDetector model is not available on this device');
    }

    const detector = await self.LanguageDetector.create();
    return await detector.detect(text);
  }

  // Public API
  return {
    createWriter,
    createRewriter,
    rewriteText,
    writeText,
    translateText,
    detectLanguage,
  };
})();
