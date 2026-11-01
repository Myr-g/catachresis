const STORAGE_KEY = "stories";

function getStorageData(key) 
{
  if(typeof window === "undefined")
  {
    return null;
  }

  try 
  {
    return localStorage.getItem(key);
  } 
  
  catch(err) 
  {
    console.error("Error reading ${key} from localStorage", err);
    return null;
  }
}

function setStorageData(key, value) 
{
  if(typeof window === 'undefined')
  {
    return;
  }

  try 
  {
    localStorage.setItem(key, value);
  } 
  
  catch(err) 
  {
    console.error(`Error writing ${key} to localStorage`, err);
  }
}

function loadStories()
{
    const stories = getStorageData(STORAGE_KEY);
    return stories ? JSON.parse(stories) : [];
}

function saveStories(stories)
{
    setStorageData(STORAGE_KEY, JSON.stringify(stories));
}

function getStories()
{
    return loadStories();
}

function getStory(id)
{
    const stories = loadStories();

    for(const story of stories)
    {
        if(story.id === id)
        {
            return story;
        }
    }

    return null;
}

function createStory(writerId)
{
    const stories = loadStories();

    const story = {
        id: "story_" + crypto.randomUUID(),
        ownerId: writerId,
        type: "solo",
        title: "Untitled",
        genre: "",
        promptType: "none",
        prompt: "",
        promptLocked: false,
        content: "",
        collaborators: [],
        createdAt: new Date().toISOString(),
        updatedAt: null
    };

    stories.push(story);
    saveStories(stories);

    return story;
}

function saveStory(story)
{
    const stories = loadStories();

    for(let i = 0; i < stories.length; i++)
    {
        if(stories[i].id === story.id)
        {
            story.updatedAt = new Date().toISOString();
            
            if(stories[i].content.trim().length === 0 && story.content.trim().length > 0)
            {
                story.promptLocked = true;
            }
            
            stories[i] = story;
            break;
        }
    }

    saveStories(stories);
}

function deleteStory(id)
{
    const stories = loadStories();
    const storiesAfterDeletion = stories.filter(story => story.id !== id);
    saveStories(storiesAfterDeletion);
}

function formatStoryForDownload(story) 
{
  let title = "";

  if(story.title && story.title.trim() !== "")
  {
    title = story.title;
  }

  else
  {
    title = "Untitled";
  }
  
  const metadata = [];

  if(story.genre && story.genre.trim() !== "") 
  {
    metadata.push(`Genre: ${story.genre}`);
  }

  if(story.prompt && story.prompt.trim() !== "") 
  {
    metadata.push(`Prompt: ${story.prompt}`);
  }

  let content = [];

  if(story.content && story.content.trim() !== "")
  {
    content = story.content.split(/\r?\n/);
  }

  else
  {
    content = [""];
  }

  return {title: title, metadata: metadata, content: content};
}

export {
    getStories,
    getStory,
    createStory,
    saveStory,
    deleteStory,
    formatStoryForDownload
};