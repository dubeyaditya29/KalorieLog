/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @returns {number} BMI value
 */
export const calculateBMI = (weightKg, heightCm) => {
    if (!weightKg || !heightCm || heightCm === 0) return 0;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
};

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {string} Category name
 */
export const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
};

/**
 * Get BMI category color
 * @param {number} bmi - BMI value
 * @returns {string} Color for the category
 */
export const getBMIColor = (bmi) => {
    if (bmi < 18.5) return '#FFD60A'; // Yellow
    if (bmi < 25) return '#30D158';   // Green
    if (bmi < 30) return '#FF9F0A';   // Orange
    return '#FF453A';                  // Red
};

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR in calories
 */
export const calculateBMR = (weightKg, heightCm, age, gender = 'male') => {
    if (!weightKg || !heightCm || !age) return 0;

    const bmr = gender === 'male'
        ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
        : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;

    return Math.round(bmr);
};

/**
 * Calculate daily calorie goal based on activity level
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level
 * @returns {number} Daily calorie goal
 */
export const calculateCalorieGoal = (bmr, activityLevel = 'moderate') => {
    const multipliers = {
        sedentary: 1.2,      // Little or no exercise
        light: 1.375,        // Light exercise 1-3 days/week
        moderate: 1.55,      // Moderate exercise 3-5 days/week
        active: 1.725,       // Hard exercise 6-7 days/week
        veryActive: 1.9,     // Very hard exercise & physical job
    };

    return Math.round(bmr * (multipliers[activityLevel] || multipliers.moderate));
};
