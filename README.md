# Quantum Pay - Safaricom Daraja Integration

<div align="center">

```
  ██████  ██    ██  █████  ███    ██ ████████ ██    ██ ███    ███ 
 ██    ██ ██    ██ ██   ██ ████   ██    ██    ██    ██ ████  ████ 
 ██    ██ ██    ██ ███████ ██ ██  ██    ██    ██    ██ ██ ████ ██ 
 ██ ▄▄ ██ ██    ██ ██   ██ ██  ██ ██    ██    ██    ██ ██  ██  ██ 
  ██████   ██████  ██   ██ ██   ████    ██     ██████  ██      ██ 
     ▀▀                                                            
                                                                  
    ██████   █████  ██    ██ 
    ██   ██ ██   ██  ██  ██  
    ██████  ███████   ████   
    ██      ██   ██    ██    
    ██      ██   ██    ██    
```

```
     [○] M-PESA Integration
     └── Next.js + TypeScript + Tailwind
```

  <p align="center">
    <em>A modern, secure, and lightning-fast M-PESA payment integration built with Next.js</em>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#environment-variables">Environment Setup</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

## ✨ Features

```
┌─────────────────────────────────────────────────────┐
│ 🚀 Lightning Fast │ Built with Next.js 13           │
│ 🔒 Secure         │ Safaricom's Daraja 2.0 API      │
│ 🌓 Theme Support  │ Dark/Light mode with animation  │
│ 🎨 Modern UI      │ Glass morphism & animations     │
│ 📱 Responsive     │ Mobile-first design             │
│ 🔄 Real-time      │ Live transaction tracking       │
│ 📝 Logging        │ Comprehensive debug support     │
│ 🔐 Type Safe      │ Full TypeScript integration     │
└─────────────────────────────────────────────────────┘
```

## 🛠 Tech Stack

- **Framework**: [Next.js 13](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Payment Integration**: [Safaricom Daraja 2.0](https://developer.safaricom.co.ke/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Font**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShalomObongo/quantum-pay-daraja.git
   cd quantum-pay-daraja
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local   # Copy example env file
   vim .env.local              # Edit with your credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🔑 Environment Variables

Create a \`.env.local\` file in the root directory with the following variables:

```env
DARAJA_CONSUMER_KEY=your_consumer_key
DARAJA_CONSUMER_SECRET=your_consumer_secret
DARAJA_PASS_KEY=your_pass_key
DARAJA_BUSINESS_SHORT_CODE=your_shortcode
DARAJA_API_URL=https://sandbox.safaricom.co.ke
NEXT_PUBLIC_API_URL=your_callback_url
```

## 📡 API Reference

### STK Push Endpoint
```http
POST /api/mpesa/stkpush

{
  "amount": number,    // Amount to be paid
  "phoneNumber": string // Format: 254XXXXXXXXX
}
```

### Check Transaction Status
```http
GET /api/mpesa/status/:checkoutRequestId
```

### Callback URL
```http
POST /api/mpesa/callback
```

## 🎨 UI Components

```
Components/
├── PaymentForm/           # Payment input & validation
├── TransactionStatus/     # Real-time status updates
└── ThemeToggle/          # Dark/Light mode switch
```

## 🔐 Security Features

```
Security/
├── Environment Variables  # Secure credential storage
├── Input Validation      # Client & server validation
├── API Security          # Secure route handling
├── HTTPS Only           # Encrypted communication
└── Rate Limiting        # API request throttling
```

## 🚧 Error Handling

```
try {
  // Comprehensive error handling for:
  ├── Input Validation
  ├── Network Errors
  ├── M-PESA API Errors
  └── Transaction Status
} catch (error) {
  // Detailed error logging
}
```

## 📱 Mobile Responsiveness

```css
/* Responsive breakpoints */
├── Mobile:  < 640px
├── Tablet:  >= 768px
└── Desktop: >= 1024px
```

## 🤝 Contributing

```bash
# Contributing workflow
git checkout -b feature/AmazingFeature
git commit -m 'Add some AmazingFeature'
git push origin feature/AmazingFeature
# Then open a Pull Request
```

## 📄 License

```
MIT License
└── See LICENSE file for details
```

## 🙏 Acknowledgments

```
Credits/
├── Safaricom Daraja API
├── Next.js Documentation
└── Tailwind CSS
```

---

<div align="center">

```
Made by Shalom Obongo
```

</div>
