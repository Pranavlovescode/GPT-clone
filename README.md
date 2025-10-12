# 🤖 ChatGPT Clone

![ChatGPT Clone](https://img.shields.io/badge/ChatGPT-Clone-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-blue)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-blue)

A fully functional and responsive ChatGPT clone built with Next.js, React, and TailwindCSS. This project replicates the look and feel of OpenAI's ChatGPT interface with key features like conversation history, chat messaging, and a responsive design.

![ChatGPT Clone Screenshot](https://via.placeholder.com/800x400?text=ChatGPT+Clone+Screenshot)

## ✨ Features

- 💬 **Interactive Chat Interface** - Realistic chat bubbles with user/AI distinction
- 📱 **Fully Responsive Design** - Works seamlessly on mobile, tablet, and desktop 
- 🌙 **Dark/Light Mode Support** - Automatic theme switching based on system preferences
- 📝 **Markdown Support** - AI responses can include rich text formatting
- 📚 **Conversation History** - Browse and revisit previous conversations
- ⚡ **Fast & Lightweight** - Built with performance in mind

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Pranavlovescode/GPT-clone.git
cd chatgpt-clone
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **State Management**: React Context API

## 📂 Project Structure

```
chatgpt-clone/
├── public/               # Static files
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── globals.css   # Global styles
│   │   ├── layout.js     # Root layout
│   │   └── page.js       # Home page
│   ├── components/       # React components
│   │   ├── chat/         # Chat components
│   │   ├── sidebar/      # Sidebar components
│   │   └── MainLayout.js # Main layout wrapper
│   ├── context/          # React context providers
│   │   └── ChatContext.js # Chat state management
│   └── utils/            # Utility functions
│       └── mockData.js   # Sample conversation data
└── README.md             # Project documentation
```

## 🔧 Configuration

### Customizing the UI

You can customize the appearance by editing the TailwindCSS configuration in `tailwind.config.js` and the global styles in `src/app/globals.css`.

### Adding Real AI Integration

To integrate with a real AI service like OpenAI:

1. Create an API route in `src/app/api/chat/route.js`
2. Update the `sendMessage` function in `src/context/ChatContext.js` to call your API
3. Handle API responses appropriately

## 📝 Future Enhancements

- [ ] Save conversations to a database
- [ ] Voice input/output capabilities
- [ ] File attachment and image analysis
- [ ] Custom AI model selection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🧑🏻‍💻 Contributors

This project was developed as a group effort by:

| Name | GitHub | Role |
|------|--------|------|
| Pranav Titambe | [Pranavlovescode](https://github.com/Pranavlovescode) 
| Siddhant Sathe | [SiddhantSathe](https://github.com/SiddhantSathe)
| Pranav Pol | [PranavPol-01](https://github.com/PranavPol-01)
| Aranav Sawant | [arnavsawant9](https://github.com/arnavsawant9)

> Please replace the placeholder names, usernames, and roles with your actual team members' information.

## 🙏🏻 Acknowledgments

- Inspired by [OpenAI's ChatGPT](https://chat.openai.com)
- Built with [Next.js](https://nextjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Created with ❤️ by the ChatGPT Clone Team
