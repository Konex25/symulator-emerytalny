# ZUS Retirement Simulator – Agent-Optimized Specification

## 1. Introduction

The **Social Insurance Institution (ZUS)** conducts educational initiatives to raise awareness of social insurance and the risks of old age.  
Young workers entering the labor market often lack understanding of their future pension levels and purchasing power.

**Goal:**  
Develop an **educational web application** that visually and intuitively forecasts:
- Future pension amounts,
- Real purchasing power of wages,
- Expected benefit value after retirement.

---

## 2. Data Sources

Primary data:
- Forecast of revenues and expenditures of the Pension Fund up to **2080**, prepared by the **Department of Statistics and Actuarial Forecasts of ZUS**.

Supplementary data:
- **GUS** (Central Statistical Office)
- **NBP** (National Bank of Poland)
- **Ministry of Finance**
- Internal datasets owned by **ZUS**

---

## 3. Basic Requirements

**Platform:**  
- Web-based tool, accessible via the official ZUS website.
- Must comply with **WCAG 2.0** accessibility standards.

**Design:**  
- Visual identity consistent with the **ZUS Brand Book**.

| Color No. | RGB Values | Description |
|------------|-------------|-------------|
| 1 | 255, 179, 79 | Yellow-gold accent |
| 2 | 0, 153, 63 | Primary green |
| 3 | 190, 195, 206 | Gray neutral |
| 4 | 63, 132, 210 | Blue secondary |
| 5 | 0, 65, 110 | Deep blue text |
| 6 | 240, 94, 94 | Red warning |
| 7 | 0, 0, 0 | Black text |

---

## 4. Advanced Requirements

### 4.1. Basic Dashboard

- On the **first screen**, the user is asked:  
  “What pension would you like to have in the future?”
- Contextual information must be provided — comparison with **current average benefit**.
- Display a **chart or visualization** of average pensions per group.
  - Hovering shows group description (e.g., *Below minimum pension*).
  - Example: “Beneficiaries below the minimum pension worked fewer than 25 years (men) or 20 years (women) and did not qualify for the guaranteed minimum pension.”
- Show random **“Did you know?” facts**, e.g.:  
  “Did you know that the highest pension in Poland is received by a resident of Silesia, amounting to X PLN? They worked X years and never took sick leave.”

**Purpose:**  
Introduce user expectations versus forecast reality.

---

### 4.2. Pension Simulation

**Required input fields (MANDATORY):**
- Age  
- Sex  
- Gross salary amount  
- Year of starting work  
- Planned year of ending professional activity *(default = year of reaching retirement age)*

**Optional fields:**
- Funds accumulated in ZUS account and sub-account.

**Options:**
- Checkbox: “Include the possibility of sick leave”  
  → Simulation adjusts for average lifetime sick leave durations by gender.

**Information displayed:**
- Average national sick leave duration and its impact on the benefit.

**Behavior:**
- If funds are not entered manually, they are **estimated based on salary history**.
- Wages are **reverse-indexed** by average national wage growth (NBP/GUS data).
- Both start and end years of work always refer to **January**.
- After entering data, a button appears:  
  `Forecast my future pension`.

---

### 4.3. Result Screen

**Displayed outputs:**
1. **Nominal (actual)** pension amount.  
2. **Real (inflation-adjusted)** pension amount.

**Additional insights:**
- Comparison with forecast **average pension** in the retirement year.
- **Replacement rate** (forecast benefit ÷ indexed wage).
- Wage difference **with and without sick leave**.
- Simulation of pension increase if retiring later:
  - +1 year, +2 years, +5 years.
- Comparison with **user’s desired pension**:
  - If forecast < expected → display message:  
    “You need to work X years longer to achieve your goal.”

---

### 4.4. Pension Simulator Dashboard

- Post-simulation, users access the **Dashboard** for deeper analysis:
  - Enter historical salary data (specific years).
  - Adjust future indexation rates.
  - Input sick leave periods (past and future).
- Display graph: **accumulation growth** in ZUS account and sub-account over time.

---

### 4.5. Report Download

- Users can **download a report (.pdf)** containing:
  - Forecast results,
  - Charts and tables,
  - All input parameters.

---

### 4.6. Postal Code Field

- At the end, request an optional **postal code** input.  
  (Used for regional analysis; not mandatory.)

---

### 4.7. Interest Reporting (Admin Analytics)

**Administrator functionality:**
- Download usage report in `.xls` format.

**Report headers:**
| Field | Description |
|--------|-------------|
| Date of use | Date the simulator was accessed |
| Time of use | Duration of session |
| Expected pension | User’s desired pension value |
| Age | Age entered |
| Sex | Gender selected |
| Salary amount | Gross salary input |
| Sick leave included | Yes/No |
| Funds in account/sub-account | Declared or estimated |
| Actual pension | Nominal forecast value |
| Real pension | Inflation-adjusted value |
| Postal code | Optional regional identifier |

---

## 5. Functional Summary for Agents

| Category | Functionality | Input/Output | Comments |
|-----------|----------------|---------------|-----------|
| **Simulation Input** | Age, sex, salary, start/end years, sick leave toggle, funds (optional) | User data | Default end year = retirement age |
| **Computation Logic** | Pension forecast, inflation adjustment, indexation, sick leave effect | Derived values | Data linked to NBP/GUS |
| **Output** | Real and nominal pension, replacement rate, comparison with expected | Dynamic chart | Includes wage impact and late retirement bonus |
| **Dashboard** | Modify data, simulate scenarios, add illness periods | Interactive | Graph of fund accumulation |
| **Report** | Downloadable .pdf summary | Output file | Contains tables, inputs, and charts |
| **Admin Tools** | Usage report (.xls) | Analytics | Contains demographic and simulation data |
| **UI/UX** | Chart hover details, random facts, WCAG 2.0 compliance | Visual layer | Uses ZUS color palette |

---

## 6. Technical Expectations

- **Web-based application**, responsive, accessible (WCAG 2.0).
- **Charts** and **interactive visualizations** for comparison and simulation.
- **User data handling** compliant with privacy requirements.
- **Server-side data aggregation** for analytics (postal code, demographics).
- **Frontend colors** must align with official ZUS Brand Book.

---

## 7. Summary of Goals

- Raise awareness of retirement planning.
- Provide clear, engaging visualization of pension forecasting.
- Educate users on wage–benefit correlations.
- Enable self-assessment of future pension adequacy.
- Provide statistical feedback for ZUS (interest analytics).

---

**File:** `DETAILS_ZUS_SymulatorEmerytalny.pdf`  
**Converted to:** `ZUS_Retirement_Simulator_agent.md`  
**Language:** English  
**Format:** Structured Markdown for AI agents (lossless and parseable)