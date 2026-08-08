/* =========================================================
    Portfolio - Backend Server (Node.js / Express)
    Author: Umar
    Features:
      - Serves static frontend files
      - POST /api/contact - receives & stores contact messages
      - Input validation & security (helmet, rate limiting)
      - Saves messages to messages.json
   ========================================================= */

'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

const MESSAGES_FILE = path.join(__dirname, 'messages.json');

/* ---------- Middleware ---------- */
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Rate limit contact endpoint to prevent abuse
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per window
    message: { success: false, message: 'Too many requests, please try again later.' }
});

/* ---------- Helper: read/write messages ---------- */
function readMessages() {
    try {
        if (fs.existsSync(MESSAGES_FILE)) {
            const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    } catch (err) {
        console.error('Error reading messages file:', err);
        return [];
    }
}

function writeMessages(messages) {
    try {
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
        return true;
    } catch (err) {
        console.error('Error writing messages file:', err);
        return false;
    }
}

/* ---------- Contact API ---------- */
app.post('/api/contact', contactLimiter, (req, res) => {
    const { name, email, subject, message } = req.body || {};

    // Validate inputs
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
        return res.status(400).json({ success: false, message: 'Please provide a valid name (2-100 characters).' });
    }
    if (!email || typeof email !== 'string' || !emailPattern.test(email.trim())) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (typeof subject !== 'string' || subject.trim().length > 200) {
        return res.status(400).json({ success: false, message: 'Subject is too long (max 200 characters).' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
        return res.status(400).json({ success: false, message: 'Please provide a message (10-2000 characters).' });
    }

    // Sanitize basic inputs (strip excess whitespace)
    const contactMessage = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim() || 'General Inquiry',
        message: message.trim(),
        receivedAt: new Date().toISOString()
    };

    // Store message
    const messages = readMessages();
    messages.push(contactMessage);

    if (!writeMessages(messages)) {
        return res.status(500).json({ success: false, message: 'Could not save your message. Please try again.' });
    }

    console.log(`[CONTACT] New message from ${contactMessage.name} (${contactMessage.email})`);

    res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully.'
    });
});

/* ---------- Health check ---------- */
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, status: 'ok' });
});

/* ---------- Serve index.html for all routes (SPA fallback) ---------- */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/* ---------- Start server ---------- */
app.listen(PORT, () => {
    console.log(`\n=====================================`);
    console.log(`   Portfolio server running!`);
    console.log(`   Open: http://localhost:${PORT}`);
    console.log(`=====================================\n`);
});

