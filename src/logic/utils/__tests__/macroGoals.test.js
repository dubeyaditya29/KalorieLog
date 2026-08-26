/**
 * Tests for: Nutrition targets (macro suggestions)
 * Covers: src/logic/utils/macroGoals.js — getMacroSuggestions, ACTIVITY_LEVELS
 */
import { getMacroSuggestions, ACTIVITY_LEVELS } from '../macroGoals';

const BASE_PROFILE = {
    age: 30,
    height_cm: 175,
    weight_kg: 70,
    gender: 'male',
    activity_level: 'moderate',
};

describe('Feature: Nutrition targets — input validation', () => {
    it.each([
        ['null profile', null],
        ['missing age', { ...BASE_PROFILE, age: undefined }],
        ['missing height', { ...BASE_PROFILE, height_cm: 0 }],
        ['missing weight', { ...BASE_PROFILE, weight_kg: null }],
    ])('returns null for %s', (_label, profile) => {
        expect(getMacroSuggestions(profile)).toBeNull();
    });
});

describe('Feature: Nutrition targets — golden case (normal BMI)', () => {
    it('computes consistent targets for a 70kg/175cm male at moderate activity', () => {
        const s = getMacroSuggestions(BASE_PROFILE);

        // BMR = 1649 → maintenance = 1649 * 1.55 = 2556 → goal rounded to tens
        expect(s.calorieGoal).toBe(2560);
        expect(s.bmi).toBeCloseTo(22.9, 1);
        expect(s.bmiCategory).toBe('Normal');
        expect(s.proteinPerKg).toBe(1.4);

        expect(s.protein).toBe(Math.round(70 * 1.4));           // 98
        expect(s.fat).toBe(Math.round((2560 * 0.275) / 9));     // ~78
        const fatCalories = 2560 * 0.275;
        expect(s.carbs).toBe(Math.round(Math.max(2560 - s.protein * 4 - fatCalories, 0) / 4));
    });
});

describe('Feature: Nutrition targets — protein scales with BMI category', () => {
    it.each([
        [50, 175, 'Underweight', 1.6],
        [85, 175, 'Overweight', 1.3],
        [100, 170, 'Obese', 1.2],
    ])('%skg/%scm → %s uses %sg/kg', (weightKg, heightCm, category, perKg) => {
        const s = getMacroSuggestions({ ...BASE_PROFILE, weight_kg: weightKg, height_cm: heightCm });
        expect(s.bmiCategory).toBe(category);
        expect(s.proteinPerKg).toBe(perKg);
        expect(s.protein).toBe(Math.round(weightKg * perKg));
    });
});

describe('Feature: Nutrition targets — calorie adjustment by category', () => {
    it('adds a surplus for underweight users', () => {
        const s = getMacroSuggestions({ ...BASE_PROFILE, weight_kg: 50 });
        expect(s.bmiCategory).toBe('Underweight');
        // goal must exceed plain maintenance (BMR * 1.55)
        const bmr = Math.round(10 * 50 + 6.25 * 175 - 5 * 30 + 5);
        expect(s.calorieGoal).toBeGreaterThan(bmr * 1.55);
    });

    it('applies a deficit for obese users but never drops below BMR', () => {
        // Low-BMR profile so the -500 deficit would undercut maintenance
        const s = getMacroSuggestions({
            age: 60,
            height_cm: 160,
            weight_kg: 95,   // BMI ≈ 37.1 → Obese
            gender: 'male',
            activity_level: 'sedentary',
        });

        const bmr = Math.round(10 * 95 + 6.25 * 160 - 5 * 60 + 5); // 1655
        expect(s.calorieGoal).toBeGreaterThanOrEqual(bmr);
    });

    it('floors the goal at BMR when the deficit would undercut it', () => {
        // maintenance = 1655 * 1.2 = 1986; 1986 - 500 = 1486 < BMR → floored
        const s = getMacroSuggestions({
            age: 60,
            height_cm: 160,
            weight_kg: 95,
            gender: 'male',
            activity_level: 'sedentary',
        });
        expect(s.calorieGoal).toBe(1655);
    });
});

describe('Feature: Nutrition targets — gender & activity handling', () => {
    it('treats any non-"female" value as male', () => {
        const male = getMacroSuggestions(BASE_PROFILE);
        const coerced = getMacroSuggestions({ ...BASE_PROFILE, gender: 'FEMALE' });
        const other = getMacroSuggestions({ ...BASE_PROFILE, gender: 'other' });

        expect(coerced.calorieGoal).toBe(male.calorieGoal);
        expect(other.calorieGoal).toBe(male.calorieGoal);
    });

    it('uses the given activity level and defaults to moderate', () => {
        const sedentary = getMacroSuggestions({ ...BASE_PROFILE, activity_level: 'sedentary' });
        const defaulted = getMacroSuggestions({ ...BASE_PROFILE, activity_level: undefined });
        const moderate = getMacroSuggestions(BASE_PROFILE);

        expect(defaulted.calorieGoal).toBe(moderate.calorieGoal);
        expect(sedentary.calorieGoal).toBeLessThan(moderate.calorieGoal);
    });
});

describe('Feature: Nutrition targets — ACTIVITY_LEVELS export', () => {
    it('exposes the five supported levels with unique keys', () => {
        expect(ACTIVITY_LEVELS).toHaveLength(5);
        const keys = ACTIVITY_LEVELS.map((a) => a.key);
        expect(new Set(keys).size).toBe(5);
        ACTIVITY_LEVELS.forEach((a) => {
            expect(a.label).toBeTruthy();
            expect(a.hint).toBeTruthy();
        });
    });
});
