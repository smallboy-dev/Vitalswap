# VitalSwap - Complete Features & Functions Documentation

## Overview
VitalSwap is a modern, responsive web application for transparent currency swap services with real-time exchange rates, fee calculations, AI-powered assistance, and video support integration.

---

## 🎯 Core Features

### 1. **Header Component** (`src/components/Header.jsx`)
**Purpose:** Navigation and global controls

**Features:**
- **Sticky Header with Scroll Animation**
  - Hides when scrolling down, shows when scrolling up
  - Smooth transitions for better UX
- **Theme Toggle**
  - Light/Dark mode switcher
  - Persists user preference in localStorage
  - System preference detection on first load
- **Smart Notifications Bell**
  - Shows badge (number "1") when exchange rates update
  - Clicking scrolls to "Live Exchange Rates" section
  - Listens for custom `rates-updated` events
- **Responsive Mobile Menu**
  - Full-screen overlay from top
  - Smooth slide-down animation
  - Centered text alignment
  - Logo hidden when menu is open
  - Close button at top
- **Navigation Links**
  - Home, How It Works, Fees, Video Help, Contact
  - Hash routing support for in-page navigation

**Key Functions:**
- `useState` hooks for mobile menu, notifications, scroll position
- `useEffect` for scroll listeners and theme persistence
- `onBell` - Handles notification bell click and scroll
- Header visibility toggle based on scroll direction

---

### 2. **Hero Section** (`src/sections/Hero.jsx`)
**Purpose:** Landing page introduction

**Features:**
- **Responsive Hero Image**
  - Positioned on the right on desktop
  - Hidden on mobile for better text focus
  - Border-radius adjustments
  - Dark mode visibility toggle
- **Centered Text Content** (Mobile/Tablet)
  - Title, subtitle, and badge centered for mobile
- **Badge with Checkmark Icon**
  - Branded styling
  - Professional appearance
- **Large Typography**
  - Increased font sizes for title and subtitle
  - Responsive clamp() sizing

**Key Functions:**
- Responsive image visibility
- Dark mode image styling
- Text alignment adjustments

---

### 3. **Fees Section** (`src/sections/Fees.jsx`)
**Purpose:** Display transaction and service fees

**Features:**
- **Live Fee Data Integration**
  - Fetches from `VITE_FEE_API` endpoint
  - Falls back to `public/assets/fees-fallback.json` if API fails
- **Customer/Business Toggle**
  - Switchable view between customer and business fees
  - Clear visual distinction
- **Professional Fee Cards**
  - Icons for Swap Fee, FX Rate, Processing Fee
  - Yellow circle background icons (consistent styling)
  - Dark mode support
- **Responsive Tables**
  - Prevents "scatter" on larger screens (laptops/desktops)
  - Mobile-optimized layout
  - Professional card design

**Key Functions:**
- `useState` for fee mode (Customer/Business)
- `useEffect` to fetch fee data on mount
- API fetch with error handling
- Fallback JSON loading
- Dynamic fee display based on selected mode

---

### 4. **Calculator Section** (`src/sections/Calculator.jsx`)
**Purpose:** Real-time fee and exchange rate calculations

**Features:**
- **Live Exchange Rate Integration**
  - Uses current rates from API
  - Supports USD to NGN and NGN to USD
- **Animated Results**
  - Smooth fade-in animations
  - Visual feedback on calculation
- **Amount Input**
  - Can be fully cleared (not just defaulting to zero)
  - Proper input validation
- **Fee Breakdown Display**
  - Shows swap fee, FX rate, processing fee
  - Total calculation
  - Clear, readable formatting

**Key Functions:**
- `useState` for amount, direction, fees, rates
- `useEffect` to fetch live rates
- `calculateFee` - Computes total fees based on amount and direction
- Input validation and formatting

---

### 5. **Rates Section** (`src/sections/Rates.jsx`)
**Purpose:** Display live exchange rates

**Features:**
- **Live Exchange Rates**
  - Fetches from `VITE_EXCHANGE_API`
  - Displays only supported pairs: USD↔NGN and NGN↔USD
  - Centered layout
- **Auto-Refresh**
  - Refresh button for manual updates
  - Loading states
  - Error handling
- **Rate Update Notifications**
  - Dispatches `rates-updated` custom event
  - Triggers header bell notification
- **Fallback Support**
  - Uses `public/assets/rates-fallback.json` if API fails

