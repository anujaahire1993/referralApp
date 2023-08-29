// middlewares/isAuthenticated.js
import express from 'express';

export default function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized.' });
};
