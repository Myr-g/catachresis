import templates from "@/app/data/prompt_generator/templates.json";
import generalWordBanks from "@/app/data/prompt_generator/general-word-banks.json";
import genreSpecificWordBanks from "@/app/data/prompt_generator/genre-word-banks.json";
import challengeRules from "@/app/data/prompt_generator/challenge-rules.json";

/** 
 * Prompt Generator Guidelines
 * 
 * The purpose of the generator is to provide a structured variety of ideas for writers
 * to inspire creativity without fully detailing a story.
 * 
 * Templates should be grammatically flexible with multiple word banks, with decently-high reusability based on the word banks used.
 * General word banks should be flexible across a wide variety of genres without being too specific towards any one in particular.
 * Genre-specific word banks should reinforce tone without making prompts overly restrictive.
 * 
 * The resulting prompt should be generally open-ended, allowing writers to have full creative
 * freedom with what they choose to write about.
 *
 * 
 * Templates should establish a narrative setup or tension, using placeholders that are
 * interchangeable to ensure a wide variety of different combinations for a single template.
 * 
 * Placeholders should not have "a", "an", or "the" before them, as that would disrupt the
 * general flow of the template and lowers reusability. Instead, they should go inside the
 * word bank itself.
 * 
 * Templates should not expect highly-specific outputs for a word bank, and should generally
 * work with most entries and across any genre.
 *
 * 
 * General word banks should work across multiple genres and avoid any overly-specific details. They
 * should be compatible with any template and encourage many different variations for any singular 
 * template.
 * 
 * Entries should be relatively short to ensure prompts read naturally.
 *
 *
 * Genre-specific word banks should be compatible with any template, while also reinforcing the tone 
 * and/or atmosphere of a given genre without making prompts too repetitive or predictable.
 * 
 * Add: expands on the general word banks, enhancing variability by providing entries
 * that are more specific to a given genre.
 * 
 * Override: replaces the general word banks that do not suit the given genre well,
 * providing a different tone or atmosphere compared to the corresponding general word bank.
 *
 * 
 * Challenge prompts provide an alternative structure for prompts, giving only elements
 * of the story and a challenge rule.
 * 
 * Challenge rules are made with the intention of getting writers a bit out of their usual
 * comfort zones to enhance their writing by providing specific narrative styles, tropes, or
 * other constraints.
 * 
 * Challenge prompts are intentionally more restrictive than standard prompts.
 */

function randomItem(array) 
{
  return array[Math.floor(Math.random() * array.length)];
}

function generatePrompt(genre)
{
  const template = randomItem(templates);
  
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const initialWordBank = generalWordBanks[key];
    let finalWordBank = initialWordBank;

    if(!initialWordBank)
    {
      return match;
    }

    if(genre && genreSpecificWordBanks[genre])
    {
      if(genreSpecificWordBanks[genre].override[key])
      {
        finalWordBank = genreSpecificWordBanks[genre].override[key];
      }

      else if(genreSpecificWordBanks[genre].add[key])
      {
        finalWordBank = [...initialWordBank, ...genreSpecificWordBanks[genre].add[key]];
      }
    }

    return randomItem(finalWordBank);
  });
}

function generateChallengePrompt(genre)
{
  let subject = Math.random() < 0.5 ? "{character_adj} {character}" : "{object}";
  let tension = Math.random() < 0.5 ? "{condition}" : "{strange_event}";
  const challenge_rule = randomItem(challengeRules);

  const template = `Write a short story or scene that:\n` +
  `- includes ${subject}\n` +
  `- takes place {location}\n` +
  `- includes a moment where ${tension}\n- rule: ${challenge_rule}`;

  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const initialWordBank = generalWordBanks[key];
    let finalWordBank = initialWordBank;

    if(!initialWordBank)
    {
      return match;
    }

    if(genre && genreSpecificWordBanks[genre])
    {
      if(genreSpecificWordBanks[genre].override[key])
      {
        finalWordBank = genreSpecificWordBanks[genre].override[key];
      }

      else if(genreSpecificWordBanks[genre].add[key])
      {
        finalWordBank = [...initialWordBank, ...genreSpecificWordBanks[genre].add[key]];
      }
    }

    return randomItem(finalWordBank);
  });
}

export {generatePrompt, generateChallengePrompt};