**Key Functions:**
- `useState` for rates, loading, error states
- `useEffect` to fetch rates on mount and interval
- `fetchRates` - API call with error handling
- Custom event dispatching for notifications

---

### 6. **Rate Chart Section** (`src/sections/RateChart.jsx`)
**Purpose:** Visualize exchange rate trends

**Features:**
- **7-Day Trend Graph**
  - SVG-based line chart
  - Smooth curved lines
  - Professional styling
- **Interactive Tooltip**
  - Hover to see specific date and rate
  - Positioned dynamically
- **Current Rate Display**
  - Shows latest rate with percentage change
  - Color-coded (green for positive, red for negative)
- **Responsive Design**
  - Adapts to screen size
  - Mobile-optimized

**Key Functions:**
- SVG path generation for curved lines
- Tooltip positioning calculations
- Percentage change calculations
- Data visualization from API/fallback

---

### 7. **Referrals Section** (`src/sections/Referrals.jsx`)
**Purpose:** Display referral program information

**Features:**
- **Responsive Carousel**
  - Auto-scroll functionality
  - Smooth animations
  - Pause on hover
  - Swipe support (touch devices)
- **Professional Card Design**
  - Centered content (avatar, name, handle, link)
  - Avatar images
  - Social media handles
  - Copy-to-clipboard referral links
  - Call-to-action buttons
- **Navigation Controls**
  - Previous/Next buttons
  - Dot indicators (optional)

**Key Functions:**
- `useState` for current slide index
- `useEffect` for auto-scroll timer
- `useRef` for touch gesture detection
- `handleSwipe` - Touch event handling
- `goToSlide` - Navigate to specific slide
- `handleNext/Prev` - Carousel navigation

---

### 8. **Floating AI Assistant** (`src/components/FloatingAssistant.jsx`)
**Purpose:** Conversational AI support with multilingual voice

**Features:**
- **Live Data Integration**
  - Fetches fees from `VITE_FEE_API`
  - Fetches rates from `VITE_EXCHANGE_API`
  - Falls back to JSON files if APIs fail
- **Conversational Flow**
  - Detects user intent (fees, rates, referrals, agent)
  - Prompts for Customer/Business if fee type unclear
  - Summarizes all fees for chosen group
- **Multilingual Support**
  - Supports: English, Pidgin, Yoruba, Igbo, Hausa
  - Auto-detects language from user input
  - Language-specific responses
- **Voice Features**
  - Text-to-speech for all responses
  - Voice input (speech recognition)
  - Attempts to select matching language voice
- **Agent Redirection**
  - Detects keywords: "talk to agent", "need help", etc.
  - Redirects to Video Help page
  - Multilingual redirect messages
- **Responsive Design**
  - Mobile-optimized chat interface
  - Floating button (bottom-right)
  - Expandable chat panel
- **No Mock Data**
  - All mock APIs removed
  - Exclusively uses live APIs or fallbacks

**Key Functions:**
- `fetchLiveRates()` - Gets exchange rates from API
- `fetchFees()` - Gets fee data from API
- `detectLang()` - Detects user's language
- `speak()` - Text-to-speech function
- `handleUserSend()` - Processes user messages and generates responses
- `pushRecent()` - Manages recent queries in localStorage
- Intent detection for agent redirection
- Multilingual response templates (TG object)

---

### 9. **Video Help Component** (`src/components/VideoHelp.jsx`)
**Purpose:** Video call support connecting users with agents

**Features:**
- **Daily.co Integration**
  - Uses Daily.js npm package (no CDN CORS issues)
  - Hardcoded room URL: `https://vitaswap.daily.co/vitalswap`
- **Consent Flow**
  - Terms & conditions acceptance
  - Professional and respectful communication terms
  - Recording consent (if enabled)
- **Role Selection**
  - Join as User (connect to agent)
  - Join as Agent (with passcode: `vitalswap123`)
  - Agent availability status
- **Video Call Features**
  - Full video call interface
  - Lobby state (waiting for agent)
  - Recording banner (if enabled)
  - Participant join/leave events
- **Session Notes**
  - Text area for notes during call
  - Send via Daily's app messages
- **Dark Mode Support**
  - Complete dark theme styling
  - Consistent with app theme
- **Error Handling**
  - Clear error messages
  - Connection issue handling
  - Leave call functionality

