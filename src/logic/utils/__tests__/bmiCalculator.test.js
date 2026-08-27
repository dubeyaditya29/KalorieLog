/**
 * Tests for: Health metrics (BMI / BMR / calorie goal)
 * Covers: src/logic/utils/bmiCalculator.js
 */
import {
    calculateBMI,
    getBMICategory,
    getBMIColor,
    calculateBMR,
    calculateCalorieGoal,
} from '../bmiCalculator';

describe('Feature: Health metrics — calculateBMI', () => {
    it.each([
        [70, 175, 22.9],   // normal
        [50, 175, 16.3],   // underweight
        [85, 175, 27.8],   // overweight
        [100, 170, 34.6],  // obese
    ])('computes BMI for %skg / %scm', (weightKg, heightCm, expected) => {
        expect(calculateBMI(weightKg, heightCm)).toBeCloseTo(expected, 1);
    });

    it('returns 0 when height is missing or zero', () => {
        expect(calculateBMI(70, 0)).toBe(0);
        expect(calculateBMI(70, null)).toBe(0);
        expect(calculateBMI(null, 175)).toBe(0);
    });
});

describe('Feature: Health metrics — getBMICategory', () => {
    it.each([
        [18.4, 'Underweight'],
        [18.5, 'Normal'],
        [24.9, 'Normal'],
        [25.0, 'Overweight'],
        [29.9, 'Overweight'],
        [30.0, 'Obese'],
    ])('classifies BMI %s as %s', (bmi, expected) => {
        expect(getBMICategory(bmi)).toBe(expected);
    });
});

describe('Feature: Health metrics — getBMIColor', () => {
    it.each([
        [17, '#FFD60A'],   // underweight → yellow
        [22, '#30D158'],   // normal → green
        [27, '#FF9F0A'],   // overweight → orange
        [35, '#FF453A'],   // obese → red
    ])('maps BMI %s to its category color', (bmi, expected) => {
        expect(getBMIColor(bmi)).toBe(expected);
    });
});

describe('Feature: Health metrics — calculateBMR (Mifflin-St Jeor)', () => {
    it('computes male BMR', () => {
        // 10*70 + 6.25*175 - 5*30 + 5 = 1648.75
        expect(calculateBMR(70, 175, 30, 'male')).toBe(1649);
    });

    it('computes female BMR', () => {
        // 10*70 + 6.25*175 - 5*30 - 161 = 1482.75
        expect(calculateBMR(70, 175, 30, 'female')).toBe(1483);
    });

    it('defaults to male when gender is omitted', () => {
        expect(calculateBMR(70, 175, 30)).toBe(1649);
    });

    it('returns 0 when any required input is missing', () => {
        expect(calculateBMR(0, 175, 30)).toBe(0);
        expect(calculateBMR(70, 0, 30)).toBe(0);
        expect(calculateBMR(70, 175, 0)).toBe(0);
    });
});

describe('Feature: Health metrics — calculateCalorieGoal', () => {
    const BMR = 1500;

    it.each([
        ['sedentary', 1800],      // 1.2
        ['light', 2063],          // 1.375
        ['moderate', 2325],       // 1.55
        ['active', 2588],         // 1.725
        ['veryActive', 2850],     // 1.9
    ])('applies the %s multiplier', (level, expected) => {
        expect(calculateCalorieGoal(BMR, level)).toBe(expected);
    });

    it('falls back to moderate for unknown activity levels', () => {
        expect(calculateCalorieGoal(BMR, 'ultramarathon')).toBe(2325);
        expect(calculateCalorieGoal(BMR)).toBe(2325);
    });
});
