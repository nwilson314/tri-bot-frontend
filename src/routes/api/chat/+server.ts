import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const apiUrl = process.env.VITE_API_URL + "chat" || 'http://localhost:8000/chat';
    const { messages } = await request.json();

    const payload = {
      messages
    }

    const backendResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!backendResponse.ok) {
      console.error(`Error from backend: ${backendResponse.status} ${backendResponse.statusText}`);
      return new Response(JSON.stringify({ error: 'Error from backend' }), {
        status: backendResponse.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const data = await backendResponse.json();
    console.log("server response", data);

    return new Response(JSON.stringify({ response: data.result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error handling the request:', error.message);
      return new Response(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      console.error('Unexpected error:', error);
      return new Response(JSON.stringify({ error: 'Unexpected error occurred' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
};
