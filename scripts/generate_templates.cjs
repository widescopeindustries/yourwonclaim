const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../product/templates');
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

const commonIntro = (condition) => `# EVIDENCE LOG
## For ${condition} VA Disability Claims

### THE SMOKING GUN EVIDENCE
After years of navigating the VA claims process—as veterans ourselves—we discovered something that changes everything: **the single most powerful piece of evidence you can submit isn't officially part of a Fully Developed Claim.**

> **"No more convincing. Just corroboration."**

When you walk into a C&P exam without this documentation, the examiner's job is to **investigate whether your condition exists and how severe it is.** They're playing detective. You're trying to convince them.

When you walk in WITH a properly completed Evidence Log, the dynamic completely shifts. The examiner's job becomes **corroborating what you've already documented.** They're not investigating—they're verifying. That's a fundamentally different exam.

### HOW VA RATERS ACTUALLY EVALUATE YOUR CLAIM
Every VA disability rating—regardless of condition—is based on three core factors. Raters are trained to look for evidence of these specific elements:

| FACTOR | WHAT IT MEANS | WHAT RATERS LOOK FOR |
| :--- | :--- | :--- |
| **FREQUENCY** | How often do your symptoms occur? | Daily? Weekly? Constant? with specific triggers? |
| **SEVERITY** | How intense are your symptoms when they occur? | Pain levels (1-10)? Range of Motion loss? Duration? |
| **FUNCTIONAL IMPACT** | How do symptoms affect your daily life? | Can't work? Can't sleep? Can't lift kids? Missed events? |

**Why This Evidence Log Works:** The template you're about to use is specifically designed to capture all three factors in a format that's easy for raters to process. When a rater opens your file and sees 30 days of documented symptoms with frequency, severity, and functional impact clearly recorded, they don't have to guess or interpret. The evidence speaks for itself.

**DO NOT FILE ANY CLAIM UNTIL THIS LOG IS COMPLETED AND INCLUDED WITH YOUR SUBMISSION**

---
`;

const commonOutro = (name, dc, start_date_label = "START DATE") => `
### YOUR EVIDENCE LOG: 30-DAY TEMPLATE
**Instructions:** Complete one row per day for at least 30 consecutive days.

**VETERAN NAME:** ________________________________________ **CLAIM #:** _________________________
**CONDITION:** ${name} (${dc}) **${start_date_label}:** _________________________

| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Day 1 | | | |
| Day 2 | | | |
| Day 3 | | | |
| ... | | | |
| Day 30| | | |

*Note: Print this page multiple times to cover 30 days.*
`;

