// // // src/component/utils.js

// // export const getStatusTagText = (value, statusType, gender) => {
// //   const numValue = parseFloat(value);
// //   if (isNaN(numValue) || numValue === 0) return '';

// //   const maleRanges = {
// //     bodyFat: { low: [0, 9.9], standard: [10, 20], high: [20.1, 24], risk: [24.1, Infinity] },
// //     visceralFat: { standard: [0, 9], high: [10, 14], risk: [14.1, Infinity] },
// //     restingMetabolism: { standard: [1800, 2000] },
// //     bmi: { underweight: [0, 18.4], standard: [18.5, 24.9], obesity: [25, Infinity] },
// //     muscleRate: { low: [0, 34.9], standard: [35, 45], high: [45.1, Infinity] },
// //   };

// //   const femaleRanges = {
// //     bodyFat: { low: [0, 19.9], standard: [20, 28], high: [28.1, 34], risk: [34.1, Infinity] },
// //     visceralFat: { standard: [0, 9], high: [10, 14], risk: [14.1, Infinity] },
// //     restingMetabolism: { standard: [1600, 1800] },
// //     bmi: { underweight: [0, 18.4], standard: [18.5, 24.9], obesity: [25, Infinity] },
// //     muscleRate: { low: [0, 24.9], standard: [25, 35], high: [35.1, Infinity] },
// //   };

// //   const ranges = gender === 'Male' ? maleRanges : femaleRanges;

// //   switch (statusType) {
// //     case 'bmi':
// //       if (numValue < ranges.bmi.underweight[1]) return 'Underweight';
// //       if (numValue >= ranges.bmi.standard[0] && numValue <= ranges.bmi.standard[1]) return 'Standard';
// //       if (numValue >= ranges.bmi.obesity[0]) return 'Obesity';
// //       break;
// //     case 'bodyFat':
// //       if (numValue < ranges.bodyFat.standard[0]) return 'Low';
// //       if (numValue >= ranges.bodyFat.standard[0] && numValue <= ranges.bodyFat.standard[1]) return 'Standard';
// //       if (numValue > ranges.bodyFat.standard[1] && numValue <= ranges.bodyFat.high[1]) return 'High';
// //       if (numValue > ranges.bodyFat.high[1]) return 'Risk';
// //       break;
// //     case 'visceralFat':
// //       if (numValue <= ranges.visceralFat.standard[1]) return 'Standard';
// //       if (numValue >= ranges.visceralFat.high[0] && numValue <= ranges.visceralFat.high[1]) return 'High';
// //       if (numValue >= ranges.visceralFat.risk[0]) return 'Risk';
// //       break;
// //     case 'restingMetabolism':
// //       if (numValue >= ranges.restingMetabolism.standard[0] && numValue <= ranges.restingMetabolism.standard[1]) return 'Standard';
// //       return 'High'; // If outside standard, consider it high for this metric
// //     case 'muscleRate':
// //       if (numValue < ranges.muscleRate.standard[0]) return 'Low';
// //       if (numValue >= ranges.muscleRate.standard[0] && numValue <= ranges.muscleRate.standard[1]) return 'Standard';
// //       if (numValue > ranges.muscleRate.standard[1]) return 'High';
// //       break;
// //     default:
// //       return '';
// //   }
// //   return ''; // Default return if no status matches
// // };

// // export const getStatusTagColor = (statusText) => {
// //   if (statusText === 'Obesity' || statusText === 'High' || statusText === 'Risk' || statusText === 'Underweight' || statusText === 'Low') return 'red';
// //   if (statusText === 'Standard') return 'green';
// //   if (statusText === 'Insufficient') return 'blue'; // This might be used for other metrics like moisture/protein
// //   return '';
// // };

// // src/component/utils.js

// export const getStatusTagText = (value, statusType, gender) => {
//     const numValue = parseFloat(value);
//     if (isNaN(numValue) || numValue === 0) return '';

//     const maleRanges = {
//         bodyFat: { standard: [10, 20], high: [20.1, 24], risk: [24.1, Infinity] },
//         visceralFat: { standard: [0, 9], high: [10, 14], risk: [14.1, Infinity] },
//         muscleRate: { low: [0, 34.9], standard: [35, 45], high: [45.1, Infinity] },
//         bmi: { underweight: [0, 18.4], standard: [18.5, 24.9], obesity: [25, Infinity] },
//     };

