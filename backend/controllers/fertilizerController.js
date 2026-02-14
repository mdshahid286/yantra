// @desc    Calculate fertilizer recommendation
// @route   POST /api/fertilizers/calculate
// @access  Public
exports.calculateFertilizer = async (req, res, next) => {
    try {
        const { N, P, K, cropType } = req.body;

        // Placeholder logic
        const recommendation = `For ${cropType}, add 50kg of Urea, 20kg of DAP, and 15kg of MOP per acre.`;

        res.status(200).json({
            success: true,
            recommendation,
            data: { N, P, K, cropType }
        });
    } catch (error) {
        next(error);
    }
};