const conditions = [
    {
        file: "Knee_Pain_Evidence_Log_Template.md",
        name: "Knee Conditions (Limitation of Flexion/Extension)",
        dc: "DC 5260/5261",
        guidance: `
### KNEE CONDITIONS: CONDITION-SPECIFIC GUIDANCE
Knee ratings are primarily based on **Range of Motion (ROM)** limitations (Flexion and Extension) and **Pain on Motion**.
*   **Flexion:** How far can you bend it back?
*   **Extension:** Can you straighten it fully?
*   **Instability:** Does it give way?

**Key Concept: The "Flare-up" Rule (DeLuca v. Brown)**
Even if your knees are "okay" during the exam, you must document how they are **during a flare-up**. If you can't walk after 20 minutes of standing, that is your functional reality.

**What to Log:**
*   **Pain:** Is it 3/10 normally but 8/10 after stairs?
*   **Locking/Popping:** Does the knee lock up?
*   **Giving Way:** Did you stumble or fall?
*   **Functional Loss:** needing a brace, cane, or elevator.
        `,
        rating_table: `
| RATING | LIMITATION |
| :--- | :--- |
| **0%** | Full range but with pain on motion (The minimum rating if pain is present). |
| **10%** | Flexion limited to 45° OR Extension limited by 10°. |
| **20%** | Flexion limited to 30° OR Extension limited by 15°. |
| **30%** | Flexion limited to 15° OR Extension limited by 20°. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 0800 | Stiffness 6/10. Could not straighten right leg fully. | Took elevator instead of stairs. Limped for first hour. |
| Tue 1/7 | 1800 | **FLARE-UP** after walking dog. Knee gave way twice. Swelling visible. Pain 8/10. | Iced knee for 2 hours. Could not do yard work. |
        `
    },
    {
        file: "Shoulder_Pain_Evidence_Log_Template.md",
        name: "Shoulder Conditions (Limitation of Motion)",
        dc: "DC 5201",
        guidance: `
### SHOULDER CONDITIONS: CONDITION-SPECIFIC GUIDANCE
Shoulder ratings are heavily dependent on **Range of Motion (ROM)**—specifically how high you can raise your arm (Flexion/Abduction) and **Painful Motion**.

**What to Log:**
*   **Overhead Reach:** Can you wash your hair? Reach a high shelf?
*   **Painful Arc:** At what point does the pain start when lifting your arm?
*   **Weakness:** Dropping items?
*   **Sleep:** Does rolling onto the shoulder wake you up?
        `,
        rating_table: `
| RATING | LIMITATION |
| :--- | :--- |
| **20%** | Motion limited to shoulder level (90°). |
| **30%** | Motion limited to midway between side and shoulder level. |
| **40%** | Severe limitation (25° from side). |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 0700 | Sharp pain 7/10 when reaching for coffee cup. "Catching" sensation. | Dropped mug. Used left hand to dress myself. |
| Tue 1/7 | Night | Deep ache 5/10. Woke up 3 times due to pain when turning. | Fatigue all day due to poor sleep. Irritable at work. |
        `
    },
    {
        file: "Neck_Pain_Evidence_Log_Template.md",
        name: "Neck Pain (Cervical Strain)",
        dc: "DC 5237",
        guidance: `
### NECK CONDITIONS: CONDITION-SPECIFIC GUIDANCE
The VA rates the neck (Cervical Spine) based on **Range of Motion (ROM)** and **Incapacitating Episodes**.

**What to Log:**
*   **Stiffness:** Can you look over your shoulder to change lanes?
*   **Radiculopathy:** Numbness/tingling radiating down into arms/fingers? (Log this carefully!)
*   **Spasms:** Muscle tightness causing head tilt?
        `,
        rating_table: `
| RATING | LIMITATION |
| :--- | :--- |
| **10%** | Pain/Tenderness or mild limitation of motion. |
| **20%** | Forward flexion limited to 30° or combined ROM limited. |
| **30%** | Forward flexion limited to 15°. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 1700 | Neck locked up after computer work. Spasms. Pain 7/10. | Had to lie flat on floor. Could not drive home—wife picked me up. |
| Tue 1/7 | All day | Tingling in right thumb/index finger (Radiculopathy). | Dropped pen twice. Difficulty typing. |
        `
    },
    {
        file: "Radiculopathy_Evidence_Log_Template.md",
        name: "Radiculopathy (Sciatica/Nerve Pain)",
        dc: "DC 8520/8620",
        guidance: `
### RADICULOPATHY: CONDITION-SPECIFIC GUIDANCE
Radiculopathy is nerve pain caused by compression in the spine. It is often **secondary** to back or neck conditions.
*   **Sciatica:** Lower back down the leg.
*   **Cervical:** Neck down the arm.

**What to Log:**
*   **Sensation:** Numbness, tingling, "pins and needles," burning.
*   **Weakness:** Foot drop? Dropping items? Trouble gripping?
*   **Trigger:** Sneezing, sitting too long?
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | Mild: Subjective symptoms, minor sensation loss. |
| **20%** | Moderate: Some weakness, absent reflexes, distinct sensation loss. |
| **40%** | Severe: Marked weakness, muscle atrophy. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 1400 | Burning pain shooting down left leg to toes. 8/10. | Had to stand up during meeting. Could not sit >15 mins. |
| Tue 1/7 | 0900 | Numbness in right foot. Tripped on carpet. | "Foot drop" sensation. Afraid to carry baby. |
        `
    },
    {
        file: "Anxiety_Depression_Evidence_Log_Template.md",
        name: "Anxiety & Depression (Mental Health)",
        dc: "DC 9400 series",
        guidance: `
### MENTAL HEALTH: CONDITION-SPECIFIC GUIDANCE
Unlike PTSD, generalized anxiety or depression focuses on **social and occupational impairment**.
*   **Occupational:** Efficiency, reliability, conflict with co-workers.
*   **Social:** Isolation, relationships, family dynamics.

**What to Log:**
*   **Panic Attacks:** Duration and triggers.
*   **Motivation:** Hygiene, getting out of bed.
*   **Mood:** Irritability, sadness, hopelessness.
        `,
        rating_table: `
| RATING | IMPAIRMENT |
| :--- | :--- |
| **30%** | Occasional decrease in work efficiency. |
| **50%** | Reduced reliability and productivity. Panic attacks. |
| **70%** | Deficiencies in most areas (work, school, family). Suicidal ideation. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | All day | Low mood. "Heavy" feeling. Zero motivation. | Called in sick. Stayed in bed until 1600. Did not shower. |
| Tue 1/7 | 1000 | Panic attack in grocery store (crowds). Chest tight. | Abandoned cart and left. Wife had to shop. |
        `
    },
    {
        file: "IBS_Evidence_Log_Template.md",
        name: "IBS (Irritable Bowel Syndrome)",
        dc: "DC 7319",
        guidance: `
### IBS: CONDITION-SPECIFIC GUIDANCE
IBS ratings are based on **Frequency** and **Severity** of episodes (diarrhea, constipation, abdominal distress).

**What to Log:**
*   **Episodes:** How many times did you go? Urgency?
*   **Pain:** Cramping, bloating.
*   **Distress:** Nausea, vomiting.
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | Moderate: Frequent episodes of bowel disturbance. |
| **30%** | Severe: Diarrhea, or alternating with constipation, with more or less constant abdominal distress. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 0900 | Severe cramping 7/10. Urgent diarrhea (4 times in 2 hours). | Late to work. Afraid to leave near-bathroom area. |
| Tue 1/7 | All day | Bloating and constipation. Pain 5/10. | Could not eat lunch. Distracted at desk. |
        `
    },
    {
        file: "GERD_Evidence_Log_Template.md",
        name: "GERD (Acid Reflux)",
        dc: "DC 7346",
        guidance: `
### GERD: CONDITION-SPECIFIC GUIDANCE
GERD is rated on symptoms like **regurgitation**, **dysphagia** (difficulty swallowing), and **pyrosis** (heartburn).

**What to Log:**
*   **Pain:** Burning chest pain (substernal).
*   **Regurgitation:** Acid coming up throat?
*   **Swallowing:** Food getting stuck?
*   **Sleep:** Choking on acid at night?
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | Persistently recurrent epigastric distress with dysphagia/pyrosis. |
| **30%** | Persistently recurrent... with significant impairment of health. |
| **60%** | Severe impairment of health (weight loss, anemia). |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 0200 | Woke up choking on acid. Burning throat 8/10. | Could not return to sleep. Exhausted next day. |
| Tue 1/7 | 1800 | Food stuck in throat (Dysphagia) during dinner. Painful. | Stopped eating. Anxiety about swallowing. |
        `
    },
    {
        file: "Plantar_Fasciitis_Evidence_Log_Template.md",
        name: "Plantar Fasciitis (Foot Pain)",
        dc: "DC 5269",
        guidance: `
### PLANTAR FASCIITIS: CONDITION-SPECIFIC GUIDANCE
Rated on **pain** and **relief mechanisms** (orthotics, surgery). The key is whether it affects your ability to stand or walk.

**What to Log:**
*   **First Steps:** Is the pain worst in the morning?
*   **Standing:** How long can you stand before pain starts?
*   **Relief:** Do orthotics help?
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | Moderate: Foot pain, treated by orthotics. |
| **20%** | Severe: Unilateral (one foot) - extreme tenderness. |
| **30%** | Severe: Bilateral (both feet) - extreme tenderness, relief not provided by orthotics. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 0600 | "Stabbing" heel pain upon getting out of bed. 8/10. | Had to hold wall to walk to bathroom. Hobbled for 30 mins. |
| Tue 1/7 | 1400 | Deep ache 6/10 after standing 1 hour. | Had to sit down at work. Could not stand in line at store. |
        `
    },
    {
        file: "Sinusitis_Rhinitis_Evidence_Log_Template.md",
        name: "Sinusitis & Rhinitis",
        dc: "DC 6510/6522",
        guidance: `
### SINUS/NOSE: CONDITION-SPECIFIC GUIDANCE
*   **Sinusitis:** Headaches, pain, tenderness, purulent discharge (pus). Rated on **Incapacitating Episodes** (antibiotics/bed rest).
*   **Rhinitis:** Blockage (Polyps), obstruction. Rated on airflow.

**What to Log:**
*   **Congestion:** Cannot breathe through nose? (50% or 100% blockage?)
*   **Headaches:** Sinus pressure.
*   **Incapacitating:** Did you need bed rest? Antibiotics?
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | 1-2 incapacitating episodes per year OR 50% obstruction (Rhinitis). |
| **30%** | 3+ incapacitating episodes per year OR 100% obstruction (Rhinitis). |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | All day | 100% blockage left nostril. Sinus pressure headache 6/10. | Mouth breathing all day. Dry throat. Difficulty sleeping. |
| Tue 1/7 | - | **INCAPACITATING EPISODE.** Fever, green discharge. | Called in sick. Bed rest prescribed. Started Amoxicillin. |
        `
    },
    {
        file: "Hypertension_Evidence_Log_Template.md",
        name: "Hypertension (High Blood Pressure)",
        dc: "DC 7101",
        guidance: `
### HYPERTENSION: CONDITION-SPECIFIC GUIDANCE
Hypertension is strictly rated on **Blood Pressure Readings**.
However, a log is useful to show the **trend** (diastolic > 100?) and **symptoms** (dizziness) to support the diagnosis or secondary claims.

**What to Log:**
*   **Readings:** Take AM and PM readings.
*   **Symptoms:** Headache, dizziness, fatigue.
        `,
        rating_table: `
| RATING | READINGS |
| :--- | :--- |
| **10%** | Diastolic 100-109 OR Systolic 160-199. |
| **20%** | Diastolic 110-119 OR Systolic 200+. |
| **40%** | Diastolic 120+. |
        `,
        example: `
| DATE | TIME | READINGS & SYMPTOMS | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 0800 | 162/104. Headache 4/10. | Felt dizzy standing up quickly. Took meds. |
| Tue 1/7 | 2000 | 158/98. Fatigue. | Went to bed early. |
        `
    },
    {
        file: "Asthma_Evidence_Log_Template.md",
        name: "Asthma",
        dc: "DC 6602",
        guidance: `
### ASTHMA: CONDITION-SPECIFIC GUIDANCE
Rated on **FEV-1** tests OR **Medication Usage** (Inhalers/Steroids).
*   **Daily Inhaler:** Usually 30%.
*   **Systemic Steroids (Prednisone):** Intermittent = 30%, Daily/High dose = 60% or 100%. 

**What to Log:**
*   **Attacks:** Shortness of breath, wheezing.
*   **Meds:** "Used Albuterol rescue inhaler 2x."
*   **Triggers:** Exercise, allergens?
        `,
        rating_table: `
| RATING | CRITERIA |
| :--- | :--- |
| **10%** | Intermittent inhaler use. |
| **30%** | Daily inhaler use OR anti-inflammatory meds. |
| **60%** | 3+ courses of systemic steroids (Prednisone) per year. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 1400 | Wheezing after climbing stairs. Chest tight. | Used Rescue Inhaler. Had to sit for 10 mins to catch breath. |
| Tue 1/7 | Night | Coughing fit. Woke from sleep. | Disrupted sleep. Fatigue. |
        `
    },
    {
        file: "Peripheral_Neuropathy_Evidence_Log_Template.md",
        name: "Peripheral Neuropathy (Nerve Damage)",
        dc: "DC 8520-8720",
        guidance: `
### NEUROPATHY: CONDITION-SPECIFIC GUIDANCE
Commonly secondary to Diabetes or Back issues.
Rated on **paralysis** (complete) or **neuritis/neuralgia** (pain/numbness).

**What to Log:**
*   **Sensory:** Loss of feeling (numb toes), burning, tingling.
*   **Motor:** Weakness, tripping, inability to button shirt (hands).
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | Mild: Tingling, minor interference. |
| **20%** | Moderate: Numbness, some reflex loss. |
| **40%** | Severe: Marked interference with function. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | All day | Burning "fire" sensation in feet. 7/10. | Could not wear boots—wore sneakers to work. |
| Tue 1/7 | Night | Numbness in hands. | Dropped glass of water. Trouble gripping steering wheel. |
        `
    },
    {
        file: "Hip_Pain_Evidence_Log_Template.md",
        name: "Hip Pain (Limitation of Motion)",
        dc: "DC 5250-5255",
        guidance: `
### HIP CONDITIONS: CONDITION-SPECIFIC GUIDANCE
Rated on **Range of Motion** (Extension, Flexion, Rotation).
Also consider **Painful Motion**.

**What to Log:**
*   **Stiffness:** Trouble tying shoes? Getting in/out of car?
*   **Walking:** Pain after X distance?
*   **Rotation:** Pain when twisting?
        `,
        rating_table: `
| RATING | LIMITATION |
| :--- | :--- |
| **10%** | Painful motion or mild limitation. |
| **20%** | Moderate limitation of flexion/abduction. |
| **40%** | Marked limitation. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 0800 | Sharp pain 6/10 getting out of car. | Had to lift leg with hands to exit vehicle. |
| Tue 1/7 | All day | Deep ache. Stiffness. | Cannot put on socks without help. |
        `
    },
    {
        file: "Ankle_Pain_Evidence_Log_Template.md",
        name: "Ankle Pain (Limitation of Motion)",
        dc: "DC 5271",
        guidance: `
### ANKLE CONDITIONS: CONDITION-SPECIFIC GUIDANCE
Rated on **Range of Motion** (Dorsiflexion/Plantar Flexion).
**Instability:** Does it roll easily?

**What to Log:**
*   **Swelling:** Especially after standing.
*   **Stiffness:** Trouble walking up slopes?
*   **Rolling:** "Near miss" falls.
        `,
        rating_table: `
| RATING | LIMITATION |
| :--- | :--- |
| **10%** | Moderate limitation. |
| **20%** | Marked limitation (can't point toe or pull up). |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 1700 | Swollen right ankle after shift. Pain 5/10. | Elevated leg all evening. |
| Tue 1/7 | 1200 | Ankle "rolled" on uneven pavement. Sharp pain. | Limped remainder of day. Wore brace. |
        `
    },
    {
        file: "Elbow_Pain_Evidence_Log_Template.md",
        name: "Elbow Pain & Tendonitis",
        dc: "DC 5206",
        guidance: `
### ELBOW CONDITIONS: CONDITION-SPECIFIC GUIDANCE
Rated on **Flexion** (bending) and **Extension** (straightening).
**Tennis Elbow (Lateral Epicondylitis)** is common.

**What to Log:**
*   **Grip:** Does pain shoot up arm when gripping?
*   **Extension:** Can you straighten arm fully?
*   **Weakness:** Lifting milk jug?
        `,
        rating_table: `
| RATING | LIMITATION |
| :--- | :--- |
| **10%** | Flexion limited to 100° or Extension limited to 45°. |
| **20%** | Flexion limited to 90° or Extension limited to 60°. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 0800 | Sharp pain 7/10 when lifting coffee pot. | Dropped pot. Weak grip strength. |
| Tue 1/7 | All day | Ache in elbow. Stiffness. | Trouble using screwdriver at work. |
        `
    },
    {
        file: "Wrist_Carpal_Tunnel_Evidence_Log_Template.md",
        name: "Wrist Pain & Carpal Tunnel",
        dc: "DC 5215 / 8515",
        guidance: `
### WRIST/CARPAL TUNNEL: CONDITION-SPECIFIC GUIDANCE
*   **Wrist:** Rated on Motion (bending up/down).
*   **Carpal Tunnel:** Rated on Nerve paralysis/pain (Median Nerve).

**What to Log:**
*   **Numbness:** First three fingers?
*   **Night:** Does hand numbness wake you up?
*   **Grip:** Dropping things?
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | Mild paralysis/pain. |
| **30%** | Moderate: Weaker grip, trouble with fine movements. |
| **50%** | Severe: Greatly reduced function. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 0300 | Woke up with "dead hand" (numb). Pain 6/10. | Shook hand for 10 mins to restore feeling. Lost sleep. |
| Tue 1/7 | 1400 | Pain typing. Tingling. | Wore wrist brace. Typed slowly. |
        `
    },
    {
        file: "Pes_Planus_Evidence_Log_Template.md",
        name: "Flat Feet (Pes Planus)",
        dc: "DC 5276",
        guidance: `
### FLAT FEET: CONDITION-SPECIFIC GUIDANCE
Rated on **Pain** and **Structural Change** (inward bowing of achilles).
Key is "use upon manipulation" or "use."

**What to Log:**
*   **Arch Pain:** Burning in sole of foot?
*   **Shin Splints:** Pain radiating up leg?
*   **Shoes:** Uneven wear? Need wide shoes?
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | Pain on manipulation/use. |
| **30%** | Severe: Marked pronation, pain, swelling. |
| **50%** | Pronounced: Extreme tenderness, can't walk without orthotics. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 1700 | Deep aching in arches after standing 4 hours. 6/10. | Sat down rest of shift. Iced feet. |
| Tue 1/7 | - | Sharp pain in inner ankle. | Difficulty walking. |
        `
    },
    {
        file: "Eczema_Skin_Evidence_Log_Template.md",
        name: "Eczema & Skin Conditions",
        dc: "DC 7806",
        guidance: `
### SKIN CONDITIONS: CONDITION-SPECIFIC GUIDANCE
Rated on **% of Body Area** affected OR **Treatment Requirement** (Systemic therapy like pills/injections vs. topical).

**What to Log:**
*   **Flare-ups:** Redness, itching, bleeding.
*   **Location:** Exposed areas (face/hands) vs. covered.
*   **Meds:** "Used steroid cream" or "Took Prednisone."
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | 5-19% of body OR intermittent systemic therapy. |
| **30%** | 20-39% of body OR systemic therapy for 6+ weeks/year. |
| **60%** | 40%+ of body OR constant systemic therapy. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | All day | Itching severe 8/10. Bleeding patches on arms. | Embarrassed to wear short sleeves. Constant scratching distracted work. |
| Tue 1/7 | - | Applied high-dose steroid cream 3x. | Painful to shower. |
        `
    },
    {
        file: "Vertigo_Evidence_Log_Template.md",
        name: "Vertigo & Meniere's",
        dc: "DC 6204 / 6205",
        guidance: `
### VERTIGO: CONDITION-SPECIFIC GUIDANCE
Rated on **Frequency of Attacks** and presence of **Staggering gait**.
*   **Meniere's:** Vertigo + Hearing Loss + Tinnitus.

**What to Log:**
*   **Spinning:** Room spinning? How long?
*   **Nausea:** Vomiting?
*   **Walking:** Stumbling? Needing support?
        `,
        rating_table: `
| RATING | FREQUENCY |
| :--- | :--- |
| **10%** | Occasional dizziness. |
| **30%** | Dizziness with staggering gait ~1/month. |
| **60%** | Attacks 1-4 times per month. |
| **100%** | Attacks >1 per week. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 1000 | Sudden room spin. Nausea. Lasted 2 hours. | Had to lie on floor of office. Vomited. Unable to drive. |
| Tue 1/7 | - | Off-balance "boat" sensation. | Held onto walls to walk. |
        `
    },
    {
        file: "TMJ_TMD_Evidence_Log_Template.md",
        name: "TMJ / TMD (Jaw Pain)",
        dc: "DC 9905",
        guidance: `
### TMJ: CONDITION-SPECIFIC GUIDANCE
Rated on **Range of Motion** (Interincisal opening - how wide you can open mouth) in millimeters (mm) and **Dietary restrictions**.

**What to Log:**
*   **Opening:** Can you fit 3 fingers? 2 fingers?
*   **Pain:** Clicking, popping, locking.
*   **Diet:** "Could not chew steak - had soup."
        `,
        rating_table: `
| RATING | LIMITATION |
| :--- | :--- |
| **10%** | Opening 31-40mm OR clicking with pain. |
| **20%** | Opening 21-30mm OR limited to soft foods. |
| **30%** | Opening 11-20mm OR limited to pureed foods. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 1800 | Jaw locked open for moment. Pain 7/10. | Could not eat burger. Ate mashed potatoes. |
| Tue 1/7 | All day | Clicking when talking. Soreness. | Avoided phone calls at work. |
        `
    },
    {
        file: "TBI_Evidence_Log_Template.md",
        name: "TBI (Traumatic Brain Injury)",
        dc: "DC 8045",
        guidance: `
### TBI: CONDITION-SPECIFIC GUIDANCE
TBI is complex. It's rated on **Facets of Cognitive Impairment**: Memory, Judgment, Social Interaction, Orientation, Motor Activity, Visual Spatial, Communication.
**Note:** You get the *highest* rating from any one facet.

**What to Log:**
*   **Memory:** Forgetting appointments? Keys?
*   **Anger:** "Short fuse" (Judgment/Social).
*   **Headaches:** Frequency.
*   **Confusion:** Getting lost?
        `,
        rating_table: `
| RATING | IMPAIRMENT |
| :--- | :--- |
| **10%** | Mild memory loss, occasional headaches. |
| **40%** | Moderate: Hinders work/social frequently. |
| **70%** | Severe: Cannot work, needs supervision. |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 1400 | Forgot doctor appointment completely. | Missed appt. Charged fee. Frustrated/Crying. |
| Tue 1/7 | 1800 | Snapped at kids for noise (Irritability). | Isolated in room. Wife upset. |
        `
    },
    {
        file: "Eye_Conditions_Evidence_Log_Template.md",
        name: "Eye Conditions (Visual Impairment)",
        dc: "DC 6000 series",
        guidance: `
### EYE CONDITIONS: CONDITION-SPECIFIC GUIDANCE
Rated on **Visual Acuity** (20/200 etc.) or **Field of Vision** (Diplopia/Double Vision).
Also **Incapacitating Episodes** (e.g., Conjunctivitis).

**What to Log:**
*   **Blurriness:** Can't read screen?
*   **Pain:** Dry eyes, stabbing pain.
*   **Double Vision:** Seeing two cars?
*   **Light Sensitivity:** Photophobia.
        `,
        rating_table: `
| RATING | SEVERITY |
| :--- | :--- |
| **10%** | Documented pain/incapacitating episodes. |
| **30%+** | Based on Acuity charts (20/40, 20/100, etc). |
        `,
        example: `
| DATE | TIME | SYMPTOMS & SEVERITY | FUNCTIONAL IMPACT |
| :--- | :--- | :--- | :--- |
| Mon 1/6 | 1000 | Blurred vision. Dry, gritty feeling. 6/10. | Increased font size to 150%. Eye drops x4. |
| Tue 1/7 | 2000 | Double vision while driving at night. | Pulled over. Wife had to drive. |
        `
    }
];

conditions.forEach(c => {
    const content = `
${commonIntro(c.name)}
${c.guidance}

**Rating Criteria:**
${c.rating_table}

### COMPLETED EXAMPLE: 7-DAY EVIDENCE LOG
Below is an example of a properly completed Evidence Log.

${c.example}

${commonOutro(c.name, c.dc)}
`;
    fs.writeFileSync(path.join(outputDir, c.file), content);
    console.log(`Generated ${c.file}`);
});
