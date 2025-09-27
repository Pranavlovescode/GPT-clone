export const mockConversations = [
  {
    id: '1',
    title: 'How to learn JavaScript',
    messages: [
      {
        id: '1',
        content: 'What are the best resources to learn JavaScript in 2025?',
        role: 'user',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        content: `Here are some excellent resources to learn JavaScript in 2025:

1. **Interactive Platforms**
   - [freeCodeCamp](https://www.freecodecamp.org)
   - [JavaScript.info](https://javascript.info)
   - [Codecademy's JavaScript Course](https://www.codecademy.com)

2. **Documentation**
   - [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
   - [JavaScript ES2025+ features documentation](https://tc39.es)

3. **Books**
   - "Eloquent JavaScript" by Marijn Haverbeke
   - "You Don't Know JS" series by Kyle Simpson
   - "JavaScript: The Good Parts" by Douglas Crockford

4. **Video Courses**
   - Frontend Masters
   - Wes Bos's JavaScript30
   - Traversy Media YouTube channel

5. **Projects and Practice**
   - Build small applications to reinforce concepts
   - Participate in coding challenges on platforms like LeetCode or HackerRank
   - Contribute to open-source JavaScript projects

Would you like more specific recommendations based on your current skill level?`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '2',
    title: 'React project ideas',
    messages: [
      {
        id: '1',
        content: 'Can you suggest some React project ideas for a portfolio?',
        role: 'user',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        content: `Here are some React project ideas for your portfolio:

1. **Personal Dashboard**
   - Weather widget, task tracker, news feed
   - Demonstrates API integration and state management

2. **E-commerce Platform**
   - Product listings, cart functionality, checkout process
   - Shows routing, form handling, and complex state management

3. **Social Media Clone**
   - User profiles, posts, comments, likes
   - Demonstrates authentication and real-time features

4. **Project Management Tool**
   - Kanban board, task assignments, progress tracking
   - Shows drag-and-drop interfaces and team collaboration features

5. **Interactive Data Visualization**
   - Charts, graphs for an interesting dataset
   - Shows your ability to integrate with visualization libraries

6. **Recipe/Meal Planning App**
   - Search, save, and organize recipes
   - Create meal plans and shopping lists

7. **Real-time Chat Application**
   - Message threads, online status, notifications
   - Shows WebSocket integration and real-time state updates

8. **Video Streaming Platform**
   - Video playback, playlists, recommendations
   - Demonstrates media handling and complex UI components

Which of these interests you the most?`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

export const defaultMessage = {
  id: 'default',
  title: 'New Chat',
  messages: [],
};