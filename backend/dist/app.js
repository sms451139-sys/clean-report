import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/properties.routes';
import reportRoutes from './routes/reports.routes';
import checklistRoutes from './routes/checklist.routes';
import { errorHandler } from './middleware/errorHandler';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', checklistRoutes);
// 404 handling
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
// Error handling
app.use(errorHandler);
// Start server
app.listen(PORT, () => {
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
});
export default app;
//# sourceMappingURL=app.js.map