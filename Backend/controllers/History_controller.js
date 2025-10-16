import History from "../models/HistoryModel.js";


export const fetchHistoryData = async (req, res) => {

    try {
        const AllHistory = await History.find();
        res.status(200).json(AllHistory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

}