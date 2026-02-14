// @desc    Predict profit based on input costs and expected yield
// @route   POST /api/profit/predict
// @access  Public
exports.predictProfit = async (req, res, next) => {
    try {
        const { cropType, area, investment, expectedYield, expectedPrice } = req.body;

        // Simple calculation
        const totalRevenue = expectedYield * expectedPrice;
        const profit = totalRevenue - investment;
        const margin = (profit / totalRevenue) * 100;

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                profit,
                margin: margin.toFixed(2),
                recommendation: profit > 0 ? 'Project looks profitable.' : 'High risk detected. Consider reducing costs.'
            }
        });
    } catch (error) {
        next(error);
    }
};
