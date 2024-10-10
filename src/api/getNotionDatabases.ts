import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.VITE_NOTION_API_KEY });

export async function getNotionDatabases(req, res) {
  try {
    const response = await notion.search({
      filter: { property: 'object', value: 'database' },
    });

    const databases = response.results.map((db) => ({
      id: db.id,
      title: db.title[0]?.plain_text || 'Untitled',
    }));

    return databases;
  } catch (error) {
    console.error('Error fetching Notion databases:', error);
    throw error;
  }
}