//     const femaleRanges = {
//         bodyFat: { standard: [20, 28], high: [28.1, 34], risk: [34.1, Infinity] },
//         visceralFat: { standard: [0, 9], high: [10, 14], risk: [14.1, Infinity] },
//         muscleRate: { low: [0, 24.9], standard: [25, 35], high: [35.1, Infinity] },
//         bmi: { underweight: [0, 18.4], standard: [18.5, 24.9], obesity: [25, Infinity] },
//     };

//     const ranges = gender === 'Male' ? maleRanges : femaleRanges;

//     switch (statusType) {
//         case 'bodyFat':
//             if (numValue >= ranges.bodyFat.standard[0] && numValue <= ranges.bodyFat.standard[1]) return 'Standard';
//             if (numValue >= ranges.bodyFat.high[0] && numValue <= ranges.bodyFat.high[1]) return 'High';
//             if (numValue >= ranges.bodyFat.risk[0]) return 'Risk';
//             if (numValue < ranges.bodyFat.standard[0]) return 'Low';
//             break;
//         case 'visceralFat':
//             if (numValue >= ranges.visceralFat.standard[0] && numValue <= ranges.visceralFat.standard[1]) return 'Standard';
//             if (numValue >= ranges.visceralFat.high[0] && numValue <= ranges.visceralFat.high[1]) return 'High';
//             if (numValue >= ranges.visceralFat.risk[0]) return 'Risk';
//             break;
//         case 'muscleRate':
//             if (numValue >= ranges.muscleRate.standard[0] && numValue <= ranges.muscleRate.standard[1]) return 'Standard';
//             if (numValue > ranges.muscleRate.standard[1]) return 'High';
//             if (numValue < ranges.muscleRate.standard[0]) return 'Low';
//             break;
//         // ... other cases like 'bmi'
//     }
//     return ''; // Default return if no status matches
// };

// export const getStatusTagColor = (statusText) => {
//     if (statusText === 'High' || statusText === 'Risk' || statusText === 'Obesity') return 'red';
//     if (statusText === 'Standard') return 'green';
//     if (statusText === 'Low' || statusText === 'Underweight' || statusText === 'Insufficient') return 'blue';
//     return '';
// };


// src/component/utils.js

export const getStatusTagText = (value, statusType, gender) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue === 0) return '';

    const maleRanges = {
        bodyFat: { normal: [10, 20], high: [20.1, 24], risk: [24.1, Infinity] },
        visceralFat: { normal: [0, 9], high: [10, 14], risk: [14.1, Infinity] },
        muscleRate: { low: [0, 34.9], standard: [35, 45], high: [45.1, Infinity] },
        bmi: { normal: [18.5, 24.9], high: [25, 29.9], risk: [30, Infinity] },
    };

    const femaleRanges = {
        bodyFat: { normal: [20, 28], high: [28.1, 34], risk: [34.1, Infinity] },
        visceralFat: { normal: [0, 9], high: [10, 14], risk: [14.1, Infinity] },
        muscleRate: { low: [0, 24.9], standard: [25, 35], high: [35.1, Infinity] },
        bmi: { normal: [18.5, 24.9], high: [25, 29.9], risk: [30, Infinity] },
    };

    const ranges = gender === 'Male' ? maleRanges : femaleRanges;

    switch (statusType) {
        case 'bmi':
            if (numValue >= ranges.bmi.normal[0] && numValue <= ranges.bmi.normal[1]) return 'Standard';
            if (numValue >= ranges.bmi.high[0] && numValue <= ranges.bmi.high[1]) return 'High'; // Using Obesity as per image
            if (numValue >= ranges.bmi.risk[0]) return 'Obesity';
            if (numValue < ranges.bmi.normal[0]) return 'Underweight';
            break;
        case 'bodyFat':
            if (numValue >= ranges.bodyFat.normal[0] && numValue <= ranges.bodyFat.normal[1]) return 'Standard';
            if (numValue >= ranges.bodyFat.high[0] && numValue <= ranges.bodyFat.high[1]) return 'High';
            if (numValue >= ranges.bodyFat.risk[0]) return 'Risk';
            if (numValue < ranges.bodyFat.normal[0]) return 'Low';
            break;
        case 'visceralFat':
            if (numValue >= ranges.visceralFat.normal[0] && numValue <= ranges.visceralFat.normal[1]) return 'Standard';
            if (numValue >= ranges.visceralFat.high[0] && numValue <= ranges.visceralFat.high[1]) return 'High';
            if (numValue >= ranges.visceralFat.risk[0]) return 'Risk';
            break;
        case 'muscleRate':
            if (numValue >= ranges.muscleRate.standard[0] && numValue <= ranges.muscleRate.standard[1]) return 'Standard';
            if (numValue > ranges.muscleRate.standard[1]) return 'High';
            if (numValue < ranges.muscleRate.standard[0]) return 'Low';
            break;
        case 'restingMetabolism': // Assuming fixed range from image
             if (numValue >= 1800 && numValue <= 2000 && gender === 'Male') return 'Standard';
             if (numValue >= 1600 && numValue <= 2000 && gender === 'Female') return 'Standard';
             return 'High';
        default:
            return '';
    }
    return '';
};

