import express from 'express'
import { fetchHistoryData } from '../controllers/History_controller.js';


const Historyrouter = express.Router();

Historyrouter.get("/AllHistory", fetchHistoryData);
export default Historyrouter;

