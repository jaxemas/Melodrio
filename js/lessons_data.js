/**
 * Melodrio - Lessons Data Combiner
 * Slučuje data lekcí ze všech 6 etap (Fáze 1 až 6, celkem 48 lekcí).
 */

window.LESSONS_DATA = [
  ...(window.STAGE1_LESSONS || []),
  ...(window.STAGE2_LESSONS || []),
  ...(window.STAGE3_LESSONS || []),
  ...(window.STAGE4_LESSONS || []),
  ...(window.STAGE5_LESSONS || []),
  ...(window.STAGE6_LESSONS || [])
];
