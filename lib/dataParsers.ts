/**
 * Data parsers for GUS lifespan and valorization parameters
 * Zakład Ubezpieczeń Społecznych - Symulator Emerytalny
 */

// GUS lifespan data structure
export interface GUSLifespanData {
  [age: number]: {
    [month: number]: number; // months of remaining life
  };
}

// Valorization parameters data structure
export interface ValorizationParams {
  year: number;
  quarter: 'I' | 'II' | 'III' | 'IV';
  accountIndexation: number; // percentage as decimal (e.g., 1.1202 for 112.02%)
  subAccountIndexation: number; // percentage as decimal (e.g., 1.0128 for 101.28%)
}

/**
 * Parse GUS lifespan CSV data
 * Returns a lookup table for remaining life expectancy in months
 */
export function parseGUSLifespanData(csvContent: string): GUSLifespanData {
  const lines = csvContent.split('\n');
  const data: GUSLifespanData = {};
  
  // Skip header line (line 0), data starts at line 1
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(',');
    if (columns.length < 13) continue; // Need at least age + 12 months
    
    const age = parseInt(columns[0]);
    if (isNaN(age)) continue;
    
    data[age] = {};
    
    // Parse months 0-11 (columns 1-12)
    for (let month = 0; month < 12; month++) {
      const value = parseFloat(columns[month + 1]);
      if (!isNaN(value)) {
        data[age][month] = value;
      }
    }
  }
  
  return data;
}

/**
 * Parse valorization parameters CSV data
 * Returns array of quarterly indexation parameters
 */
export function parseValorizationParams(csvContent: string): ValorizationParams[] {
  const lines = csvContent.split('\n');
  const data: ValorizationParams[] = [];
  
  // Skip header lines (lines 1-2 contain metadata, data starts at line 3)
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(',');
    if (columns.length < 4) continue;
    
    const year = parseInt(columns[0]);
    const quarter = columns[1] as 'I' | 'II' | 'III' | 'IV';
    const accountIndexationStr = columns[2];
    const subAccountIndexationStr = columns[3];
    
    if (isNaN(year) || !['I', 'II', 'III', 'IV'].includes(quarter)) continue;
    
    // Parse percentage strings (e.g., "112.02%" -> 1.1202)
    const accountIndexation = parsePercentage(accountIndexationStr);
    const subAccountIndexation = parsePercentage(subAccountIndexationStr);
    
    if (accountIndexation === null || subAccountIndexation === null) continue;
    
    data.push({
      year,
      quarter,
      accountIndexation,
      subAccountIndexation,
    });
  }
  
  return data;
}

/**
 * Parse percentage string to decimal
 * "112.02%" -> 1.1202
 */
function parsePercentage(percentageStr: string): number | null {
  if (!percentageStr) return null;
  
  // Remove % and convert to decimal
  const cleanStr = percentageStr.replace('%', '').trim();
  const value = parseFloat(cleanStr);
  
  if (isNaN(value)) return null;
  
  return value / 100; // Convert percentage to decimal
}

/**
 * Get remaining life expectancy in months for given age and month
 */
export function getRemainingLifeMonths(
  lifespanData: GUSLifespanData,
  age: number,
  month: number
): number {
  // Find the closest age in the data
  let closestAge = age;
  
  // If exact age not found, find closest
  if (!lifespanData[age]) {
    const ages = Object.keys(lifespanData).map(Number).sort((a, b) => a - b);
    
    // Find closest age
    for (let i = 0; i < ages.length; i++) {
      if (ages[i] >= age) {
        closestAge = ages[i];
        break;
      }
    }
    
    // If no age found, use the highest available
    if (!lifespanData[closestAge]) {
      closestAge = ages[ages.length - 1];
    }
  }
  
  const ageData = lifespanData[closestAge];
  if (!ageData) return 0;
  
  // Get the month data (0-11)
  const monthIndex = Math.max(0, Math.min(11, month));
  return ageData[monthIndex] || 0;
}

/**
 * Get valorization parameters for given year and quarter
 */
export function getValorizationParams(
  valorizationData: ValorizationParams[],
  year: number,
  quarter: 'I' | 'II' | 'III' | 'IV'
): ValorizationParams | null {
  return valorizationData.find(
    params => params.year === year && params.quarter === quarter
  ) || null;
}

/**
 * Get the appropriate quarterly indexation based on pension determination quarter
 * According to the rules:
 * - Q1: use Q3 of previous year
 * - Q2: use Q4 of previous year  
 * - Q3: use Q1 of current year
 * - Q4: use Q2 of current year
 */
export function getIndexationQuarterForPensionDetermination(
  determinationYear: number,
  determinationQuarter: 'I' | 'II' | 'III' | 'IV'
): { year: number; quarter: 'I' | 'II' | 'III' | 'IV' } {
  switch (determinationQuarter) {
    case 'I':
      return { year: determinationYear - 1, quarter: 'III' };
    case 'II':
      return { year: determinationYear - 1, quarter: 'IV' };
    case 'III':
      return { year: determinationYear, quarter: 'I' };
    case 'IV':
      return { year: determinationYear, quarter: 'II' };
  }
}

/**
 * Apply quarterly indexation to capital
 */
export function applyQuarterlyIndexation(
  capital: number,
  valorizationData: ValorizationParams[],
  year: number,
  quarter: 'I' | 'II' | 'III' | 'IV'
): number {
  const params = getValorizationParams(valorizationData, year, quarter);
  if (!params) {
    console.warn(`No valorization params found for ${year} Q${quarter}`);
    return capital; // Return unchanged if no data
  }
  
  return capital * params.accountIndexation;
}

/**
 * Apply sub-account quarterly indexation to capital
 */
export function applySubAccountQuarterlyIndexation(
  capital: number,
  valorizationData: ValorizationParams[],
  year: number,
  quarter: 'I' | 'II' | 'III' | 'IV'
): number {
  const params = getValorizationParams(valorizationData, year, quarter);
  if (!params) {
    console.warn(`No valorization params found for ${year} Q${quarter}`);
    return capital; // Return unchanged if no data
  }
  
  return capital * params.subAccountIndexation;
}
