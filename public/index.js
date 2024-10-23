
// script.js

// Select the button element by its ID


window.addEventListener('load', () => {
    const spinner = document.getElementById('spinner');

    // Set a minimum loading time (in milliseconds)
    const minimumLoadingTime = 1000; // 2 seconds

    // Hide the spinner and show the content after the minimum loading time
    setTimeout(() => {
        spinner.style.display = 'none';
        // content.style.display = 'block';
    }, minimumLoadingTime);
});
const button = document.getElementById('info')

// Add an event listener for the 'click' event
button.addEventListener('click', function() {
    // Code to execute when the button is clicked
    alert('This is your BCOS content creation assistant, ready to help you generate and organize content!, by : Moussa KHAIROUNE ');
});

// Remove the API key and assistant ID from the frontend
let threadId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeThread();
    
    document.getElementById('send-button').addEventListener('click', sendMessage);
    
    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function convertToHtml(message) {
    md = window.markdownit()
    return md.render(message);
}




function addMessage(Message, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');

    // Create a <div> element to display the message
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper');

    // Check if the message is from the user
    if (isUser) {
        // Create a <div> element for the user's input instead of <pre>
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
    
        // Set the user's message inside the <div> element using HTML (like the bot)
        messageElement.innerHTML = Message; // Assuming convertToHtml handles the formatting
        console.log(messageElement.innerHTML);
    
        // Append the <div> element inside the wrapper
        messageWrapper.appendChild(messageElement);
    } else {
        // For bot message, create a normal <div> and append the message
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        const arabicPattern = /[\u0600-\u06FF]/;
          //////
        if (arabicPattern.test(Message)) {
            messageElement.setAttribute('dir', 'rtl'); // Arabic (RTL)
        } else {
            messageElement.setAttribute('dir', 'ltr'); // French/English (LTR)
        }
        // Set the bot's message (normal HTML format)
        messageElement.innerHTML = convertToHtml(Message);
        console.log(messageElement.innerHTML);


      
    
        // Append the <div> element inside the wrapper
        messageWrapper.appendChild(messageElement);
    }
    

    // Get the typing indicator and insert the message wrapper before it
    const typingIndicator = document.getElementById('typing-indicator');
    chatMessages.insertBefore(messageWrapper, typingIndicator);

    // Scroll to the bottom of the chat container
    chatMessages.scrollTop = chatMessages.scrollHeight;
}



function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'block';
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}
async function initializeThread() {
    try {
        const response = await fetch('/api/new-thread', { method: 'POST' });
        const data = await response.json();
        threadId = data.threadId;
        console.log('Thread initialized:', threadId);
    } catch (error) {
        console.error('Error initializing thread:', error);
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Call addMessage function with the user's input wrapped in a <pre> element
    addMessage(message, true);  // true indicates it's a user message
    userInput.value = '';  // Clear the input field after sending

    // Call the bot response function with the user's input
    getBotResponse(message);
}

   
// Keep the addMessage, showTypingIndicator, and hideTypingIndicator functions as they are

async function getBotResponse(userMessage) {
    showTypingIndicator();

    try {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        if (response.ok) {
            addMessage(data.message, false);
        } else {
            throw new Error(data.error || 'Failed to get bot response');
        }
    } catch (error) {
        console.error('Error getting bot response:', error);
        addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
        hideTypingIndicator();
    }
}