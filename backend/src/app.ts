import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import tournamentRoutes from './routes/tournament.routes';
import matchRoutes from './routes/match.routes';
import { errorHandler } from './middlewares/error.middleware';
import { morganMiddleware } from './middlewares/morgan.middleware';

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Inyección del logger de tráfico de red HTTP
app.use(morganMiddleware);

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/matches', matchRoutes);

// Manejo Global de Errores
app.use(errorHandler);

export default app;