**Key Functions:**
- `handleJoinAsUser()` - User connection with dynamic Daily.js import
- `handleJoinAsAgent()` - Agent connection with code verification
- `handleConsent()` - Terms acceptance flow
- `handleLeave()` - Clean disconnection
- `handleSendNote()` - Session notes management
- Event listeners for Daily.co call events
- Environment variable management (now hardcoded)

---

### 10. **Onboarding Component** (`src/components/Onboarding.jsx`)
**Purpose:** First-time user guided tour

**Features:**
- **Guided Tour Steps**
  - Step 1: Floating AI Assistant
  - Step 2: Live Exchange Rates
  - Step 3: Fees & Calculator
  - Step 4: Theme & Navigation
  - Step 5: Completion
- **Professional Design**
  - Glassmorphism card styling
  - Custom branding colors
  - Animated transitions
  - Directional arrow pointing to features
- **Auto-Scrolling**
  - Automatically scrolls to target elements
  - Smooth scroll behavior
  - Body click advances tour
- **Keyboard Navigation**
  - Esc: Close tour
  - Enter: Next step
  - Arrow keys: Navigate steps
- **Mobile Responsive**
  - Optimized for mobile devices
  - Responsive card sizing
- **One-Time Display**
  - Persists completion in localStorage
  - Only shows on first visit

**Key Functions:**
- `useState` for current step and tour state
- `useEffect` for step management and keyboard listeners
- `scrollToTarget()` - Auto-scroll to feature
- `handleNext()` - Advance to next step
- `handlePrevious()` - Go to previous step
- `handleClose()` - Complete and dismiss tour
- Position calculations for arrow placement

---

### 11. **Tip Bubble Component** (`src/components/TipBubble.jsx`)
**Purpose:** Subtle AI learning tips

**Features:**
- **Random Tips Display**
  - Educational tips about VitalSwap
  - Rotating content every few seconds
  - Glassy, subtle design
- **Auto-Hide Functionality**
  - 10 seconds on mobile
  - 14 seconds on desktop
  - Timer resets on "Next" click
- **Frequency Control**
  - 10-minute cooldown between appearances
  - Maximum 3 times per day
  - Respects user dismissal
- **Onboarding Awareness**
  - Waits for onboarding to complete
  - Doesn't overlap with tour
- **Responsive Sizing**
  - Different sizes for mobile/desktop
  - Bottom-left positioning

**Key Functions:**
- `useState` for visibility, current tip, timer
- `useEffect` for timing, cooldown, onboarding detection
- `shouldShow()` - Determines if bubble should appear
- `handleDismiss()` - Hide and record dismissal
- `handleNext()` - Show next tip
- LocalStorage for cooldown and daily count tracking

---

### 12. **Footer Component** (`src/components/Footer.jsx`)
**Purpose:** Site footer with links and information

**Features:**
- **Footer Links**
  - Navigation links
  - Social media icons
  - Contact information
- **Dark Mode Support**
  - Themed styling

---

### 13. **CTA Section** (`src/sections/Cta.jsx`)
**Purpose:** Call-to-action for user engagement

**Features:**
- **Join Prompt**
  - Encourages user sign-up
  - Branded styling
  - Dark mode support

---

## 🛠️ Technical Features

### **Routing System** (`src/App.jsx`)
- **Hash-based Routing**
  - Simple client-side routing
  - Supports: `#/` (home) and `#/video-help` (video help page)
  - `useState` and `useEffect` for route management
  - `hashchange` event listener

### **Theme System** (`src/main.jsx`)
- **Theme Initialization**
  - Reads from localStorage
  - Falls back to system preference
  - Sets `data-theme` attribute on document
- **Dark Mode**
  - Comprehensive dark theme
  - CSS variables for theming
  - Smooth transitions

### **Animation System** (`src/main.jsx`)
- **IntersectionObserver**
  - Reveals content on scroll
  - Performance-optimized
  - Fallback for older browsers
- **Respects User Preferences**
  - Disables animations if `prefers-reduced-motion`

### **API Integration**
- **Environment-Driven**
  - All endpoints configurable via `.env`
  - Easy deployment across environments
- **Fallback Mechanism**
  - Graceful degradation
  - Offline support
  - JSON fallback files

### **Responsive Design**
- **Mobile-First Approach**
  - All components mobile-responsive
  - CSS media queries throughout
  - Touch-optimized interactions

---

