# 🏔️ Two Hearts, One Summit

A cooperative climbing game designed for couples to connect, communicate, and grow closer together. Players must work together to reach the summit, using each other as holds while answering meaningful questions from "36 Questions to Fall in Love."

## 🎮 How to Play

### Setup
1. One player creates a room and shares the 6-character code
2. The other player joins using the room code
3. Both players appear as pixelated climbers on a rock wall

### Gameplay
- **Movement**: Use arrow keys or WASD to move your climber
- **Cooperation**: The route is designed so that both players must help each other
- **Body Holds**: Use your partner's body (feet, knees, hips, hands, elbows, shoulders) as climbing holds
- **Questions**: When players connect using body holds, meaningful conversation questions appear
- **Goal**: Reach the summit together while deepening your connection

### Controls
- **Arrow Keys** or **WASD**: Move up, down, left, right
- **Space** or **Enter**: Interact (future feature)
- **Mobile**: Touch controls appear automatically on mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
```bash
# Clone or download the project
cd two_hearts_one_summit

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production
```bash
npm run build
```

## 🛠️ Technical Details

### Tech Stack
- **Engine**: Three.js for 3D graphics with pixelated aesthetic
- **Multiplayer**: Local storage-based mock multiplayer (for demo)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with pixelated/retro design

### Project Structure
```
src/
├── game/
│   ├── Game.js              # Main game controller
│   ├── Renderer.js          # Three.js rendering setup
│   ├── ClimbingWall.js      # Wall and holds generation
│   ├── Player.js            # Player sprites and animations
│   ├── InputManager.js      # Keyboard and mobile controls
│   └── QuestionManager.js   # 36 Questions database
├── network/
│   └── ConnectionManager.js # Multiplayer connection (mock)
├── utils/
│   └── EventEmitter.js      # Event system
└── main.js                  # Application entry point
```

## 🎯 Features

### Core Mechanics
- ✅ Pixelated 3D climbing game
- ✅ Cooperative gameplay requiring teamwork
- ✅ Body hold system (6 attachment points per player)
- ✅ Route designed impossible to complete alone
- ✅ Real-time multiplayer via invite codes

### Question System
- ✅ All 36 Questions to Fall in Love integrated
- ✅ Progressive difficulty and intimacy levels
- ✅ Equal participation system (alternating question askers)
- ✅ Visual progress tracking
- ✅ Categories: Getting to Know You, Dreams, Vulnerability, etc.

### Visual & Audio
- ✅ Retro pixelated aesthetic
- ✅ Climbing wall with procedurally placed holds
- ✅ Player sprites with climbing gear
- ✅ Body hold indicators and visual feedback
- ✅ Emote system (hearts, question marks)

### Accessibility
- ✅ Simple controls for non-gamers
- ✅ Mobile-friendly touch controls
- ✅ Clear visual feedback and instructions
- ✅ Designed for relationship building, not competition

## 🔮 Future Plans

### Planned Features
- **Real Multiplayer**: Replace mock system with Socket.io server
- **Dynamic Questions**: Import questions based on real relationship issues
- **Multiple Mountains**: Different climbing challenges and themes
- **Customization**: Player appearance, climbing gear, wall themes
- **Progress Saving**: Remember completed questions and climbing achievements

### Long-term Vision
- Integration with relationship counseling platforms
- AI-generated questions based on couple's specific needs
- Multiple game modes (speed climbing, puzzle solving, etc.)
- Community features for sharing climbing photos and progress

## 👥 Target Audience

**Primary**: Long-distance couples seeking meaningful shared activities
**Secondary**: New couples wanting to deepen their connection
**Tertiary**: Relationship counselors looking for interactive tools

## 🎨 Design Philosophy

- **Simplicity First**: Easy enough for anyone to play, regardless of gaming experience
- **Connection Over Competition**: Designed to bring people together, not compete
- **Meaningful Interaction**: Every game mechanic serves relationship building
- **Inclusive Design**: Accessible to all technical skill levels

## 🤝 Contributing

This is a personal project created for couples to connect. If you'd like to contribute:

1. Focus on relationship-building features
2. Maintain simplicity and accessibility
3. Test with real couples for feedback
4. Prioritize emotional connection over technical complexity

## 📝 License

This project is created for educational and personal use. The "36 Questions to Fall in Love" are based on Dr. Arthur Aron's research and are used for their intended purpose of fostering human connection.

---

**Built with ❤️ for couples everywhere**

*"The summit is not the goal - the journey together is."*