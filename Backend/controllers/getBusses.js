
import Bus from "../models/Busmodel.js";
export const getBusses = async (req, res) => {
    try {

        const AllBuses = await Bus.find();
        res.status(200).json(AllBuses);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

