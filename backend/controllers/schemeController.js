// @desc    Get government schemes
// @route   GET /api/schemes
// @access  Public
exports.getSchemes = async (req, res, next) => {
    try {
        const schemes = [
            {
                id: 1,
                name: 'PM-KISAN',
                description: 'Income support of Rs. 6000 per year to all landholding farmers.',
                eligibility: 'All farmers',
                link: 'https://pmkisan.gov.in/'
            },
            {
                id: 2,
                name: 'Pradhan Mantri Fasal Bima Yojana',
                description: 'Crop insurance for farmers against natural calamities.',
                eligibility: 'All farmers',
                link: 'https://pmfby.gov.in/'
            },
            {
                id: 3,
                name: 'Soil Health Card Scheme',
                description: 'Assistance to State Governments to issue Soil Health Cards to all farmers.',
                eligibility: 'All farmers',
                link: 'https://www.soilhealth.dac.gov.in/'
            },
            {
                id: 4,
                name: 'Kisan Credit Card (KCC)',
                description: 'Provides farmers with timely access to credit.',
                eligibility: 'All farmers',
                link: 'https://pib.gov.in/'
            }
        ];

        res.status(200).json({
            success: true,
            count: schemes.length,
            data: schemes
        });
    } catch (error) {
        next(error);
    }
};
