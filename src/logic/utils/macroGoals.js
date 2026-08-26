import { calculateBMI, getBMICategory, calculateBMR, calculateCalorieGoal } from './bmiCalculator';

// Grams of protein per kg body weight, adjusted by BMI category
const PROTEIN_PER_KG = {
    Underweight: 1.6,
    Normal: 1.4,
    Overweight: 1.3,
    Obese: 1.2,
};

// Calorie adjustment for weight management goals
const CALORIE_ADJUSTMENT = {
    Underweight: 300,   // small surplus for healthy gain
    Normal: 0,          // maintain
    Overweight: -400,   // modest deficit
    Obese: -500,        // larger deficit
};

const ACTIVITY_LEVELS = [
    { key: 'sedentary', label: 'Sedentary', hint: 'Little or no exercise' },
    { key: 'light', label: 'Light', hint: 'Exercise 1-3 days/week' },
    { key: 'moderate', label: 'Moderate', hint: 'Exercise 3-5 days/week' },
    { key: 'active', label: 'Active', hint: 'Hard exercise 6-7 days/week' },
    { key: 'veryActive', label: 'Very Active', hint: 'Physical job + training' },
];

/**
 * Compute personalized daily calorie & macro targets from a user profile.
 *
 * @param {Object} profile - Profile with age, height_cm, weight_kg, gender?, activity_level?
 * @returns {{calorieGoal: number, protein: number, carbs: number, fat: number,
 *            bmi: number, bmiCategory: string, proteinPerKg: number}}
 */
export const getMacroSuggestions = (profile) => {
    if (!profile || !profile.age || !profile.height_cm || !profile.weight_kg) {
        return null;
    }

    const gender = profile.gender === 'female' ? 'female' : 'male';
    const activityLevel = profile.activity_level || 'moderate';

    const bmi = calculateBMI(profile.weight_kg, profile.height_cm);
    const bmiCategory = getBMICategory(bmi);

    const bmr = calculateBMR(profile.weight_kg, profile.height_cm, profile.age, gender);
    const maintenance = calculateCalorieGoal(bmr, activityLevel);

    const calorieGoal = Math.max(Math.round((maintenance + (CALORIE_ADJUSTMENT[bmiCategory] || 0)) / 10) * 10, Math.round(bmr));

    const proteinPerKg = PROTEIN_PER_KG[bmiCategory] || 1.4;
    const protein = Math.round(profile.weight_kg * proteinPerKg);

    const fatCalories = calorieGoal * 0.275;
    const fat = Math.round(fatCalories / 9);
    const carbs = Math.round(Math.max(calorieGoal - protein * 4 - fatCalories, 0) / 4);

    return {
        calorieGoal,
        protein,
        carbs,
        fat,
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory,
        proteinPerKg,
    };
};

export { ACTIVITY_LEVELS };
