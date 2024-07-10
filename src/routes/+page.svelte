<script lang="ts">
	type Message = {
	  content: string;
	  role: 'user' | 'assistant';
	};
  
	let message = '';
	let messages: Message[] = [];
  
	async function sendMessage() {
	  if (message.trim() === '') return;
  
	  // Add the user's message to the messages list
	  messages = [...messages, { content: message, role: 'user' }];
  
	  try {
		const res = await fetch('/api/chat', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({ messages, message })
		});
  
		const data = await res.json();
		console.log(data);
  
		if (res.ok) {
		  // Add the agent's response to the messages list
		  console.log(data);
		  messages = [...messages, { content: data.response.content, role: 'assistant' }];
		} else {
		  console.error('Error:', data.error);
		  messages = [...messages, { content: 'Error: ' + data.error, role: 'assistant' }];
		}
	  } catch (error) {
		if (error instanceof Error) {
		  console.error('Fetch error:', error.message);
		  messages = [...messages, { content: 'Fetch error: ' + error.message, role: 'assistant' }];
		} else {
		  console.error('Unexpected error:', error);
		  messages = [...messages, { content: 'Unexpected error occurred', role: 'assistant' }];
		}
	  }
  
	  // Clear the input field after sending the message
	  message = '';
	}
  </script>
  
  <main>
	<h1>Chat with LLM</h1>
	<div class="chat-container">
	  {#each messages as { content, role }}
		<div class:agent-message={role === 'assistant'} class:user-message={role === 'user'}>
		  <strong>{role === 'user' ? 'You' : 'Assistant'}:</strong> {content}
		</div>
	  {/each}
	</div>
	<input type="text" bind:value={message} placeholder="Type your message..." />
	<button on:click={sendMessage}>Send</button>
  </main>
  
  <style>
	main {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  height: 100vh;
	  padding: 1rem;
	}
  
	.chat-container {
	  flex: 1;
	  width: 100%;
	  max-width: 600px;
	  padding: 1rem;
	  overflow-y: auto;
	  border: 1px solid #ccc;
	  margin-bottom: 1rem;
	}
  
	.agent-message {
	  text-align: left;
	  background-color: #f1f1f1;
	  color: #000;
	  padding: 0.5rem;
	  margin: 0.5rem 0;
	  border-radius: 5px;
	}
  
	.user-message {
	  text-align: right;
	  background-color: #d1f7d1;
	  color: #000;
	  padding: 0.5rem;
	  margin: 0.5rem 0;
	  border-radius: 5px;
	}
  
	input {
	  padding: 0.5rem;
	  margin-bottom: 1rem;
	  width: 100%;
	  max-width: 600px;
	  color: #000;
	}
  
	button {
	  padding: 0.5rem 1rem;
	}
  </style>
  