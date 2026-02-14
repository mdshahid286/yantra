// @desc    Get market price trends and recommendations
// @route   GET /api/market/trends
// @access  Public
exports.getMarketTrends = async (req, res, next) => {
    try {
        const trends = [
            { commodity: 'Wheat', currentPrice: 2200, trend: 'up', forecast: 2350 },
            { commodity: 'Rice', currentPrice: 3500, trend: 'stable', forecast: 3550 },
            { commodity: 'Tomato', currentPrice: 1500, trend: 'down', forecast: 1200 },
            { commodity: 'Onion', currentPrice: 2800, trend: 'up', forecast: 3100 },
        ];

        res.status(200).json({
            success: true,
            data: trends,
            recommendation: 'Good time to sell Wheat and Onion. Wait for Rice prices to peak.'
        });
    } catch (error) {
        next(error);
    }
};
