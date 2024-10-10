import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.VITE_NOTION_API_KEY });

export async function sendToNotion(req, res) {
  const { databaseId, title, content, category } = req.body;

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Content: {
          rich_text: [
            {
              text: {
                content: content,
              },
            },
          ],
        },
        Category: {
          select: {
            name: category,
          },
        },
        Date: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    return { message: 'Note created successfully' };
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}