## 📊 Data Flow

### **Fee Data Flow:**
1. Component mounts → Fetch from `VITE_FEE_API`
2. If API fails → Load `public/assets/fees-fallback.json`
3. Parse and display in UI
4. AI Assistant can also fetch and read fees

### **Rate Data Flow:**
1. Component mounts → Fetch from `VITE_EXCHANGE_API`
2. If API fails → Load `public/assets/rates-fallback.json`
3. Display in Rates section
4. Trigger notification if rates change
5. AI Assistant fetches for rate questions

### **AI Assistant Flow:**
1. User sends message (text or voice)
2. Detect language and intent
3. Fetch relevant data (fees/rates)
4. Generate response in detected language
5. Speak response via text-to-speech
6. Handle special intents (agent redirection)

---

## 🎨 Design Features

### **Color Scheme**
- Primary Blue: `#04396D`
- Accent Yellow: `#FFB806`
- Dark Mode: `#0b1220` background, `#111827` cards

### **Animations**
- Fade-in on scroll
- Slide animations
- Pulse effects
- Smooth transitions

### **Typography**
- Font: Poppins (Google Fonts)
- Responsive sizing with `clamp()`
- Clear hierarchy

---

## 🔧 Configuration

### **Environment Variables** (`.env`)
```env
VITE_FEE_API=https://your-api.com/fee
VITE_EXCHANGE_API=https://your-api.com/exchange
```

### **Hardcoded Configuration** (VideoHelp.jsx)
- Daily.co Room URL: `https://vitaswap.daily.co/vitalswap`
- Agent Available: `true`
- Video Recording: `true`
- Agent Code: `vitalswap123`

---

## 📱 Responsive Breakpoints

- **Mobile:** `< 768px`
- **Tablet:** `768px - 1024px`
- **Desktop:** `> 1024px`

---

## 🚀 Performance Optimizations

- **Lazy Loading:** Components load as needed
- **Memoization:** `useMemo` and `useCallback` where appropriate
- **Event Debouncing:** Scroll and resize handlers
- **IntersectionObserver:** Efficient scroll animations
- **Dynamic Imports:** Daily.js loaded only when needed

---

## 🔐 Security Features

- **Agent Code Protection:** Secure passcode for agent access
- **CORS Handling:** Daily.js via npm (no CDN CORS issues)
- **Input Validation:** All user inputs validated
- **Error Boundaries:** Graceful error handling

---

## 📝 Key Functions Reference

### **FloatingAssistant.jsx**
- `fetchLiveRates()` - Get exchange rates
- `fetchFees()` - Get fee data
- `detectLang()` - Language detection
- `speak()` - Text-to-speech
- `handleUserSend()` - Message processing
- `pushRecent()` - Recent queries management

### **VideoHelp.jsx**
- `handleJoinAsUser()` - User video connection
- `handleJoinAsAgent()` - Agent video connection
- `handleConsent()` - Consent flow
- `handleLeave()` - Disconnect from call
- `handleSendNote()` - Session notes

### **Onboarding.jsx**
- `scrollToTarget()` - Auto-scroll to feature
- `handleNext()` - Next step
- `handlePrevious()` - Previous step
- `handleClose()` - Complete tour

### **TipBubble.jsx**
- `shouldShow()` - Visibility logic
- `handleDismiss()` - Hide bubble
- `handleNext()` - Next tip

### **Calculator.jsx**
- `calculateFee()` - Fee calculations

### **Rates.jsx**
- `fetchRates()` - Get exchange rates
- Dispatches `rates-updated` custom event

---

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement
- Graceful degradation for older browsers

---

## 📦 Dependencies

- **React 18.3.1** - UI framework
- **Vite 5.4.8** - Build tool
- **@daily-co/daily-js** - Video calling SDK

---

## 🎯 User Experience Features

1. **First-Time Onboarding** - Guided tour for new users
2. **Smart Notifications** - Rate update alerts
3. **Voice Interaction** - Speak to AI, hear responses
4. **Multilingual Support** - 5 languages
5. **Dark Mode** - User preference
6. **Mobile Optimized** - Full mobile experience
7. **Video Support** - Connect with live agents
8. **Offline Support** - Fallback JSON files
9. **Responsive Design** - Works on all devices
10. **Smooth Animations** - Professional feel

---

This documentation covers all features, functions, and technical aspects of the VitalSwap application.