export const getStatusTagColor = (statusText) => {
    if (statusText === 'High' || statusText === 'Risk' || statusText === 'Obesity' || statusText === 'Underweight' || statusText === 'Low') return 'red';
    if (statusText === 'Standard') return 'green';
    return '';
};


// src/component/utils.js

// export const getStatusTagText = (value, statusType, gender) => {
//     const numValue = parseFloat(value);
//     if (isNaN(numValue) || numValue <= 0) return ''; // Handle 0 or invalid input

//     const maleRanges = {
//         bodyFat: { normal: [10, 20], high: [20, 24], risk: [24, Infinity] },
//         visceralFat: { normal: [0, 9.9], high: [10, 14], risk: [14, Infinity] },
//         muscleRate: { normal: [35, 45], high: [45, Infinity], low: [0, 35] },
//         bmi: { normal: [0, 23], high: [23, 26], risk: [26, Infinity] },
//     };

//     const femaleRanges = {
//         bodyFat: { normal: [20, 28], high: [28, 34], risk: [34, Infinity] },
//         visceralFat: { normal: [0, 9.9], high: [10, 14], risk: [14, Infinity] },
//         muscleRate: { normal: [25, 35], high: [35, Infinity], low: [0, 25] },
//         bmi: { normal: [0, 22], high: [22, 26], risk: [26, Infinity] },
//     };

//     const ranges = gender === 'Male' ? maleRanges : femaleRanges;

//     switch (statusType) {
//         case 'bmi':
//             if (numValue > ranges.bmi.high[0] && numValue <= ranges.bmi.high[1]) return 'High';
//             if (numValue > ranges.bmi.normal[1] && numValue <= ranges.bmi.high[0]) return 'High';
//             if (numValue > ranges.bmi.risk[0]) return 'Risk';
//             if (numValue > ranges.bmi.normal[0] && numValue <= ranges.bmi.normal[1]) return 'Normal';
//             if (numValue <= ranges.bmi.normal[0]) return 'Underweight';
//             break;
//         case 'bodyFat':
//             if (numValue >= ranges.bodyFat.normal[0] && numValue <= ranges.bodyFat.normal[1]) return 'Normal';
//             if (numValue > ranges.bodyFat.normal[1] && numValue <= ranges.bodyFat.high[1]) return 'High';
//             if (numValue > ranges.bodyFat.risk[0]) return 'Risk';
//             if (numValue < ranges.bodyFat.normal[0]) return 'Low';
//             break;
//         case 'visceralFat':
//             if (numValue <= ranges.visceralFat.normal[1]) return 'Normal';
//             if (numValue >= ranges.visceralFat.high[0] && numValue <= ranges.visceralFat.high[1]) return 'High';
//             if (numValue > ranges.visceralFat.risk[0]) return 'Risk';
//             break;
//         case 'muscleRate':
//             if (numValue >= ranges.muscleRate.normal[0] && numValue <= ranges.muscleRate.normal[1]) return 'Normal';
//             if (numValue > ranges.muscleRate.normal[1]) return 'High';
//             if (numValue < ranges.muscleRate.normal[0]) return 'Low';
//             break;
//         default:
//             return '';
//     }
//     return '';
// };